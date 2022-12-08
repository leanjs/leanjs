// @ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { HostWebpackPlugin } = require("@leanjs/webpack");

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  experimental: {
    transpilePackages: [
      "@leanjs/core",
      "@leanjs/react",
      "@my-org/runtime-react",
      "@my-org/runtime-shared",
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

module.exports = nextConfig;
