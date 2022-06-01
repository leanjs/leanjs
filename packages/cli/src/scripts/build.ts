process.env.NODE_ENV = "production";

import chalk from "chalk";
import { emptyDirSync } from "fs-extra";
import createCompiler from "webpack";

import { getPackageName } from "../utils/packageJson";
import { findLeanConfigSync, getWebpackConfig } from "../utils/leanConfig";
import { createCommand } from "../utils/command";
import { getOutputPath } from "../utils/path";

const command = createCommand();
command.parse(process.argv);

const packageName = getPackageName();
const leanConfig = findLeanConfigSync();
if (!leanConfig) {
  console.log(chalk.red(`No lean.config.js found.`));
  process.exit(1);
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
    console.log(`🔥 ${packageName} build failed`, err);
    process.exit(1);
  } else {
    console.log(`${packageName} was built successfully`);
  }
});
