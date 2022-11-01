// eslint-disable-next-line @typescript-eslint/no-var-requires
const { HostWebpackPlugin } = require("@leanjs/webpack");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require("./package.json");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    transpilePackages: [
      "@leanjs/e2e-test-package-runtime-react",
      "@leanjs/e2e-test-subjects-package-runtime-shared",
    ],
  },
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
        shared: {
          react: packageJson.dependencies.react,
          ["react-dom"]: packageJson.dependencies["react-dom"],
        },
        // remotes: {
        //   packages: ["@leanjs/e2e-test-subjects-remote-react-sub-pages"],
        // },
      })
    );

    return config;
  },
};

module.exports = nextConfig;
