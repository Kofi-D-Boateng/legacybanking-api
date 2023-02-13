
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
            try {
                console.log("[IN PROGRESS]: Initiating broker....")
                MessageBrokerSingleton.broker = await RQ.connect(config.MessageBrokerUri as string)
                console.log("[COMPLETED]: Broker initiated....")
                return MessageBrokerSingleton.broker
            } catch (error:any) {
                console.log(error["message"])
            }
        }
        return MessageBrokerSingleton.broker
    }
}


const broker = new MessageBrokerSingleton();
Object.freeze(broker);
export default broker;