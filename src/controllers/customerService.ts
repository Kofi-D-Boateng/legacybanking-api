"use strict"

import { Request,Response } from "express";
import { BrokerExchange, BrokerQueue, RoutingKey, Type } from "../enums/Amqp";
import broker from "../models/MessageBrokerSingleton";

export const contactCustomerService:(req:Request,res:Response) => void = async(req,res) =>{
    const {email,text,topic} = req.body;

    if(!email || !text || !topic){
        res.status(400).json();
    }

    const messageBroker = await broker.getBroker()

    try {
        const channel = await messageBroker.createChannel()
        await channel.assertExchange(BrokerExchange.NOTIF,Type.DIRECT)
        await channel.assertQueue(BrokerQueue.BILLINGUPDATE,{durable:true,autoDelete:false,exclusive:false})
        const result = channel.publish(BrokerExchange.NOTIF,RoutingKey.BILLING_RK,Buffer.from(JSON.stringify({"email":email,"topic":topic,"text":text})))
        if(!result){
            throw new Error(`[ERROR]: Issue pushing message to ${BrokerQueue.BILLINGUPDATE}`)
        }
        res.status(200).json();
    } catch (error:any) {
        if(error["message"]){
            console.log(error["message"])
        }else{
            console.log(error)
        }
        res.status(500).json()
    }
}

