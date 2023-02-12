
import * as RQ from "amqplib"
import config from "../config/config";

class MessageBrokerSingleton{
    static instance:MessageBrokerSingleton;
    static broker:RQ.Connection

    constructor(){
        if(MessageBrokerSingleton.instance == null){
            MessageBrokerSingleton.instance = this;
        }
    }

    async getBroker():Promise<RQ.Connection>{
        if(!MessageBrokerSingleton.broker){
            console.log("CREATED")
            MessageBrokerSingleton.broker = await RQ.connect(config.MessageBrokerUri as string)
            return MessageBrokerSingleton.broker
        }
        return MessageBrokerSingleton.broker
    }
}


const broker = new MessageBrokerSingleton();
Object.freeze(broker);
export default broker;