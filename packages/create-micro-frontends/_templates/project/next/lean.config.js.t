---
to: <%= h.inflection.dasherize(projectName) %>/lean.config.js
---
/* eslint-disable @typescript-eslint/no-var-requires */
const { createReactWebpackConfig } = require("@leanjs/webpack-react");

module.exports = {
  devServer: { port: <%=devServerPort%> },
  selfHosted: {
    createRuntimePath: "@<%=h.inflection.dasherize(projectName)%>/runtime-shared",
  },
  webpack: {
    react: createReactWebpackConfig()
  },
};
