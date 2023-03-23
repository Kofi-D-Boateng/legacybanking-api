import * as RQ from "amqplib";
import config from "../config/config";

export class MessageBrokerSingleton {
  private static instance: MessageBrokerSingleton;
  private static broker: RQ.Connection;

  constructor() {
    if (MessageBrokerSingleton.instance == null) {
      MessageBrokerSingleton.instance = this;
      console.log("[IN PROGRESS]: Connecting to MessageBroker....");
      RQ.connect(config.MessageBrokerUri as string)
        .then((connection) => {
          console.log("[COMPLETE]: Connected to MessageBroker....");
          MessageBrokerSingleton.broker = connection;
        })
        .catch((err) =>
          console.log(`[ERROR]: could not connect to Rabbit MQ --> ${err}`)
        );
    }
  }

  public static getBroker(): RQ.Connection {
    if (!MessageBrokerSingleton.instance) {
      MessageBrokerSingleton.instance = new MessageBrokerSingleton();
    }
    return MessageBrokerSingleton.broker;
  }
}
