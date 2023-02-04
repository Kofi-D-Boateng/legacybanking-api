import config from "../../config/config";
import { Bank } from "../../types/Bank";
import { Customer } from "../../types/Customer";
import TransactionRequest from "../../types/TransactionRequest";
import client from "./redis";
const date = new Date();

export const _getBankInfo: () => Promise<Bank | null> = async () => {
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

export const _getUser: (keyHash: string) => Promise<Customer | null> = async (
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

export const _getVideoSrc:(key:string) => Promise<string | null> = async (key) =>{
  try {
    const src = await client.GET(key);
    if(!src){
      throw new Error(`[WARNING]: value for key: ${key} does not exist...`);
    }
    return src;
  } catch (error) {
    console.log(error);
    return null;
    
  }
}

export const _saveSrcToCache:(key:string,src:string) => Promise<void> = async (key,src) =>{
  if(!key || !src){
    return;
  }

  await client.SET(key,src);
}
