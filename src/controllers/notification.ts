"use strict"

import axios from "axios"
import * as RabbitMq from "amqplib"
import { Response, Request } from "express";
import config from "../config/config";
import {BrokerExchange, RoutingKey, Type} from "../enums/Amqp";
import { _getUserFromCache } from "../utils/redis/query";
import { Customer } from "../types/Customer";



export const updateNotifications:(req:Request,res:Response) => void = async (req,res) =>{
    const token:string | undefined = req.get("authorization")
    const body:{msgId:string | undefined, apiKey:string | undefined} = req.body;

    if(!token || !body.msgId || !body.apiKey){
        res.status(401)
        return;
    }
    const MessageBroker = await RabbitMq.connect(config.MessageBrokerUri as string);
    axios.get(`${config.Microservices.Auth}/${config.Routes.AuthService.authenticateUser}`,{params:{"token":token}})
    .then(async() => {
        const customer : Customer | null = await _getUserFromCache(body.apiKey as string)
        if(!customer){
            throw new Error(
                `[ERROR]: Customer for key: ${body.apiKey} does not exist`
            )
        }
        const channel:RabbitMq.Channel = await MessageBroker.createChannel();
        await channel.assertExchange(BrokerExchange.NOTIF,Type.DIRECT,{durable:true,internal:false,autoDelete:false})
        const result = channel.publish(BrokerExchange.NOTIF,RoutingKey.UPDATE,Buffer.from(JSON.stringify({"email":customer?.email,"msgId":body.msgId})))
        if(!result){
            throw new Error("[ERROR]: Consumer rejected request")
        }
        res.status(200);
    })
    .catch((reason)=>{
        console.log(reason);
        res.status(500);
    })
    .finally(async() => await MessageBroker.close())


}

export const getNewVerificationLink:(req:Request,res:Response) => void = (req,res) =>{
    const email:string | undefined = req.params["email"]

    if(!email || email.trim().length <= 0){
        res.status(401);
        return;
    }

    axios.get(`${config.Microservices.Auth}/${config.Routes.AuthService.getNewVerificationLink}`,{params:{"email":email}})
    .then(() => res.status(200))
    .catch((reason)=>{
        console.log(reason);
        res.status(401)
    })
}