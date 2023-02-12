
import * as redis from "redis";
import config from "../config/config";

const uri = `redis://${config.Microservices.Redis.RedisHostname}:${config.Microservices.Redis.RedisPort}`;

class RedisSingleton{
    static instance:RedisSingleton;
    static client:redis.RedisClientType;

    constructor(){
        if(!RedisSingleton.instance){
            RedisSingleton.instance = this;
        }
    }

    async getClient():Promise<redis.RedisClientType>{
        if(!RedisSingleton.client){
            console.log("Creating Redis Client....");
            RedisSingleton.client = redis.createClient({ url: uri });
            RedisSingleton.client.connect();
            console.log("Redis Client connected....")
            return RedisSingleton.client;
        }
        return RedisSingleton.client;
    }
}


const client = new RedisSingleton();
Object.freeze(client);
export default client;