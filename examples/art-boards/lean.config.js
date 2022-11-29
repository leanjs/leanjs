/* eslint-disable @typescript-eslint/no-var-requires */
const { createReactWebpackConfig } = require("@leanjs/webpack-react");
const { createVueWebpackConfig } = require("@leanjs/webpack-vue");

const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

const webpackConfig = createReactWebpackConfig();

module.exports = {
  devServer: { port: 33000 },
  webpack: {
    react: {
      ...webpackConfig,
      module: {
        ...webpackConfig.module,
        rules: [
          ...webpackConfig.module.rules,
          {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
          },
        ],
      },
      devtool: "source-map",
      plugins: [
        ...webpackConfig.plugins,
        new CopyPlugin({
          patterns: [
            {
              from: path.join(process.cwd(), "public/images"),
              to: "./images",
              noErrorOnMissing: true,
            },
          ],
        }),
      ],
    },
    vue: createVueWebpackConfig(),
  },
  command: {
    deploy: {
      use: "@leanjs/aws",
    },
  },
};
