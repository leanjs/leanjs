/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require("html-webpack-plugin");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { HostWebpackPlugin } = require("@leanjs/webpack");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
/* eslint-disable @typescript-eslint/no-var-requires */
const CopyPlugin = require("copy-webpack-plugin");
/* eslint-disable @typescript-eslint/no-var-requires */
const { DefinePlugin } = require("webpack");

const port = 44446;
const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProduction ? "production" : "development",
  devtool: isProduction ? undefined : "source-map",
  entry: {
    async: {
      import: ["./src/entry/async"],
    },
  },
  devServer: {
    historyApiFallback: true,
    port,
    open: {
      app: {
        name: "Google Chrome",
      },
    },
  },
  output: {
    path: path.join(__dirname, "/dist/"),
    filename: "[name].[contenthash].js",
  },
  plugins: [
    new HostWebpackPlugin({
      remotes: {
        // packages: isProduction
        //   ? []
        //   : ["@art-boards/zima-blue", "@art-boards/chat-app"],
        packages: ["@art-boards/dashboard-app"],
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.join(process.cwd(), "public/images"),
          to: "./images",
          noErrorOnMissing: true,
        },
      ],
    }),
    new DefinePlugin({
      "process.env.EXAMPLE_ART_BOARDS_BASENAME": JSON.stringify(
        process.env.EXAMPLE_ART_BOARDS_BASENAME
      ),
      "process.env.EXAMPLE_ART_BOARDS_ORIGIN": JSON.stringify(
        process.env.EXAMPLE_ART_BOARDS_ORIGIN || "http://localhost:33000"
      ),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
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
