import type { Configuration } from "webpack";
import { VueLoaderPlugin } from "vue-loader";

import { RemoteWebpackPlugin } from "../plugins/RemoteWebpackPlugin";

export const vueWebpack_dontExtendMe: Configuration = {
  mode: process.env.NODE_ENV === "development" ? "development" : "production",
  plugins: [new RemoteWebpackPlugin(), new VueLoaderPlugin()],
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
