/* eslint-disable @typescript-eslint/no-var-requires */
const { RemoteWebpackPlugin } = require("@leanjs/webpack");
const ErrorOverlayPlugin = require("error-overlay-webpack-plugin");

// 👋 This is an example of a custom Webpack config for just one micro-app
// This is not recommended. It's better that you share your configs using lean.config.js and use `lean dev --config config_key`

const port = 8889;

module.exports = {
  mode: "development",
  devtool: "eval-cheap-source-map",
  devServer: {
    port,
  },
  plugins: [
    new RemoteWebpackPlugin(), // 👈 Required to enable micro-apps
    // new ErrorOverlayPlugin(), // ❌ this plugin breaks HMR when we run it in http:localhost:8889, but HMT works in the shell
  ],
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: require.resolve("swc-loader"),
          options: {
            jsc: {
              parser: {
                syntax: "typescript",
                tsx: true,
              },
              transform: {
                react: {
                  pragma: "React.createElement",
                  pragmaFrag: "React.Fragment",
                  throwIfNamespace: true,
                  development: false,
                  useBuiltins: false,
                },
              },
            },
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
};
