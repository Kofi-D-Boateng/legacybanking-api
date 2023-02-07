"use strict"
import { Response, Request } from "express";
import axios from "axios";
import {LoginRequest, LoginRequestReturn} from "../types/LoginRequest";
import config from "../config/config";
import { Registration } from "../types/Registration";

export const loginCustomer:(req:Request,res:Response) => void = (req,res) =>{
    const loginRequest:LoginRequest = req.body;
    
    if((!loginRequest.email|| loginRequest.email.trim().length <= 0) || (!loginRequest.password || loginRequest.password.trim().length <= 0)){
        res.status(401);
        return;
    }

    axios.post(`${config.Microservices.Auth}${config.Routes.AuthService.loginUser}`,loginRequest).then((response)=>{
        const returnValue:LoginRequestReturn = response.data;
        if((!returnValue.authorizationToken || returnValue.authorizationToken.trim().length <= 0) || (!returnValue.apiKey|| returnValue.apiKey.trim().length <= 0)){
            throw new Error("invalid")
        }

        res.status(200).json({
            token:returnValue.authorizationToken,
            apiKey:returnValue.apiKey,
            isActivated:returnValue.isActivated,
            expiresIn: returnValue.tokenExpiration
        })

    }).catch((reason)=>{
        if(reason["message"] == "invalid"){
            res.status(401)
        }else{
            res.status(500)
        }
    })

}

export const getRefreshToken:(req:Request,res:Response) => void = (req,res) =>{
    const token:string|undefined = req.get("authorization");
    const apiKey:string|undefined = req.params["apiKey"];

    if((!token || token.trim().length <= 0) || (!apiKey || apiKey.trim().length <= 0)){
        res.status(401)
        return;
    }

    axios.get(`${config.Microservices.Auth}/${config.Routes.AuthService.getRefreshToken}`,{headers:{"authorization":token},params:{"apiKey":apiKey}}).then((response)=>{
        const returnValue:{token:string, expiresIn:number} = response.data;
        if(!returnValue.token || returnValue.token.trim().length <=0){
            throw new Error("invalid");
        }
        res.status(200).json(returnValue);
    }).catch((reason)=>{
        if(reason["message"] == "invalid"){
            res.status(401)
        }else{
            res.status(400)
        }
    })
}

export const logoutCustomer:(req:Request,res:Response) => void = (req,res) =>{
    const token:string|undefined = req.get("authorization");
    const apiKey:string|undefined = req.body["apiKey"];

    if((!token || token.trim().length <= 0) || (!apiKey || apiKey.trim().length <= 0)){
        res.status(401)
        return;
    }

    axios.delete(`${config.Microservices.Auth}/${config.Routes.AuthService.logoutUser}`,{headers:{"authorization":token},params:{apiKey:apiKey}})
    .then(()=> res.status(200))
    .catch((reason)=> {
        console.log(reason["message"]);
        res.status(401);
    })
    
}

export const confirmCustomerRegistration:(req:Request,res:Response) => void = (req,res) =>{
    const token:string | undefined = req.params["token"]

    if(!token || token.trim().length <= 0){
        res.status(401);
        return;
    }

    axios.post(`${config.Microservices.Auth}/${config.Routes.AuthService.confirmCustomerRegistration}`,{token:token})
    .then(()=> res.status(200))
    .catch((reason)=> {
        console.log(reason["message"]);
        res.status(401);
    })
}

export const registerCustomer:(req:Request,res:Response) => void = (req,res) =>{
    const authToken:string|undefined = req.get("authorization");
    const registrationRequest:Registration = req.body;

    if((!registrationRequest.employeeId || registrationRequest.employeeId.trim().length <= 0) || (!authToken || authToken.trim().length <= 0)){
        res.status(401);
        return;
    }

    axios.post(`${config.Microservices.Auth}/${config.Routes.AuthService.registerCustomer}`,registrationRequest,{headers:{"authorization":authToken}})
    .then(() => res.status(200))
    .catch((reason)=>{
        console.log(reason["message"]);
        res.status(401);
    })
}