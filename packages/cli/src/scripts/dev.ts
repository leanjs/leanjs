import createCompiler from "webpack";
import WebpackDevServer from "webpack-dev-server";
import chalk from "chalk";
import * as os from "os";
import { Command } from "commander";
import * as fs from "fs";

import { startDevProxyServer } from "../utils/devProxyServer";
import findLeanConfigSync from "../utils/findLeanConfigSync";

const program = new Command();
program
  .configureOutput({
    outputError: (str, write) => write(chalk.red(str)),
  })
  .requiredOption(
    "-c, --config <type>",
    "Name of the config defined in lean.config.js that you want to use. E.g. --config=react"
  );

program.parse(process.argv);

async function dev() {
  const packageJsonFullPath = `${process.cwd()}/package.json`;
  if (!fs.existsSync(packageJsonFullPath)) {
    console.error(
      chalk.red(`No package.json found in path: ${chalk.cyan(process.cwd())}`)
    );
    process.exit(1);
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const packageJson = require(packageJsonFullPath);
  const packageName = packageJson.name as string | undefined;
  if (!packageName) {
    console.error(
      chalk.red(
        `No package name found in package.json. Path: ${process.cwd()}/package.json`
      )
    );
    process.exit(1);
  }
  const leanConfig = findLeanConfigSync();
  if (!leanConfig) {
    console.log(chalk.red(`No lean.config.js found.`));
    process.exit(1);
  }
  try {
    console.log(
      `Starting development environment for ${chalk.cyan(packageName)}`
    );
    process.env.NODE_ENV = "development";
    const { api } = await startDevProxyServer();
    const port = await api.generatePackagePort(packageName);
    const { config: configName } = program.opts();

    // Abstract away the following Webpack code when we support more bundlers
    const functionOrObjectConfig = leanConfig?.webpack?.[configName];
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
    const webpackConfig =
      typeof functionOrObjectConfig === "function"
        ? functionOrObjectConfig({ port })
        : functionOrObjectConfig;
    webpackConfig.devServer = {
      ...webpackConfig.devServer,
      port: webpackConfig.devServer?.port ?? port,
    };
    const compiler = createCompiler(webpackConfig);
    const devServerConfig = {
      port: webpackConfig.devServer.port,
    };
    const devServer = new WebpackDevServer(devServerConfig, compiler);

    devServer.start();

    ["SIGINT", "SIGTERM"].forEach(function (sig) {
      process.on(sig, () => {
        devServer?.close();
        process.exit();
      });
    });

    if (process.env.CI !== "true") {
      // Gracefully exit when stdin ends
      process.stdin.on("end", () => {
        devServer?.close();
        process.exit();
      });
    }
  } catch (error: any) {
    console.log(
      `🔥 dev command failed for ${chalk.cyan(packageName)}:${os.EOL}${
        error?.message || error
      }`
    );

    process.exit(1);
  }
}

dev();
