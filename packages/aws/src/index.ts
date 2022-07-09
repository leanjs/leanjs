import { exitError } from "@leanjs/cli";
import { uploadFolder } from "./upload-to-s3";

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
}: {
  distFolder: string;
  versionFolder: string;
  packageName: string;
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

  const batchLimit = Number(process.env.BATCH_LIMIT) || 25;

  await uploadFolder({
    versionFolder: removeFirstSlash(versionFolder),
    region,
    bucket,
    distFolder,
    batchLimit,
  });

  // TODO deploy CloudFront Function for "latest" version
};
