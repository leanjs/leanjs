import { execFileSync } from "child_process";

import type { Dependencies } from "../types";

interface GetMonorepoDependencies {
  packageName: string;
  excludeDirPattern?: string;
  enabledRemotePackages?: string[];
}
export function getMonorepoDependencies({
  packageName,
  excludeDirPattern = "",
  enabledRemotePackages,
}: GetMonorepoDependencies) {
  let monorepoDependencies: {
    rootAndPackagesDependencies?: Dependencies;
    dependenciesOfRemotes?: Dependencies;
  } = {};

  try {
    monorepoDependencies = JSON.parse(
      // We run execFileSync because we use this function inside Webpack `apply` method which is synchronous,
      // and here we want to asynchronously read multiple files if we are in a monorepo.
      // We are not using async Webpack hooks because there is no async hook to modify
      // the Webpack config before ModuleFederationPlugin is applied (as far as I know).
      // To improve performance, we asynchronously read files in the repo inside the following script.
      // We need to synchronously wait for the end of the execution of the script because of this sync `apply` method
      execFileSync("node", [
        `${__dirname}/../scripts/stdoutWriteMonorepoDependencies.js`,
        `--excludeDirPattern=${excludeDirPattern}`,
        `--enabledRemotePackages=${enabledRemotePackages?.join(",")}`,
      ]).toString()
    );
  } catch (error) {
    console.log(
      `🔥 Failed to read shared dependencies of ${packageName}. Building with no shared dependencies`,
      error
    );
  }

  return monorepoDependencies;
}
