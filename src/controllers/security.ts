"use strict"

import axios from "axios"
import * as RabbitMq from "amqplib"
import { Request,Response } from "express"
import config from "../config/config";
import {BrokerQueue} from "../enums/Amqp";
import { Customer } from "../types/Customer";
import { _getUserFromCache } from "../utils/redis/query";
import SecurityRequest from "../types/SecurityRequest";

export const updateCustomerSecurity:(req:Request,res:Response) => void = async (req,res) =>{
    const token:string | undefined = req.get("authorization");
    const apiKey:string | undefined = req.params["apiKey"];
    const security:SecurityRequest = req.body;

    if(!token || !apiKey){
        res.status(401);
        return;
    }

    const MessageBroker = await RabbitMq.connect(config.MessageBrokerUri as string);
    const customer:Customer | null = await _getUserFromCache(apiKey);

    if(!customer){
        res.status(401);
        return;
    }else{
        security.email = customer.email;
    }
    axios.get(`${config.Microservices.Auth}/${config.Routes.AuthService.authenticateUser}`,{headers:{"authorization":token},params:{"apiKey":apiKey}})
    .then(async ()=>{
        const channel:RabbitMq.Channel = await MessageBroker.createChannel();
        // await channel.assertQueue(BrokerQueue.UpdateCustomerSecurity)
        // const result = channel.sendToQueue(
        //     BrokerQueue.UpdateCustomerSecurity,
        //     Buffer.from(JSON.stringify(security))
        // )
        // if(!result){
        //     throw new Error("[ERROR]: Queue rejected request")
        // }
        // res.status(200);
    })
    .catch((reason)=>{
        console.log(reason);
        res.status(500);
    })
    .finally(async()=> await MessageBroker.close())


}