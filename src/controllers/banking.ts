"use strict";
import axios from "axios";
import * as RabbitMq from "amqplib";
import AWS from "aws-sdk";
import { Request, Response } from "express";
import { Bank } from "../types/Bank";
import {
  TransactionRequest,
  TransactionEnv,
} from "../types/TransactionRequest";
import {
  _getBankInfoFromCache,
  _saveBankInfoToCache,
} from "../utils/redis/query";
import config from "../config/config";
import { BrokerExchange, RoutingKey, Type } from "../enums/Amqp";
import { AccountTransferRequest } from "../models/AccountTransferRequest";
import { ATMTransactionRequest } from "../models/ATMTransactionRequest";
import { VendorTransactionRequest } from "../models/VendorTransactionRequest";
import { MessageBrokerSingleton } from "../models/MessageBrokerSingleton";

AWS.config.update({
  region: config.AWS.Lambda.region ? config.AWS.Lambda.region[0] : "",
  credentials: {
    accessKeyId: config.AWS.Lambda?.accessKey as string,
    secretAccessKey: config.AWS.Lambda?.secretAccessKey as string,
  },
});

const lambda = new AWS.Lambda();

const MessageBroker = MessageBrokerSingleton.getBroker();

export const processTransaction: (req: Request, res: Response) => void = async (
  req,
  res
) => {
  const token: string | undefined = req.get("authorization");
  const transactionRequest: TransactionRequest = req.body;
  console.log(transactionRequest);
  if (transactionRequest.transactionEnv == TransactionEnv.ATM) {
    const request: ATMTransactionRequest = new ATMTransactionRequest(
      transactionRequest
    );
    console.log(request);
    const result = await atmTransaction(request);
    if (result) {
      res.status(200).json();
      return;
    }
    res.status(400).json("");
  } else if (transactionRequest.transactionEnv == TransactionEnv.VENDOR) {
    const request: VendorTransactionRequest = new VendorTransactionRequest(
      transactionRequest
    );
    const result = await vendorTransaction(request);
    if (result) {
      res.status(200).json();
      return;
    }
    res.status(400).json("");
  } else if (
    transactionRequest.transactionEnv == TransactionEnv.MOBILE ||
    transactionRequest.transactionEnv == TransactionEnv.ONLINE
  ) {
    if (!token || !transactionRequest.apiKey) {
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
    if (lambdaResponse.StatusCode != 200 || authStatus["status"] == 401) {
      res.status(authStatus["status"] || lambdaResponse.StatusCode).json("");
      return;
    }

    const request: AccountTransferRequest = new AccountTransferRequest(
      transactionRequest
    );
    const result = await onlineTransaction(request);
    if (result) {
      res.status(200).json();
      return;
    }
    res.status(400).json("");
  } else {
    res.status(400).json("");
  }
};
export const getBankInfo: (req: Request, res: Response) => void = async (
  req,
  res
) => {
  const Bank: Bank | null = await _getBankInfoFromCache();
  if (!Bank) {
    axios
      .get(
        `${config.Microservices.Bank}/${config.Routes.BankingService.getBankInfo}`
      )
      .then(async (response) => {
        const bank: Bank = response.data;
        res.status(200).json(bank);
        await _saveBankInfoToCache(bank);
      })
      .catch((reason: any) => {
        console.log(reason["message"]);
        res.status(400).json("");
      });
    return;
  }

  res.status(200).json(Bank);
};

const atmTransaction: (
  request: ATMTransactionRequest
) => Promise<boolean> = async (request) => {
  const channel: RabbitMq.Channel = await MessageBroker.createChannel();
  await channel.assertExchange(BrokerExchange.BANKING, Type.DIRECT, {
    durable: true,
    internal: false,
    autoDelete: false,
  });
  return channel.publish(
    BrokerExchange.BANKING,
    RoutingKey.ATM_RK,
    Buffer.from(JSON.stringify(request))
  );
};
const vendorTransaction: (
  request: VendorTransactionRequest
) => Promise<boolean> = async (request) => {
  const channel: RabbitMq.Channel = await MessageBroker.createChannel();
  await channel.assertExchange(BrokerExchange.BANKING, Type.DIRECT, {
    durable: true,
    internal: false,
    autoDelete: false,
  });
  return channel.publish(
    BrokerExchange.BANKING,
    RoutingKey.VENDOR_RK,
    Buffer.from(JSON.stringify(request))
  );
};
const onlineTransaction: (
  request: AccountTransferRequest
) => Promise<boolean> = async (request) => {
  try {
    const channel: RabbitMq.Channel = await MessageBroker.createChannel();
    await channel.assertExchange(BrokerExchange.BANKING, Type.DIRECT, {
      durable: true,
      internal: false,
      autoDelete: false,
    });
    return channel.publish(
      BrokerExchange.BANKING,
      RoutingKey.ACCOUNT_RK,
      Buffer.from(JSON.stringify(request))
    );
  } catch (error: any) {
    console.log(error["message"]);
    return false;
  }
};
