/* eslint-disable @typescript-eslint/no-var-requires */
const {
  reactWebpack_dontExtendMe,
  vueWebpack_dontExtendMe,
} = require("@leanjs/webpack");

// Want to extend reactWebpack_dontExtendMe or vueWebpack_dontExtendMe?
// Create your own config instead -> TODO ADD LINK TO DOCS

module.exports = {
  devServer: { port: 56500 },
  webpack: {
    react: reactWebpack_dontExtendMe,
    vue: vueWebpack_dontExtendMe,
  },
};
