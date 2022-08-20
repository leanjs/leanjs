/* eslint-disable @typescript-eslint/no-var-requires */
const { createReactWebpackConfig } = require("@leanjs/webpack-react");
/* eslint-disable @typescript-eslint/no-var-requires */
const { createVueWebpackConfig } = require("@leanjs/webpack-vue");

module.exports = {
  devServer: { port: 56500 },
  webpack: {
    react: createReactWebpackConfig(),
    vue: createVueWebpackConfig(),
  },
  selfHosted: {
    createRuntimePackage: "@leanjs/e2e-test-subjects-package-runtime-shared",
  },
  command: {
    deploy: {
      use: "@leanjs/aws",
    },
  },
};
