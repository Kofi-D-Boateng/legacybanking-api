"use strict"
import axios from "axios"
import * as RabbitMq from "amqplib"
import { Request, Response } from "express";
import { Bank } from "../types/Bank";
import TransactionRequest from "../types/TransactionRequest";
import { _getBankInfoFromCache } from "../utils/redis/query";
import config from "../config/config";
import {BrokerExchange,RoutingKey} from "../enums/Amqp";

export const processTransaction:(req:Request, res:Response) => void = async (req,res) =>{
    const token:string | undefined = req.get("authorization");
    const transactionRequest:TransactionRequest = req.body;

    if(!token || !transactionRequest.apiKey){
        res.status(401);
        return;
    }

    const MessageBroker:RabbitMq.Connection = await RabbitMq.connect(config.MessageBrokerUri as string);

    await axios.get(`${config.Microservices.Auth}/${config.Routes.AuthService.authenticateUser}`,{params:{"token":token}})
    .then(async()=>{
        const channel:RabbitMq.Channel = await MessageBroker.createChannel();
        await channel.assertExchange(BrokerExchange.BANKING,"direct",{durable:true,internal:false,autoDelete:false})
        const result = channel.publish(BrokerExchange.BANKING,RoutingKey.PROCESS,Buffer.from(JSON.stringify(transactionRequest)))
        if(!result){
            throw new Error(`[ERROR]: Error publishing to exchange`)
        }
        res.status(200);
    })
    .catch((reason)=>{
        console.log(reason);
        res.status(500);
    })
    .finally(()=> MessageBroker.close());



}

export const getBankInfo:(req:Request, res:Response) => void = async (req,res) =>{
    const Bank:Bank | null = await _getBankInfoFromCache()

    if(!Bank){
        res.status(400);
        return;
    }

    res.status(200).json(Bank);
}