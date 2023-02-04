'use strict'

import {S3} from "aws-sdk"
import config from "../../config/config"

export const getVideo:(photoKey:string) => Promise<Blob | null | undefined> = async (key) =>{

    const s3Bucket:S3 = new S3(config.AWS.S3);

    const params:S3.GetObjectRequest = {Bucket:config.AWS.S3.bucketName as string,Key:key}

    const video = await s3Bucket.getObject(params).promise();

    if(video.$response.error){
        console.log(video.$response.error)
        return null;
    }

    return new Blob([video.Body as BlobPart],{type:video.ContentType})
}