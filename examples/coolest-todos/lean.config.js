/* eslint-disable @typescript-eslint/no-var-requires */
const { createReactWebpackConfig } = require("@leanjs/webpack-react");
/* eslint-disable @typescript-eslint/no-var-requires */
const { createVueWebpackConfig } = require("@leanjs/webpack-vue");

module.exports = {
  devServer: { port: 56600 },
  selfHosted: {
    createRuntimePath: "@my-org/runtime-shared",
  },
  webpack: {
    react: createReactWebpackConfig(),
    vue: createVueWebpackConfig(),
  },
};
