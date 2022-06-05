/* eslint-disable @typescript-eslint/no-var-requires */
const { defaultReactWebpack, defaultVueWebpack } = require("@leanjs/webpack");

module.exports = {
  devServer: { port: 56500 },
  webpack: {
    react: defaultReactWebpack,
    vue: defaultVueWebpack,
  },
};
