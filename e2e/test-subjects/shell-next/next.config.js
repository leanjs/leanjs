// eslint-disable-next-line @typescript-eslint/no-var-requires
const { HostWebpackPlugin } = require("@leanjs/webpack");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJsonDeps = require("./package.json").dependencies;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.plugins.push(
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
        },
      })
    );

    return config;
  },
};

module.exports = nextConfig;
