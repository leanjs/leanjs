// eslint-disable-next-line @typescript-eslint/no-var-requires
const { reactWebpack_dontExtendMe } = require("@leanjs/webpack");

// Want to extend reactWebpack_dontExtendMe?
// Create your own config instead -> TODO ADD LINK TO DOCS

module.exports = {
  devServer: { port: 56500 },
  webpack: {
    react: reactWebpack_dontExtendMe,
  },
};
