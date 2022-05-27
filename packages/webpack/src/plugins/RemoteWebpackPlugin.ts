import { _ as CoreUtils } from "@leanjs/core";
import { Compiler, WebpackPluginInstance, container } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import VirtualModulesPlugin from "webpack-virtual-modules";
// import ErrorOverlayPlugin from "error-overlay-webpack-plugin";
import * as fs from "fs";
import * as path from "path";
// import chalk from "chalk";
// import * as os from "os";

import { ModuleScopePlugin } from "./ModuleScopePlugin";
import { startDevServer } from "../devServer";
import type { SharedDependencies } from "../types";

const { createRemoteName } = CoreUtils;
export interface RemoteWebpackOptions {
  shared?: Record<string, string | SharedDependencies>;
  shareAll?: boolean;
}

const { ModuleFederationPlugin } = container;

export class RemoteWebpackPlugin implements WebpackPluginInstance {
  private options: RemoteWebpackOptions;

  constructor(options?: RemoteWebpackOptions) {
    this.options = options ?? {};
  }

  apply(compiler: Compiler) {
    const { extensions } = compiler.options.resolve;
    const remoteExists = (
      extensions?.length ? extensions : [".ts", ".js"]
    ).reduce(
      (acc, ext) => acc || fs.existsSync(`${process.cwd()}/src/remote${ext}`),
      false
    );
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const packageJson = require(`${process.cwd()}/package.json`);
    const packageName = packageJson.name as string | undefined;
    const remoteAppPort = compiler.options.devServer?.port;
    const isProduction = process.env.NODE_ENV === "production";
    if (!isProduction && !remoteAppPort) {
      throw Error(
        `Webpack config devServer needs a port. More info https://webpack.js.org/configuration/dev-server/#devserverport`
      );
    }
    if (!packageName) {
      throw new Error(`No package name found in package.json`);
    }
    if (!remoteExists) {
      console.log(`⚠️ No src/remote.ts|js found. Exiting RemoteWebpackPlugin.`);
    } else {
      startDevServer()
        .then((api) =>
          api.updatePackagePort(packageName, compiler.options.devServer?.port)
        )
        .catch((err) => {
          throw new Error(err);
        });

      const { shared = {}, shareAll = true } = this.options;
      const moduleName = createRemoteName(packageName);
      const indexHtmlPath = path.resolve(process.cwd(), "public/index.html");
      const indexHtml = fs.readFileSync(
        fs.existsSync(indexHtmlPath)
          ? indexHtmlPath
          : path.resolve(__dirname, "../index.html"),
        "utf8"
      );
      const html = indexHtml
        .replace(`<body>`, `<body><div id="${packageName}"></div>`)
        .replace(`<title></title>`, `<title>${packageName}</title>`);

      compiler.options.resolve = {
        ...compiler.options.resolve,
        plugins: [
          ...(compiler.options.resolve.plugins ?? []),
          new ModuleScopePlugin(),
        ],
      };
      compiler.options.devServer = {
        ...compiler.options.devServer,
        historyApiFallback: {
          ...compiler.options.devServer?.historyApiFallback,
          index: `/index.html`,
        },
        headers: {
          ...compiler.options.devServer?.headers,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "GET, POST, PUT, DELETE, PATCH, OPTIONS",
          "Access-Control-Allow-Headers":
            "X-Requested-With, content-type, Authorization",
        },
      };

      compiler.options.output = {
        ...compiler.options.output,
        assetModuleFilename:
          compiler.options.output.assetModuleFilename ??
          "static/media/[name].[hash][ext]",
        // path: getOutputPath("web"),
      };

      // TODO runtimeChunk breaks Module Federation but enables fast reload when running remote in isolation
      // compiler.options.optimization = {
      //   ...compiler.options.optimization,
      //   runtimeChunk: "single",
      // };

      // TODO ErrorOverlayPlugin breaks randomly, investigate
      // const { devtool } = compiler.options;
      // if (devtool !== "cheap-module-source-map") {
      //   console.log(
      //     `⚠️ devtool is set to ${chalk.cyan(
      //       devtool
      //     )}. Webpack Error Overlay Plugin has been disabled. ${
      //       os.EOL
      //     }Please update devtool in your Webpack config to ${chalk.cyan(
      //       "cheap-module-source-map"
      //     )} to enable Webpack Error Overlay Plugin in ${chalk.cyan(
      //       process.cwd()
      //     )} and restart Webpack`
      //   );
      // } else {
      //   new ErrorOverlayPlugin().apply(compiler);
      // }

      new ModuleFederationPlugin({
        name: moduleName,
        filename: "remoteEntry.js",
        exposes: {
          ".": "./src/remote",
        },
        shared: {
          ...(shareAll ? packageJson.dependencies : {}),
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
}
