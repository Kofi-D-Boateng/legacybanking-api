"use strict"

import axios from "axios"
import * as RabbitMq from "amqplib"
import { Response, Request } from "express";
import config from "../config/config";
import BrokerQueue from "../enums/BrokerQueue";



export const updateNotifications:(req:Request,res:Response) => void = async (req,res) =>{
    const token:string | undefined = req.get("authorization")
    const body:{msgId:string | undefined, apiKey:string | undefined} = req.body;

    if(!token || !body.msgId || !body.apiKey){
        res.status(401)
        return;
    }
    const MessageBroker = await RabbitMq.connect(config.MessageBrokerUri as string);
    axios.get(`${config.Microservices.Auth}/${config.Routes.AuthService.authenticateUser}`,{headers:{"authorization":token},params:{"apiKey":body.apiKey}})
    .then(async() => {
        const channel:RabbitMq.Channel = await MessageBroker.createChannel();
        await channel.assertQueue(BrokerQueue.UpdateNotification);
        const result = channel.sendToQueue(
            BrokerQueue.UpdateNotification,
            Buffer.from(JSON.stringify(body))
        )
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