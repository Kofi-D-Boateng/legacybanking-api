'use strict'

import {S3} from "aws-sdk"
import {Readable} from "stream";
import config from "../../config/config"
import { _saveSrcToCache } from "../redis/query";

export const _getVideoFromS3Bucket:(photoKey:string) => Promise<Readable | null> = async (key) =>{
    
    try {
        const s3Bucket:S3 = new S3({region:config.AWS.S3.region,accessKeyId:config.AWS.S3.accessKey,secretAccessKey:config.AWS.S3.secretAccessKey});

        const params:S3.GetObjectRequest = {Bucket:config.AWS.S3.bucketName as string,Key:key}
        const readableStream = s3Bucket.getObject(params).createReadStream();
        
        let videoString:string = "";

        readableStream.on('data',(chunk)=> videoString+=chunk.toString('binary'))
        readableStream.on('end', async()=> await _saveSrcToCache(key,videoString))

        return readableStream   
    } catch (error:any) {
        console.log(error["message"])
        return null;
    }
}