"use strict";

import { Response, Request } from "express";
import { Readable } from "stream";
import { _getVideoFromS3Bucket } from "../utils/aws/s3";
import { _getVideoSrcFromCache, _saveSrcToCache } from "../utils/redis/query";

export const s3Bucket: (req: Request, res: Response) => void = async (
  req,
  res
) => {
  const videoName = req.params["key"]
    ? req.params["key"]
    : (req.query["key"] as string);
  if (!videoName || videoName!.trim().length <= 0) {
    console.log("[ERROR]: Video tags not being sent from frontend....");
    res.status(400);
    return;
  }

  const videoSrc: Readable | null = await _getVideoSrcFromCache(videoName);

  if (!videoSrc) {
    const readableStream: Readable | null = await _getVideoFromS3Bucket(
      videoName
    );
    if (!readableStream) {
      res.status(400);
      return;
    }
    readableStream.pipe(res);
    return;
  }
  videoSrc.pipe(res);
};
