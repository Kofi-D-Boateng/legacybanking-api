"use strict"

import axios from "axios"
import * as RabbitMq from "amqplib"
import { Response, Request } from "express";
import config from "../config/config";
import {BrokerExchange, BrokerQueue, RoutingKey, Type} from "../enums/Amqp";
import { _getUserFromCache } from "../utils/redis/query";
import { Customer } from "../types/Customer";
import broker from "../models/MessageBrokerSingleton";



export const getNewVerificationLink:(req:Request,res:Response) => void = (req,res) =>{
    const email:string | undefined = req.params["email"]

    if(!email || email.trim().length <= 0){
        res.status(401).json();
        return;
    }

    axios.get(`${config.Microservices.Auth}/${config.Routes.AuthService.getNewVerificationLink}`,{params:{"email":email}})
    .then(() => res.status(200).json())
    .catch((reason)=>{
        console.log(reason);
        res.status(401).json()
    })
}

export const updateBilling:(req:Request, res:Response) => void = async (req,res) =>{
    const token:string | undefined = req.get("authorization");
    const {choice,apiKey} = req.body;
    if(!token || choice == undefined || !apiKey){
        res.status(401).json()
    }

    const MessageBroker = await broker.getBroker();
    axios.get(`${config.Microservices.Auth}/${config.Routes.AuthService.authenticateUser}`,{params:{"token":token}})
    .then(async () => {
        const customer : Customer | null = await _getUserFromCache(apiKey as string)
        if(!customer){
            throw new Error(
                `[ERROR]: Customer for key: ${apiKey} does not exist`
            )
        }
        const channel = await MessageBroker.createChannel();
        await channel.assertExchange(BrokerExchange.NOTIF,Type.DIRECT);
        await channel.assertQueue(BrokerQueue.BILLINGUPDATE,{durable:true,autoDelete:false,exclusive:false})
        const request:{email:string,choice:string} = {email:customer.email,choice:choice}
        const result = channel.publish(BrokerExchange.NOTIF,RoutingKey.BILLING_RK,Buffer.from(JSON.stringify(request)));
        if(!result){
            throw new Error("[ERROR]: Consumer rejected request")
        }
        res.status(200).json("");
    })
    .catch((reason)=>{
        if(reason["response"]){
            console.log(reason["message"])
            res.status(reason["response"]["status"]).json()
        }else{
            console.log(reason)
            res.status(500).json()
        }
    })
    
}

export const updateNotifications:(req:Request,res:Response) => void = async (req,res) =>{
    const token:string | undefined = req.get("authorization")
    const body:{msgId:string | undefined, apiKey:string | undefined} = req.body;
    if(!token || !body.msgId || !body.apiKey){
        res.status(401).json("")
        return;
    }
    const MessageBroker = await broker.getBroker()
    axios.get(`${config.Microservices.Auth}${config.Routes.AuthService.authenticateUser}`,{params:{"token":token}})
    .then(async() => {
        const customer : Customer | null = await _getUserFromCache(body.apiKey as string)
        if(!customer){
            throw new Error(
                `[ERROR]: Customer for key: ${body.apiKey} does not exist`
            )
        }
        const channel:RabbitMq.Channel = await MessageBroker.createChannel();
        await channel.assertExchange(BrokerExchange.NOTIF,Type.DIRECT,{durable:true,internal:false,autoDelete:false})
        await channel.assertQueue(BrokerQueue.UPDATENOTIFICATION,{durable:true,exclusive:false,autoDelete:false})
        const request:{email:string, msgId:string|undefined, apiKey:string|undefined} = {"email":customer?.email,"msgId":body!.msgId, "apiKey":body!.apiKey}
        const result = channel.publish(BrokerExchange.NOTIF,RoutingKey.UPDATE_RK,Buffer.from(JSON.stringify(request)))
        if(!result){
            throw new Error("[ERROR]: Consumer rejected request")
        }
        res.status(200).json("");
    })
    .catch((reason)=>{
        if(reason["response"]){
            console.log(reason["message"])
            res.status(reason["response"]["status"]).json()
        }else{
            console.log(reason)
            res.status(500).json()
        }
    })
}