/* eslint-disable @typescript-eslint/no-var-requires */
const { RemoteWebpackPlugin } = require("@leanjs/webpack");
const { getOutputPath } = require("@leanjs/cli");

// 👋 This is an example of a custom Webpack config for just one micro-frontend
// This is not recommended. It's better that you share your configs using lean.config.js and use `lean build --config config_key`

module.exports = {
  mode: "production",
  plugins: [
    new RemoteWebpackPlugin(), // 👈 Required to enable Lean Micro-frontends
  ],
  output: {
    filename: "[name].[contenthash].js",
    publicPath: "auto",
    path: getOutputPath(),
  },
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
