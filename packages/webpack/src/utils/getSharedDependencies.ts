import { execFileSync } from "child_process";

import type { DependencyVersion } from "../types";
import { versionDependencies } from "./dependencies";

interface GetSharedDependencies {
  packageName: string;
  dependencies: DependencyVersion;
  peerDependencies: DependencyVersion;
}
export function getSharedDependencies({
  packageName,
  dependencies,
  peerDependencies,
}: GetSharedDependencies) {
  // We run execFileSync because we use this function inside Webpack `apply` method which is synchronous,
  // and here we want to asynchronously read multiple files if we are in a monorepo.
  // We are not using async Webpack hooks because there is no async hook to modify
  // the Webpack config before ModuleFederationPlugin is applied (as far as I know).
  // To improve performance, we asynchronously read files in the repo inside the following script.
  // We need to synchronously wait for the end of the execution of the script because of this sync `apply` method
  const monorepoVersions = execFileSync("node", [
    `${__dirname}/../scripts/stdoutWriteMonorepoVersions.js`,
  ]);

  let sharedDependencies: DependencyVersion = {};
  try {
    sharedDependencies = JSON.parse(monorepoVersions.toString());
  } catch (error) {
    console.log(
      `🔥 Failed to read shared dependencies of ${packageName}. Building with no shared dependencies`,
      error
    );
  }

  return versionDependencies({
    dependencies,
    peerDependencies,
    sharedDependencies,
  });
}
