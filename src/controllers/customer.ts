"use strict";

import axios from "axios";
import { Request, Response } from "express";
import config from "../config/config";
import { Customer } from "../types/Customer";
import {
  _getEmailFromCache,
  _getUserFromCache,
  _saveUserToCache,
} from "../utils/redis/query";

export const getProfile: (req: Request, res: Response) => void = async (
  req,
  res
) => {
  const token: string | undefined = req.get("authorization");
  const apiKey = req.params["apiKey"];

  if (!token || !apiKey) {
    res.status(401).json("Unauthorized");
    return;
  }
  try {
    const authResponse = await axios.get(
      `${config.Microservices.Auth}${config.Routes.AuthService.authenticateUser}`,
      { params: { token: token } }
    );
    if (authResponse.status != 200) {
      throw new Error(authResponse.data);
    }
    const customer: Customer | null = await _getUserFromCache(apiKey as string);
    if (!customer) {
      const returnedEmailValue = await _getEmailFromCache(apiKey as string);
      if (returnedEmailValue instanceof Error) {
        throw returnedEmailValue;
      }
      const bankResponse = await axios.get(
        `${config.Microservices.Bank}${config.Routes.BankingService.getFullCustomerInfo}`,
        { params: { username: returnedEmailValue } }
      );
      if (bankResponse.status != 200) {
        throw new Error(bankResponse.data);
      }

      const notifResponse = await axios.get(
        `${config.Microservices.Notifications}${config.Routes.NotificationService.getNotifications}`,
        { params: { email: returnedEmailValue } }
      );
      if (notifResponse.status != 200) {
        throw new Error(notifResponse.data);
      }
      const newCustomer: Customer = bankResponse.data;
      newCustomer.notifications = notifResponse.data;
      await _saveUserToCache(apiKey as string, newCustomer);
      res.status(200).json(newCustomer);
      return;
    }
    res.status(200).json(customer);
  } catch (error: any) {
    if (!error["message"]) {
      console.log(error);
      res.status(401).json("");
    } else {
      console.log(error["message"]);
      res.status(error["response"]["status"]).json("");
    }
  }
};
