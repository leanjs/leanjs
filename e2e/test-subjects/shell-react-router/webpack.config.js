/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require("html-webpack-plugin");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { HostWebpackPlugin } = require("@leanjs/webpack");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJsonDeps = require("./package.json").dependencies;

const port = 44446;

module.exports = {
  mode: "development",
  devServer: {
    historyApiFallback: true,
    port,
  },
  output: {
    publicPath: "/",
  },
  plugins: [
    new HostWebpackPlugin({
      shared: {
        react: {
          eager: true,
          requiredVersion: packageJsonDeps.react,
        },
        "react-dom": {
          eager: true,
          requiredVersion: packageJsonDeps["react-dom"],
        },
        "react-router-dom": {
          eager: true,
          requiredVersion: packageJsonDeps["react-router-dom"],
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
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
