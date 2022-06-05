/* eslint-disable @typescript-eslint/no-var-requires */
const {
  getDefaultReactWebpack,
  getDefaultVueWebpack,
} = require("@leanjs/webpack");

module.exports = {
  devServer: { port: 56600 },
  webpack: {
    react: getDefaultReactWebpack(),
    vue: getDefaultVueWebpack(),
  },
};
