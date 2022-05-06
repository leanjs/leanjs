const packageJsonDeps = require("./package.json").dependencies;
const withTM = require("next-transpile-modules")([
  "@leanjs/core",
  "@leanjs/react",
  "@my-org/runtime-react",
  "@my-org/runtime-shared",
]);

module.exports = withTM({
  webpack: (config, options) => {
    const federationConfig = {
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
    };

    config.plugins.push(
      new options.webpack.container.ModuleFederationPlugin(federationConfig)
    );

    return config;
  },
  webpackDevMiddleware: (config) => {
    // Perform customizations to webpack dev middleware config
    // Important: return the modified config
    return config;
  },
});
