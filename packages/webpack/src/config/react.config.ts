import type { Configuration } from "webpack";
import { getOutputPath } from "@leanjs/cli";

import { RemoteWebpackPlugin } from "../plugins/RemoteWebpackPlugin";

const imageInlineSizeLimit = parseInt(
  process.env.IMAGE_INLINE_SIZE_LIMIT || "10000"
);

const isEnvDevelopment = process.env.NODE_ENV === "development";
const isEnvProduction = process.env.NODE_ENV === "production";

export const reactWebpack_dontExtendMe: Configuration = {
  mode: isEnvDevelopment ? "development" : "production",
  plugins: [new RemoteWebpackPlugin()],
  output: {
    filename: isEnvProduction ? "[name].[contenthash].js" : undefined,
    publicPath: "auto",
    path: getOutputPath(),
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: require.resolve("swc-loader"),
          options: {
            jsc: {
              parser: {
                syntax: "typescript",
                tsx: true,
              },
              transform: {
                react: {
                  pragma: "React.createElement",
                  pragmaFrag: "React.Fragment",
                  throwIfNamespace: true,
                  development: false,
                  useBuiltins: false,
                },
              },
            },
          },
        },
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.avif$/, /\.mp3$/],
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: imageInlineSizeLimit,
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
};
