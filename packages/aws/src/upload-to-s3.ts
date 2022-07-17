import {
  PutObjectCommand,
  S3Client,
  PutObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { exitError, readFilePaths } from "@leanjs/cli";
import chalk from "chalk";
import { readFile } from "fs/promises";
import { lookup } from "mime-types";
import { join } from "path";

interface UploadFolderToS3Args {
  remoteBasename: string;
  distFolder: string;
  bucket: string;
  region: string;
  batchLimit: number;
}

export async function uploadFolder({
  remoteBasename,
  distFolder,
  bucket: Bucket,
  region,
  batchLimit,
}: UploadFolderToS3Args) {
  const distFolderPath = join(process.cwd(), distFolder);
  const filePaths = readFilePaths(distFolderPath);

  try {
    const s3Client = new S3Client({ region });
    let batch: Promise<PutObjectCommandOutput>[] = [];

    console.log(`Uploading to AWS bucket ${Bucket}`);

    for await (const filePath of filePaths) {
      const filename = filePath.split(`${distFolder}/`).pop() || "";
      const Body = await readFile(filePath);
      const Key = `${remoteBasename}/${filename}`;

      console.log(`Uploading ${Key}`);

      batch.push(
        s3Client.send(
          new PutObjectCommand({
            Key,
            Body,
            Bucket,
            ContentType: lookup(filename) || "application/octet-stream",
          })
        )
      );

      if (batch.length === batchLimit) {
        await Promise.all(batch);
        batch = [];
      }
    }

    if (batch.length) await Promise.all(batch);
  } catch (error: unknown) {
    exitError(`Error uploading ${chalk.cyan(distFolder)}`, error as Error);
  }
}
