import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";

import type { LeanConfig, LeanWebpackConfig } from "../types";

const filename = "lean.config.js";
const currentWorkingDir = process.cwd();
let maxRecursion = 4;
let config: LeanConfig;

export function findLeanConfigSync(relativePath = "."): LeanConfig | undefined {
  // TODO check that this cached config works with Turborepo. Does Turbo run each script in a separate process?
  if (config) {
    return config;
  } else if (
    maxRecursion === 0 ||
    path.resolve(currentWorkingDir, relativePath) === "/"
  ) {
    return undefined;
  }

  maxRecursion--;
  const fullpath = path.join(currentWorkingDir, relativePath, filename);
  const exists = fs.existsSync(fullpath);

  if (exists) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    config = require(fullpath);
    // TODO validate config, maybe https://www.npmjs.com/package/max-validator ?
    return config;
  } else {
    return findLeanConfigSync(path.join("..", relativePath));
  }
}

interface GetWebpackConfigArgs {
  webpack?: LeanWebpackConfig;
  configName: string;
  packageName: string;
  port?: number;
}

export function getWebpackConfig({
  webpack,
  configName,
  packageName,
  port,
}: GetWebpackConfigArgs) {
  const functionOrObjectConfig = webpack?.[configName];
  if (!functionOrObjectConfig) {
    console.log(
      chalk.red(
        `No webpack config found in lean.config.js for ${chalk.cyan(
          configName
        )} in package: ${chalk.cyan(packageName)}`
      )
    );
    process.exit(1);
  }

  return typeof functionOrObjectConfig === "function"
    ? functionOrObjectConfig({ port })
    : functionOrObjectConfig;
}
