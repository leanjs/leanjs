// eslint-disable-next-line @typescript-eslint/no-var-requires
const { HostWebpackPlugin } = require("@leanjs/webpack");

module.exports = {
  experimental: {
    transpilePackages: [
      "@my-org/runtime-react",
      "@my-org/runtime-shared",
      "@my-org/runtime-vue",
      "@my-org/user",
    ],
  },
  webpack: (config) => {
    config.plugins.push(
      new HostWebpackPlugin({
        eager: true,
      })
    );

    return config;
  },
  webpackDevMiddleware: (config) => {
    // Perform customizations to webpack dev middleware config
    // Important: return the modified config
    return config;
  },
};
