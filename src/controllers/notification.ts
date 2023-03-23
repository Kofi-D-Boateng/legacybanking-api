"use strict";

import axios from "axios";
import AWS from "aws-sdk";
import { Response, Request } from "express";
import config from "../config/config";
import { _getUserFromCache, _updateNotifications } from "../utils/redis/query";
import { Customer } from "../models/Customer";

AWS.config.update({
  region: config.AWS.Lambda.region ? config.AWS.Lambda.region[0] : "",
  credentials: {
    accessKeyId: config.AWS.Lambda?.accessKey as string,
    secretAccessKey: config.AWS.Lambda?.secretAccessKey as string,
  },
});

const lambda = new AWS.Lambda();

export const getNewVerificationLink: (req: Request, res: Response) => void = (
  req,
  res
) => {
  const email: string | undefined = req.params["email"]
    ? req.params["email"]
    : (req.query["email"] as string | undefined);

  if (!email || email.trim().length <= 0) {
    res.status(401).json();
    return;
  }

  axios
    .post(
      `${config.Microservices.Bank}/${config.Routes.BankingService.generateNewVerificationLink}`,
      { email: email }
    )
    .then(() => res.status(200).json())
    .catch((reason) => {
      console.log(reason);
      res.status(401).json();
    });
};

export const updateBilling: (req: Request, res: Response) => void = async (
  req,
  res
) => {
  const token: string | undefined = req.get("authorization");
  const { choice, apiKey } = req.body;
  if (!token || choice == undefined || !apiKey) {
    res.status(401).json();
  }

  const lambdaResponse = await lambda
    .invoke({
      FunctionName: config.AWS.Lambda.functionNames?.at(0) as string,
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({
        Function: "authenticateUser",
        Payload: token,
      }),
    })
    .promise();
  const authStatus = JSON.parse(lambdaResponse.Payload?.toString() as string);
  if (authStatus["status"] == 401) {
    res.status(authStatus["status"]).json("");
    return;
  }

  const customer: Customer | null = await _getUserFromCache(apiKey as string);
  if (!customer) {
    throw new Error(`[ERROR]: Customer for key: ${apiKey} does not exist`);
  }

  const request: { email: string; choice: string } = {
    email: customer.email,
    choice: choice,
  };

  lambda
    .invoke({
      FunctionName: config.AWS.Lambda.functionNames?.at(1) as string,
      InvocationType: "Event",
      Payload: JSON.stringify({
        Function: "updateBilling",
        Payload: request,
      }),
    })
    .promise()
    .then(() => res.status(200).json(""))
    .catch((err) => res.status(500).json(""));
};

export const updateNotifications: (
  req: Request,
  res: Response
) => void = async (req, res) => {
  const token: string | undefined = req.get("authorization");
  const body: { msgId: string | undefined; apiKey: string | undefined } =
    req.body;
  if (!token || !body.msgId || !body.apiKey) {
    res.status(401).json("");
    return;
  }
  const lambdaResponse = await lambda
    .invoke({
      FunctionName: config.AWS.Lambda.functionNames?.at(0) as string,
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({
        Function: "authenticateUser",
        Payload: token,
      }),
    })
    .promise();
  const authStatus = JSON.parse(lambdaResponse.Payload?.toString() as string);
  if (authStatus["status"] == 401) {
    res.status(authStatus["status"]).json("");
    return;
  }

  const customer: Customer | null = await _getUserFromCache(
    body.apiKey as string
  );
  if (!customer) {
    throw new Error(`[ERROR]: Customer for key: ${body.apiKey} does not exist`);
  }

  const request: {
    email: string;
    msgId: string | undefined;
    apiKey: string | undefined;
  } = { email: customer?.email, msgId: body!.msgId, apiKey: body!.apiKey };
  lambda
    .invoke({
      FunctionName: config.AWS.Lambda.functionNames?.at(1) as string,
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({
        Function: "updateNotification",
        Payload: request,
      }),
    })
    .promise()
    .then((response) => {
      const returnedPayload = JSON.parse(
        response.Payload?.toString() as string
      );
      if (returnedPayload["status"] != 200) {
        throw new Error("Error returned from updating notifications in lambda");
      }
      _updateNotifications(
        body.apiKey as string,
        returnedPayload["body"]["notifications"]
      );
      res.status(200).json(returnedPayload["body"]["notifications"]);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json("");
    });
};
