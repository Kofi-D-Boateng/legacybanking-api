"use strict";

import axios from "axios";
import { Request, Response } from "express";
import config from "../config/config";
import {
  _getEmailFromCache,
  _getUserFromCache,
  _saveUserToCache,
} from "../utils/redis/query";
import AWS from "aws-sdk";
import { Customer, Notification } from "../models/Customer";

AWS.config.update({
  region: config.AWS.Lambda.region ? config.AWS.Lambda.region[0] : "",
  credentials: {
    accessKeyId: config.AWS.Lambda?.accessKey as string,
    secretAccessKey: config.AWS.Lambda?.secretAccessKey as string,
  },
});

const lambda = new AWS.Lambda();

export const getProfile: (req: Request, res: Response) => void = async (
  req,
  res
) => {
  const token: string | undefined = req.get("authorization");
  const apiKey = req.params["apiKey"]
    ? req.params["apiKey"]
    : req.query["apiKey"];

  if (!token || !apiKey) {
    res.status(401).json("Unauthorized");
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

  const customer: Customer | null = await _getUserFromCache(apiKey as string);
  if (!customer) {
    const notificationLambdaResponse = await lambda
      .invoke({
        FunctionName: config.AWS.Lambda.functionNames?.at(1) as string,
        InvocationType: "RequestResponse",
        Payload: JSON.stringify({
          Function: "getNotifications",
          Payload: authStatus["payload"],
        }),
      })
      .promise();
    const notifObject = JSON.parse(
      notificationLambdaResponse.Payload?.toString() as string
    );
    if (
      notificationLambdaResponse.StatusCode != 200 ||
      notifObject["status"] != 200
    ) {
      res.status(500).json("");
      return;
    }
    const bankResponse = await axios.get(
      `${config.Microservices.Bank}/${config.Routes.BankingService.getFullCustomerInfo}`,
      { params: { username: authStatus["body"] } }
    );
    if (bankResponse.status != 200) {
      res.status(bankResponse.status).json("");
      return;
    }
    const customerDetails = bankResponse.data;
    const newCustomer: Customer = new Customer(
      customerDetails.firstName,
      customerDetails.lastName,
      customerDetails.email,
      customerDetails.country,
      customerDetails.area,
      customerDetails.zipcode,
      customerDetails.isActivated,
      customerDetails.transactions,
      customerDetails.accounts,
      customerDetails.cards,
      customerDetails.notifications
    );
    newCustomer.notifications = notifObject["body"][
      "notifications"
    ] as Notification[];
    await _saveUserToCache(apiKey as string, newCustomer);
    res.status(200).json(newCustomer);
    return;
  } else {
    res.status(200).json(customer);
  }
};
