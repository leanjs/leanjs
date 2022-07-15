import { exitError } from "@leanjs/cli";
import { _ as CoreUtils } from "@leanjs/core";
import fs from "fs";

import { uploadFolder } from "./upload-to-s3";
import { deployFunction } from "./cloudfront-functions/deploy";
import chalk from "chalk";

const { createRemoteName } = CoreUtils;

export const createValidateEnvVariable =
  ({ packageName }: { packageName: string }) =>
  (variableName: string) => {
    const value = process.env[variableName];
    if (!value) {
      exitError(
        `Required env variable ${variableName} not found, ${packageName} deployment failed.`
      );
    }

    return value as string;
  };

export const createValidateRequiredArgument =
  ({ packageName }: { packageName: string }) =>
  ({ name, value }: { value?: string; name: string }) => {
    if (!value) {
      exitError(
        `Argument ${name} is required, ${packageName} deployment failed.`
      );
    }
  };

const removeFirstSlash = (path: string) => path.replace(/\//, "");

export const deploy = async ({
  distFolder,
  versionFolder,
  packageName,
  version,
}: {
  distFolder: string;
  versionFolder: string;
  packageName: string;
  version: string;
}) => {
  const validateEnvVariable = createValidateEnvVariable({ packageName });
  const validateRequiredArgument = createValidateRequiredArgument({
    packageName,
  });

  validateRequiredArgument({ name: "distFolder", value: distFolder });
  validateRequiredArgument({ name: "versionFolder", value: versionFolder });
  validateRequiredArgument({ name: "packageName", value: packageName });

  validateEnvVariable("AWS_SECRET_ACCESS_KEY");
  validateEnvVariable("AWS_ACCESS_KEY_ID");

  const bucket = validateEnvVariable("AWS_S3_BUCKET");
  const region = validateEnvVariable("AWS_REGION");

  const cloudFrontDistributionId = process.env.CLOUDFRONT_DISTRIBUTION_ID;
  const batchLimit = Number(process.env.BATCH_LIMIT) || 25;

  const functionPath = `${__dirname}/cloudfront-functions/latest.js`;
  let functionCode: string;

  try {
    functionCode = fs
      .readFileSync(functionPath, "utf8")
      ?.replace("__replace_with_version__", version);
  } catch (error: unknown) {
    exitError(`Failed to read ${functionPath}`, error as Error);
  }

  await uploadFolder({
    versionFolder: removeFirstSlash(versionFolder),
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
