import {
  AttributeValue,
  DynamoDBClient,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { fromEnv } from "@nordicsemiconductor/from-env";
import type { DynamoDBStreamEvent } from "aws-lambda";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import { rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const { RegistrationsTableName, ImagesBucketName } = fromEnv({
  RegistrationsTableName: "REGISTRATIONS_TABLE_NAME",
  ImagesBucketName: "IMAGES_BUCKET_NAME",
})(process.env);

const db = new DynamoDBClient({});
const s3 = new S3Client({});

export const handler = async (event: DynamoDBStreamEvent): Promise<void> => {
  console.log(JSON.stringify(event, null, 2));

  for (const Record of event.Records) {
    if (Record.eventName !== "INSERT") continue;
    const NewImage = Record?.dynamodb?.NewImage;
    if (NewImage === undefined) continue;

    const Item = unmarshall(NewImage as Record<string, AttributeValue>);
    if (Item.photo === undefined) continue;
    const response = await fetch(Item.photo);
    const buffer = await response.arrayBuffer();
    const originalFile = path.join(os.tmpdir(), randomUUID());
    const resizedName = `${randomUUID()}.webp`;
    const resizedFile = `${path.join(os.tmpdir(), resizedName)}`;

    await writeFile(originalFile, Buffer.from(buffer), "binary");

    try {
      const originalInfo = (
        await run("/opt/bin/identify", [originalFile])
      ).toString("ascii");

      console.log(originalInfo);
      const [, type, dimensions, , colorDepth, colorFormat] =
        originalInfo.split(" "); // /tmp/f5bb4094-29eb-44ff-9c29-feaf5d2ce7d4 JPEG 3008x4000 3008x4000+0+0 8-bit sRGB 2.49426MiB 0.010u 0:00.004

      const w = 250;
      const q = 8;

      await run("/opt/bin/convert", [
        originalFile,
        "-thumbnail",
        `${w}x${w}^`,
        `-gravity`,
        `center`,
        `-crop`,
        `${w}x${w}+0+0`,
        "-quality",
        `${q * 10}`,
        `-strip`,
        resizedFile,
      ]);

      // Store resized file
      await s3.send(
        new PutObjectCommand({
          Bucket: ImagesBucketName,
          Key: resizedName,
          Body: createReadStream(resizedFile),
          ContentType: `image/webp`,
          CacheControl: "public, max-age=31449600, immutable",
          Metadata: {
            original: `${Item.photo} ${type} ${dimensions} ${colorDepth} ${colorFormat}`,
          },
        })
      );

      const url = `https://${ImagesBucketName}.s3.${process.env.AWS_DEFAULT_REGION}.amazonaws.com/${resizedName}`;
      console.log(url);

      await db.send(
        new UpdateItemCommand({
          TableName: RegistrationsTableName,
          Key: {
            id: {
              S: Item.id,
            },
          },
          UpdateExpression: "SET #photoThumbnail = :photoThumbnail",
          ExpressionAttributeNames: {
            "#photoThumbnail": "photoThumbnail",
          },
          ExpressionAttributeValues: {
            ":photoThumbnail": {
              S: url,
            },
          },
          ReturnValues: "NONE",
        })
      );
    } catch (error) {
      console.error(error);
    }

    // Delete local files
    void rm(originalFile);
    void rm(resizedFile);
  }
};

const run = async (cmd: string, args: string[]): Promise<Buffer> =>
  new Promise<Buffer>((resolve, reject) => {
    const proc = spawn(cmd, args);
    const resultBuffers: Buffer[] = [];
    proc.stdout.on("data", (buffer) => {
      resultBuffers.push(buffer);
    });
    proc.stderr.on("data", (buffer) => console.error(buffer.toString()));
    proc.on("exit", (code, signal) => {
      if (code !== 0) {
        reject(`failed with ${code || signal}`);
      } else {
        resolve(Buffer.concat(resultBuffers));
      }
    });
  });
