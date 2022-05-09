import { createValidJSVarName } from "@leanjs/core";
import { Compiler, WebpackPluginInstance, container } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import VirtualModulesPlugin from "webpack-virtual-modules";
import ErrorOverlayPlugin from "error-overlay-webpack-plugin";
import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";
import * as os from "os";

import { ModuleScopePlugin } from "./ModuleScopePlugin";
import { saveMicroAppPort } from "../proxy";

export interface MicroFrontendWebpackInternalOptions {
  shared: Record<string, string | SharedConfig>;
  shareAllDependencies?: boolean;
}

export interface SharedConfig {
  /**
   * Include the provided and fallback module directly instead behind an async request. This allows to use this shared module in initial load too. All possible shared modules need to be eager too.
   */
  eager?: boolean;

  /**
   * Version requirement from module in share scope.
   */
  requiredVersion?: string | false;

  /**
   * Allow only a single version of the shared module in share scope (disabled by default).
   */
  singleton?: boolean;

  /**
   * Do not accept shared module if version is not valid (defaults to yes, if local fallback module is available and shared module is not a singleton, otherwise no, has no effect if there is no required version specified).
   */
  strictVersion?: boolean;

  /**
   * Version of the provided module. Will replace lower matching versions, but not higher.
   */
  version?: string | false;
}

const { ModuleFederationPlugin } = container;

export class MicroFrontendWebpackPlugin implements WebpackPluginInstance {
  private options: MicroFrontendWebpackInternalOptions;

  constructor(options: MicroFrontendWebpackInternalOptions) {
    this.options = options || {};
  }

  apply(compiler: Compiler) {
    saveMicroAppPort({ microAppPort: compiler.options.devServer?.port });
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const packageJson = require(`${process.cwd()}/package.json`);
    const { shared = {}, shareAllDependencies = true } = this.options;
    const packageName = packageJson.name;
    const moduleName = createValidJSVarName(packageName);
    const indexHtmlPath = path.resolve(process.cwd(), "public/index.html");
    const indexHtml = fs.readFileSync(
      fs.existsSync(indexHtmlPath)
        ? indexHtmlPath
        : path.resolve(__dirname, "../index.html"),
      "utf8"
    );
    const html = indexHtml.replace(/%PACKAGE_NAME%/g, packageName);

    compiler.options.resolve = {
      ...compiler.options.resolve,
      plugins: [
        ...(compiler.options.resolve.plugins ?? []),
        new ModuleScopePlugin(),
      ],
    };

    const { devtool } = compiler.options;
    if (devtool !== "cheap-module-source-map") {
      console.log(
        `⚠️ devtool is set to ${chalk.cyan(
          devtool
        )}. Webpack Error Overlay Plugin has been disabled. ${
          os.EOL
        }Please update devtool in your Webpack config to ${chalk.cyan(
          "cheap-module-source-map"
        )} to enable Webpack Error Overlay Plugin in ${chalk.cyan(
          process.cwd()
        )} and restart Webpack`
      );
    } else {
      new ErrorOverlayPlugin().apply(compiler);
    }

    new ModuleFederationPlugin({
      name: moduleName,
      filename: "remoteEntry.js",
      exposes: {
        ".": "./src/micro",
      },
      shared: {
        ...(shareAllDependencies ? packageJson.dependencies : {}),
        ...shared,
      },
    }).apply(compiler);

    new VirtualModulesPlugin({
      "./src/index.js": `import("./bootstrap");`,
      "./src/bootstrap": fs.readFileSync(
        path.resolve(__dirname, "../bootstrap.js"),
        "utf8"
      ),
      "./public/index.html": html,
    }).apply(compiler);

    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }).apply(compiler);
  }
}