"use strict";
import { Response, Request } from "express";
import axios from "axios";
import { LoginRequest } from "../types/LoginRequest";
import config from "../config/config";
import { Registration } from "../types/Registration";
import AWS from "aws-sdk";
import {
  _clearUserFromRedisCache,
  _getUserFromCache,
  _saveUserToCache,
} from "../utils/redis/query";

AWS.config.update({
  region: config.AWS.Lambda.region ? config.AWS.Lambda.region[0] : "",
  credentials: {
    accessKeyId: config.AWS.Lambda?.accessKey as string,
    secretAccessKey: config.AWS.Lambda?.secretAccessKey as string,
  },
});

const lambda = new AWS.Lambda();

export const loginCustomer: (req: Request, res: Response) => void = (
  req,
  res
) => {
  const loginRequest: LoginRequest = req.body;

  if (
    !loginRequest.email ||
    loginRequest.email.trim().length <= 0 ||
    !loginRequest.password ||
    loginRequest.password.trim().length <= 0
  ) {
    res.status(401);
    return;
  }

  lambda
    .invoke({
      FunctionName: config.AWS.Lambda.functionNames?.at(0) as string,
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({ Function: "loginUser", Payload: loginRequest }),
    })
    .promise()
    .then((response) => {
      const returnedObject = JSON.parse(response.Payload?.toString() as string);
      res.status(200).json(returnedObject["body"]);
    })
    .catch((err) => {
      console.log(err);
      res.status(401).json("");
    });
};

export const getRefreshToken: (req: Request, res: Response) => void = (
  req,
  res
) => {
  const token: string | undefined = req.get("authorization");
  const apiKey = req.params["apiKey"]
    ? req.params["apiKey"]
    : req.query["apiKey"];

  if (!token || token.trim().length <= 0 || !apiKey) {
    res.status(401);
    return;
  }

  const customer = _getUserFromCache(apiKey as string);

  if (!customer) {
    res.status(401).json("");
    return;
  }

  lambda
    .invoke({
      FunctionName: config.AWS.Lambda.functionNames?.at(0) as string,
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({
        Function: "getRefreshToken",
        Payload: token,
      }),
    })
    .promise()
    .then((response) => {
      const returnedObject = JSON.parse(response.Payload?.toString() as string);
      res.status(200).json(returnedObject["body"]);
    })
    .catch((err) => {
      console.log(err);
      res.status(401).json("");
    });
};

export const logoutCustomer: (req: Request, res: Response) => void = (
  req,
  res
) => {
  const token: string | undefined = req.get("authorization");
  const apiKey = req.query["apiKey"];
  if (!token || token.trim().length <= 0 || !apiKey) {
    res.status(401).json("Unauthorized");
    return;
  }

  lambda
    .invoke({
      FunctionName: config.AWS.Lambda.functionNames?.at(0) as string,
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({ Function: "authenticateUser", Payload: token }),
    })
    .promise()
    .then(() => {
      _clearUserFromRedisCache(token);
      res.status(200).json("");
    })
    .catch((reason) => {
      console.log(reason["message"]);
      res.status(401).json("Unauthorized");
    });
};

export const confirmCustomerRegistration: (
  req: Request,
  res: Response
) => void = (req, res) => {
  const token: string | undefined = req.params["token"];

  if (!token || token.trim().length <= 0) {
    res.status(401);
    return;
  }

  lambda
    .invoke({
      FunctionName: config.AWS.Lambda.functionNames?.at(0) as string,
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({ Function: "confirmUser", Payload: token }),
    })
    .promise()
    .then(() => res.status(200).json(""))
    .catch((reason) => {
      console.log(reason["message"]);
      res.status(401).json("Unauthorized");
    });
};

export const registerCustomer: (req: Request, res: Response) => void = (
  req,
  res
) => {
  const authToken: string | undefined = req.get("authorization");
  const registrationRequest: Registration = req.body;

  if (
    !registrationRequest.employeeId ||
    registrationRequest.employeeId.trim().length <= 0 ||
    !authToken ||
    authToken.trim().length <= 0
  ) {
    res.status(401);
    return;
  }

  axios
    .post(
      `${config.Microservices.Bank}/${config.Routes.BankingService.registerCustomer}`,
      registrationRequest
    )
    .then(() => res.status(200))
    .catch((reason) => {
      console.log(reason["message"]);
      res.status(reason["response"]["status"]).json("Unauthorized");
    });
};
