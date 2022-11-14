/* eslint-disable @typescript-eslint/no-var-requires */
const { createReactWebpackConfig } = require("@leanjs/webpack-react");

/* eslint-disable @typescript-eslint/no-var-requires */
const CopyPlugin = require("copy-webpack-plugin");

/* eslint-disable @typescript-eslint/no-var-requires */
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
  },
  command: {
    deploy: {
      use: "@leanjs/aws",
    },
  },
};
