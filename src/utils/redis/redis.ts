import * as redis from "redis";
import config from "../../config/config";

const uri = `redis://${config.Microservices.Redis.RedisHostname}:${config.Microservices.Redis.RedisPort}`;
const client = redis.createClient({ url: uri });
client.connect();

export default client;
