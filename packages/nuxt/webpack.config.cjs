"use strict";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  target: ["es2020"],
  mode: "production",
  experiments: {
    outputModule: true,
  },
  entry: {
    index: "./src/index.ts",
  },
  resolve: {
    extensions: [".ts", ".js", ".vue"],
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: "vue-loader",
        },
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.build.json",
              transpileOnly: true,
              appendTsSuffixTo: ["\\.vue$"],
              happyPackMode: false,
            },
          },
        ],
      },
    ],
  },
  output: {
    module: true,
    filename: "[name].js",
    libraryTarget: "module",
  },
  plugins: [new VueLoaderPlugin()],
  externals: {
    vue: "vue",
    nuxt: "nuxt",
  },
};
