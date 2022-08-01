// eslint-disable-next-line @typescript-eslint/no-var-requires
const { HostWebpackPlugin } = require("@leanjs/webpack");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJsonDeps = require("./package.json").dependencies;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withTM = require("next-transpile-modules")([
  "@leanjs/e2e-test-subjects-package-runtime-react",
  "@leanjs/e2e-test-subjects-package-runtime-shared",
]);

/** @type {import('next').NextConfig} */
const nextConfig = withTM({
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/react-sub-pages/:id",
        destination: "/react-sub-pages?id=:id",
      },
      {
        source: "/vue-sub-pages/:path",
        destination: "/vue-sub-pages?path=:path",
      },
    ];
  },
  webpack: (config) => {
    config.plugins.push(
      new HostWebpackPlugin({
        eager: true,
      })
    );

    return config;
  },
});

module.exports = nextConfig;
