"use strict";
import { Response, Request } from "express";
import axios from "axios";
import { LoginRequest, LoginRequestReturn } from "../types/LoginRequest";
import config from "../config/config";
import { Registration } from "../types/Registration";

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

  axios
    .post(
      `${config.Microservices.Auth}${config.Routes.AuthService.loginUser}`,
      loginRequest
    )
    .then((response) => {
      const returnValue: LoginRequestReturn = response.data;
      res.status(response.status).json(returnValue);
    })
    .catch((reason) => {
      console.log(reason["message"]);
      res.status(reason["response"]["status"]).json("Unauthorized");
    });
};

export const getRefreshToken: (req: Request, res: Response) => void = (
  req,
  res
) => {
  const token: string | undefined = req.get("authorization");
  const apiKey = req.params["apiKey"];

  if (!token || token.trim().length <= 0 || !apiKey) {
    res.status(401);
    return;
  }

  axios
    .get(
      `${config.Microservices.Auth}/${config.Routes.AuthService.getRefreshToken}`,
      { headers: { authorization: token }, params: { apiKey: apiKey } }
    )
    .then((response) => {
      const returnValue: { token: string; expiresIn: number } = response.data;
      if (!returnValue.token || returnValue.token.trim().length <= 0) {
        throw new Error("invalid");
      }
      res.status(200).json(returnValue);
    })
    .catch((reason) => {
      console.log(reason["message"]);
      res.status(reason["response"]["status"]).json("Unauthorized");
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

  axios
    .get(
      `${config.Microservices.Auth}/${config.Routes.AuthService.logoutUser}`,
      { headers: { authorization: token }, params: { apiKey: apiKey } }
    )
    .then(() => res.status(200).json(""))
    .catch((reason) => {
      console.log(reason["message"]);
      res.status(reason["response"]["status"]).json("Unauthorized");
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

  axios
    .post(
      `${config.Microservices.Auth}/${config.Routes.AuthService.confirmCustomerRegistration}`,
      { token: token }
    )
    .then(() => res.status(200))
    .catch((reason) => {
      console.log(reason["message"]);
      res.status(reason["response"]["status"]).json("Unauthorized");
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
      `${config.Microservices.Auth}/${config.Routes.AuthService.registerCustomer}`,
      registrationRequest,
      { headers: { authorization: authToken } }
    )
    .then(() => res.status(200))
    .catch((reason) => {
      console.log(reason["message"]);
      res.status(reason["response"]["status"]).json("Unauthorized");
    });
};
