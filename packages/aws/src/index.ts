import { exitError } from "@leanjs/cli";
import { uploadFolder } from "./upload-to-s3";
import { deployFunction } from "./deploy-cloud-function";
import { _ as CoreUtils } from "@leanjs/core";

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

  await uploadFolder({
    versionFolder: removeFirstSlash(versionFolder),
    region,
    bucket,
    distFolder,
    batchLimit,
  });

  if (cloudFrontDistributionId) {
    await deployFunction({
      comment: `mapping latest to version ${version}`,
      name: `${createRemoteName(packageName)}_latest`,
      region,
      functionCode: `
      function handler(event) {
        const request = event.request
        const regex = /^\/[^\/]+\/latest\/+/;
        const matches = request.uri.match(regex);
        if (matches.length) {
          const basename = matches[0].replace("/latest/", "");
          request.uri = request.uri.replace(regex, basename + "/" + version + "/");
        }
      
        return request;
      }
      `,
      cloudFrontDistributionId,
    });
  }
};
