import { Readable } from "stream";
import config from "../../config/config";
import { Bank } from "../../types/Bank";
import { Customer } from "../../types/Customer";
import TransactionRequest from "../../types/TransactionRequest";
import client from "./redis";
const date = new Date();

export const _getBankInfoFromCache: () => Promise<Bank | null> = async () => {
  try {
    const stringifiedObject: string | null = await client.GET(
      config.BankKeyHash as string
    );
    if (!stringifiedObject) {
      throw new Error("[WARNING]: Bank key-value hashed no null reference...");
    } else {
      const bank: Bank = JSON.parse(stringifiedObject);
      return bank;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const _getUserFromCache: (keyHash: string) => Promise<Customer | null> = async (
  keyHash
) => {
  try {
    const stringifiedObject: string | null = await client.GET(keyHash);
    if (!stringifiedObject) {
      throw new Error(
        `[Warning]: key-value:${keyHash} tried querying at ${date.toISOString()} `
      );
    }
    const customerObject: Customer = JSON.parse(stringifiedObject);
    return customerObject;
  } catch (error) {
    return null;
  }
};

export const _getEmailFromCache:(key:string) => Promise<string|Error> = async(key)=>{
  const email:string|null = await client.GET(key);
    if(!email){
      return new Error(`[WARNING]: Email was not found in cache for key: ${key}`)
    }
    return email;
}

export const _updateTransaction: (
  keyHash: string,
  data: TransactionRequest
) => void = async (keyHash, data) => {
  try {
    const stringifiedObject: string | null = await client.GET(keyHash);
    if (!stringifiedObject) {
      throw new Error(
        `[Warning]: key-value:${keyHash} tried querying at ${date.toISOString()}`
      );
    }
    const customerObject: Customer = JSON.parse(stringifiedObject);
  } catch (error) {
    console.log(error);
  }
};

export const _clearUserFromRedisCache: (keyHash: string) => void = async (
  keyHash
) => {
  await client.DEL(keyHash);
};

export const _getVideoSrcFromCache:(key:string) => Promise<Readable | null> = async (key) =>{
  try {
    const src = await client.GET(key);
    if(!src){
      throw new Error(`[WARNING]: value for key: ${key} does not exist...`);
    }

    const buffer = Buffer.from(src,"binary");
    const readableStream = new Readable();
    readableStream.push(buffer)
    readableStream.push(null)
    return readableStream
  } catch (error) {
    console.log(error);
    return null;
    
  }
}

export const _saveBankInfoToCache:(val:Bank) => Promise<void> = async(val) =>{
  try {
    if(!config.BankKeyHash || !val){
      throw new Error("[WARNING]: Missing key or val... Could not save user to cache.")
    }
    await client.SET(config.BankKeyHash,JSON.stringify(val))
  } catch (error:any) {
    console.log(error["message"])
  }
}

export const _saveSrcToCache:(key:string,src:string) => Promise<void> = async (key,src) =>{
  if(!key || !src){
    return;
  }
  await client.SET(key,src);
}

export const _saveUserToCache:(key:string,value:Customer) => Promise<void> = async(key,val)=>{
  try {
    if(!key || !val){
      throw new Error("[WARNING]: Missing key or val... Could not save user to cache.")
    }
    await client.SET(key,JSON.stringify(val))
  } catch (error:any) {
    console.log(error["message"])
  }
}