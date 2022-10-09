import { _ as CoreUtils } from "@leanjs/core";
import fs from "fs";
import chalk from "chalk";

import { uploadFolder } from "./upload-to-s3";
import { deployFunction } from "./cloudfront-functions/deploy";
import {
  createValidateEnvVariable,
  createValidateRequiredArgument,
  removeFirstSlash,
} from "./utils";

const { createRemoteName } = CoreUtils;

export const deploy = async ({
  distFolder = "dist",
  remoteBasename,
  packageName,
  version,
}: {
  distFolder?: string;
  remoteBasename: string;
  packageName: string;
  version: string;
}) => {
  const validateEnvVariable = createValidateEnvVariable({ packageName });
  const validateRequiredArgument = createValidateRequiredArgument({
    packageName,
  });

  validateRequiredArgument({ name: "remoteBasename", value: remoteBasename });
  validateRequiredArgument({ name: "packageName", value: packageName });

  validateEnvVariable("AWS_SECRET_ACCESS_KEY");
  validateEnvVariable("AWS_ACCESS_KEY_ID");

  const bucket = validateEnvVariable("AWS_S3_BUCKET");
  const region = validateEnvVariable("AWS_REGION");

  const cloudFrontDistributionId = process.env.CLOUDFRONT_DISTRIBUTION_ID;
  const batchLimit = Number(process.env.BATCH_LIMIT) || 25;

  const functionPath = `${__dirname}/cloudfront-functions/latest.js`;

  const functionCode = fs
    .readFileSync(functionPath, "utf8")
    ?.replace("__replace_with_version__", version);

  await uploadFolder({
    remoteBasename: removeFirstSlash(remoteBasename),
    region,
    bucket,
    distFolder,
    batchLimit,
  });

  if (cloudFrontDistributionId) {
    await deployFunction({
      comment: `It maps latest version to ${version}`,
      name: `${createRemoteName(packageName)}_latest`,
      region,
      functionCode,
      cloudFrontDistributionId,
    });

    console.log(`Latest version is now ${chalk.cyan(version)}`);
  }
};
