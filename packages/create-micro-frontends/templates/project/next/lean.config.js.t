---
to: <%= h.inflection.dasherize(projectName) %>/lean.config.js
---
/* eslint-disable @typescript-eslint/no-var-requires */
const {
  getDefaultReactWebpack,
} = require("@leanjs/webpack");

module.exports = {
  devServer: { port: <%=devServerPort%> },
  webpack: {
    react: getDefaultReactWebpack()
  },
};
