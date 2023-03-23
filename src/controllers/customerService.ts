"use strict";

import { Request, Response } from "express";
import config from "../config/config";
import AWS from "aws-sdk";

export const contactCustomerService: (
  req: Request,
  res: Response
) => void = async (req, res) => {
  const { email, text, topic } = req.body;

  if (!email || !text || !topic) {
    res.status(400).json();
  }

  AWS.config.update({
    region: config.AWS.Lambda.region ? config.AWS.Lambda.region[0] : "",
    credentials: {
      accessKeyId: config.AWS.Lambda?.accessKey as string,
      secretAccessKey: config.AWS.Lambda?.secretAccessKey as string,
    },
  });

  const lambda = new AWS.Lambda();

  lambda
    .invoke({
      FunctionName: config.AWS.Lambda.functionNames?.at(1) as string,
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({
        Function: "customerService",
        Payload: { email: email, topic: topic, text: text },
      }),
    })
    .promise()
    .then((response) => {
      console.log(response.Payload);
      res.status(200).json("");
    })
    .catch((err) => {
      console.log(err);
      res.status(401).json("");
    });
};
