import "dotenv/config";
import express, { Express } from "express";
import logger from "morgan";
import config from "./config/config";
import {
  _clearUserFromRedisCache,
  _getBankInfo,
  _getUser,
  _updateTransaction,
} from "./utils/redis/query";
import { _signJWT, _verifyJWT } from "./utils/JWT/jwt";
import apiRouter from "./routes/handlers"
const app: Express = express();

const whitelist = {
  origin: [`${process.env.ALLOWED_ORIGINS}`],
  credentials: true,
  optionsSuccessStatus: 204,
  methods: ["GET,POST,PUT,DELETE"],
  allowedHeaders: [
    "Origin,Content-Type,Accept,authorization,x-forwarded-for,User-Agent",
  ],
};

app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin",whitelist.origin);
  res.header("Access-Control-Allow-Methods",whitelist.methods);
  res.header("Access-Control-Allow-Headers",whitelist.allowedHeaders);

  next();
})
app.use(logger(config.LogginType as string));
app.use(express.json());

app.use(`/${config.ApiVersion}`,apiRouter)

app.listen(config.Port, () =>
  console.log(`Api server listening currently @ port:${config.Port}`)
);
