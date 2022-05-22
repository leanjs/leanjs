// eslint-disable-next-line @typescript-eslint/no-var-requires
const { RemoteWebpackPlugin } = require("@leanjs/webpack");

const port = 44441;

module.exports = {
  mode: "development",
  devServer: {
    port,
  },
  plugins: [new RemoteWebpackPlugin()],
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
