import { _ as CoreUtils } from "@leanjs/core";
import { startDevProxyServer } from "@leanjs/cli";
import { Compiler, WebpackPluginInstance, container } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import VirtualModulesPlugin from "webpack-virtual-modules";

import * as fs from "fs";
import * as path from "path";

import { ModuleScopePlugin } from "./ModuleScopePlugin";
import type { SharedDependencies } from "../types";
import chalk from "chalk";

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
    const isEnvDevelopment = process.env.NODE_ENV === "development";
    const isEnvProduction = process.env.NODE_ENV === "production";
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
    if (!isEnvProduction && !remoteAppPort) {
      throw Error(
        `Webpack config devServer needs a port. More info https://webpack.js.org/configuration/dev-server/#devserverport`
      );
    }
    if (!packageName) {
      throw new Error(`No package name found in package.json`);
    }
    if (!remoteExists) {
      console.log(
        `⚠️ No src/remote.ts|js found. Exiting RemoteWebpackPlugin for ${chalk.cyan(
          packageName
        )}`
      );

      process.exit(1);
    }

    if (isEnvDevelopment) {
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

      startDevProxyServer()
        .then(({ api }) =>
          api.updatePackagePort(packageName, compiler.options.devServer?.port)
        )
        .catch((err) => {
          throw new Error(err);
        });
    }

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

    const publicPath =
      process.env.PUBLIC_PATH ?? compiler.options.output.publicPath;
    compiler.options.output = {
      ...compiler.options.output,
      ...(isEnvProduction && publicPath ? { publicPath } : {}),
      assetModuleFilename:
        compiler.options.output.assetModuleFilename ??
        "static/media/[name].[hash][ext]",
    };

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
