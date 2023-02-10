"use strict"

import axios from "axios"
import * as RabbitMq from "amqplib"
import { Request,Response } from "express"
import config from "../config/config";
import {BrokerExchange, RoutingKey} from "../enums/Amqp";
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
    axios.get(`${config.Microservices.Auth}/${config.Routes.AuthService.authenticateUser}`,{params:{"token":token}})
    .then(async ()=>{
        const channel:RabbitMq.Channel = await MessageBroker.createChannel();
        await channel.assertExchange(BrokerExchange.BANKING,"direct",{durable:true,internal:false,autoDelete:false})
        const result = channel.publish(BrokerExchange.BANKING,RoutingKey.SECURITY_RK,Buffer.from(JSON.stringify(security)))
        if(!result){
            throw new Error("[ERROR]: Security message could not be pushed to queue.")
        }
        res.status(200).json()
    })
    .catch((reason:any)=>{
        if(reason["response"]){
            console.log(reason["message"])
            res.status(reason["response"]["status"]).json()
        }else{
            console.log(reason)
            res.status(500).json()
        }
    })
    .finally(async()=> await MessageBroker.close())


}