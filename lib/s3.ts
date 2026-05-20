import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: process.env.BUCKET_REGION ?? "us-east-1",
});

export const BUCKET = process.env.BUCKET_NAME ?? "";
