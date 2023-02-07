"use strict"

import axios from "axios"
import { Request, Response } from "express";
import config from "../config/config";
import { Customer } from "../types/Customer";
import { _getUserFromCache } from "../utils/redis/query";

export const getProfile:(req:Request, res:Response) => void = async (req,res) =>{
    const token:string | undefined = req.get("authorization");
    const apiKey:string | undefined = req.params["apiKey"];

    if(!token || !apiKey){
        res.status(401);
        return;
    }

    axios.get(`${config.Microservices.Auth}/${config.Routes.AuthService.authenticateUser}`,{params:{"token":token}})
    .then(async ()=>{
        const customer:Customer | null = await _getUserFromCache(apiKey);
        if(!customer){
            throw new Error(
                `[ERROR]: Customer for key: ${apiKey} does not exist`
            )
        }
        res.status(200).json(customer);
    }).catch((reason)=>{
        console.log(reason)
        res.status(401)
    })
    
    
}