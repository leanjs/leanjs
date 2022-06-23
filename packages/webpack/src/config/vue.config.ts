import type { Configuration } from "webpack";
import { getOutputPath } from "@leanjs/cli";

import { RemoteWebpackPlugin } from "../plugins/RemoteWebpackPlugin";

const isEnvDevelopment = process.env.NODE_ENV === "development";
const isEnvProduction = process.env.NODE_ENV === "production";

export const getDefaultVueWebpack = (): Configuration => {
  /* eslint-disable @typescript-eslint/no-var-requires */
  const { VueLoaderPlugin } = require("vue-loader");

  return {
    mode: isEnvDevelopment ? "development" : "production",
    plugins: [new VueLoaderPlugin(), new RemoteWebpackPlugin()],
    output: {
      filename: isEnvProduction ? "[name].[contenthash].js" : undefined,
      publicPath: "auto",
      path: getOutputPath(),
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: "vue-loader",
        },
        {
          test: /\.ts$/,
          loader: "ts-loader",
          options: {
            configFile: `${process.cwd()}/tsconfig.json`,
            appendTsSuffixTo: [/\.vue$/],
          },
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: ["@babel/plugin-transform-runtime"],
            },
          },
        },
      ],
    },
    resolve: {
      extensions: [".js", ".vue", ".ts"],
    },
  };
};
