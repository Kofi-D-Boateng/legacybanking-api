import * as redis from "redis";
import config from "../config/config";

const uri = `redis://${config.Microservices.Redis.RedisHostname}:${config.Microservices.Redis.RedisPort}`;

export class RedisSingleton {
  private static instance: RedisSingleton;
  private static client: redis.RedisClientType;

  constructor() {
    if (!RedisSingleton.instance) {
      RedisSingleton.instance = this;
      try {
        console.log("[IN PROGRESS]: Creating Redis Client....");
        RedisSingleton.client = redis.createClient({ url: uri });
        RedisSingleton.client.connect();
        console.log("[COMPLETED]: Redis Client connected....");
      } catch (error: any) {
        console.log(error["message"]);
      }
    }
    return RedisSingleton.instance;
  }

  public static getClient(): redis.RedisClientType {
    if (!RedisSingleton.instance) {
      RedisSingleton.instance = new RedisSingleton();
    }
    return RedisSingleton.client;
  }
}
