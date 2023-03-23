import { Request, Response } from "express";
import AWS from "aws-sdk";
import config from "../config/config";

export const joinMailList: (req: Request, res: Response) => void = async (
  req,
  res
) => {
  const email: string = req.body["email"];
  if (!email) {
    res.status(400).json();
    return;
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
      InvocationType: "Event",
      Payload: JSON.stringify({ Function: "addToMailList", Payload: email }),
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
