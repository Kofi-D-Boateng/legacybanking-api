"use strict"
import axios from "axios"
import * as RabbitMq from "amqplib"
import { Request, Response } from "express";
import { Bank } from "../types/Bank";
import TransactionRequest, { TransactionType } from "../types/TransactionRequest";
import { _getBankInfoFromCache, _saveBankInfoToCache } from "../utils/redis/query";
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
        let result:boolean;
        if(transactionRequest.transactionType == TransactionType.ATM){
            result = channel.publish(BrokerExchange.BANKING,RoutingKey.ATM_RK,Buffer.from(JSON.stringify(transactionRequest)))
        }else if(transactionRequest.transactionType == TransactionType.ONLINE || transactionRequest.transactionType == TransactionType.MOBILE){
            result = channel.publish(BrokerExchange.BANKING,RoutingKey.ACCOUNT_RK,Buffer.from(JSON.stringify(transactionRequest)))
        }else if(transactionRequest.transactionType == TransactionType.VENDOR){
            result = channel.publish(BrokerExchange.BANKING,RoutingKey.VENDOR_RK,Buffer.from(JSON.stringify(transactionRequest)))
        }else{
            throw new Error("[ERROR]: Irregular transaction type.")
        }
 
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
        axios.get(`${config.Microservices.Bank}${config.Routes.BankingService.getBankInfo}`)
        .then(async (response)=>{
            const bank:Bank = response.data;
            res.status(200).json(bank);
            await _saveBankInfoToCache(bank);
        }).catch((reason:any)=>{
            console.log(reason["message"]);
            res.status(400).json("")
        })
        return
    }

    res.status(200).json(Bank);
}