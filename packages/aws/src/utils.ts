import { exitError } from "@leanjs/cli";

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

export const removeFirstSlash = (path: string) => path.replace(/\//, "");
