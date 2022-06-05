/* eslint-disable @typescript-eslint/no-var-requires */
const {
  getDefaultReactWebpack,
  getDefaultVueWebpack,
} = require("@leanjs/webpack");

module.exports = {
  devServer: { port: 56500 },
  webpack: {
    react: getDefaultReactWebpack(),
    vue: getDefaultVueWebpack(),
  },
};
