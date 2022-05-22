// eslint-disable-next-line @typescript-eslint/no-var-requires
const { RemoteWebpackPlugin } = require("@leanjs/webpack");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { VueLoaderPlugin } = require("vue-loader");

const port = 44442;

module.exports = {
  mode: "development",
  devServer: {
    port,
  },
  plugins: [new RemoteWebpackPlugin(), new VueLoaderPlugin()],
  entry: "./src/index.js",
  resolve: {
    extensions: [".js", ".vue", ".ts"],
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: "vue-loader",
      },
      {
        test: /\.ts$/,
        loader: "ts-loader",
        options: {
          configFile: `${__dirname}/tsconfig.json`,
          appendTsSuffixTo: [/\.vue$/],
        },
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
    ],
  },
};
