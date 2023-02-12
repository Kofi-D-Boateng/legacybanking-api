import { Request, Response } from "express";
import { BrokerExchange, BrokerQueue, RoutingKey, Type } from "../enums/Amqp";
import broker from "../models/MessageBrokerSingleton";


export const joinMailList:(req:Request, res:Response) => void = async(req, res) =>{
    const email:string = req.body["email"];
    if(!email){
        res.status(400).json();
        return;
    }

    const MessageBroker = await broker.getBroker()
    try {
        const channel = await MessageBroker.createChannel();
        await  channel.assertExchange(BrokerExchange.NOTIF,Type.DIRECT)
        await channel.assertQueue(BrokerQueue.JOINMAILLIST)
        const queue = await channel.checkQueue(BrokerQueue.JOINMAILLIST)
        console.log(`QUEUE: ${queue.queue}, CONSUMER COUNT: ${queue.consumerCount}`)
        channel.publish(BrokerExchange.NOTIF,RoutingKey.MAILLIST_RK,Buffer.from(JSON.stringify(email)))
        res.status(200).json("")
    } catch (error) {
        res.status(400).json("")
    }
}