import * as redis from "redis";
import config from "../../config/config";

const uri = `redis://${config.RedisHostname}:${config.RedisPort}`;
const client = redis.createClient({ url: uri });
client.connect();

export default client;
