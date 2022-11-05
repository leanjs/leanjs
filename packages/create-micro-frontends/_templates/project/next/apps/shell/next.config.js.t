---
to: <%= h.inflection.dasherize(projectName) %>/apps/shell/next.config.js
---
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { HostWebpackPlugin } = require("@leanjs/webpack");

module.exports = {
  experimental: {
    transpilePackages: [
     "@<%=h.inflection.dasherize(projectName)%>/runtime-react",
     "@<%=h.inflection.dasherize(projectName)%>/runtime-shared",
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
}
