process.env.NODE_ENV = "production";

import chalk from "chalk";
import { emptyDirSync } from "fs-extra";
import createCompiler from "webpack";

import { getPackageInfo } from "../utils/packageJson";
import { findRootConfigSync, getWebpackConfig } from "../utils/leanConfig";
import { createBundlerCommand, exitError } from "../utils/command";
import { getOutputPath } from "../utils/path";

const command = createBundlerCommand();
command.parse(process.argv);

const { packageName } = getPackageInfo();
const { leanConfig } = findRootConfigSync();
if (!leanConfig) {
  exitError(chalk.red(`No lean.config.js found.`));
}

console.log(`Building ${chalk.cyan(packageName)}`);
const { config: configName } = command.opts();

emptyDirSync(getOutputPath());

// Abstract away the following Webpack code when we support more bundlers
const webpackConfig = getWebpackConfig({
  webpack: leanConfig?.webpack,
  packageName,
  configName,
});
createCompiler(webpackConfig).run((err) => {
  if (err) {
    exitError(`${packageName} build failed`, err);
  } else {
    console.log(`${packageName} was built successfully`);
  }
});
