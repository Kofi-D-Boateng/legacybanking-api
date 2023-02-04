"use strict"

import { Response,Request } from "express"
import { getVideo } from "../utils/aws/s3";
import { _getVideoSrc, _saveSrcToCache } from "../utils/redis/query";


export const s3Bucket:(req:Request, res:Response) => void = async (req,res) =>{
    const videoName:string | undefined = req.params["tag"]

    if(!videoName || videoName.trim().length <= 0){
        console.log("[ERROR]: Video tags not being sent from frontend....");

    }

    let videoSrc:string | null = await _getVideoSrc(videoName)

    if(!videoSrc){
        const videoBlob = await getVideo(videoName);
        if(!videoBlob){
            res.status(400);
            return;
        }
        videoSrc = URL.createObjectURL(videoBlob as Blob)
    }

    await _saveSrcToCache(videoName,videoSrc);

    res.status(200).json({src:videoSrc});

}