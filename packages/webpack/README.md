# @leanjs/webpack

## Installation

If you use a monorepo (recommended) execute the following command at the root of your repository:

```sh
yarn add -D -W @leanjs/cli @leanjs/webpack webpack && yarn add -W @leanjs/core
```

If your app is not in a monorepo, then run the following command instead of the above:

```sh
yarn add -D @leanjs/cli @leanjs/webpack webpack && yarn add @leanjs/core
```

## RemoteWebpackPlugin

This plugin is an abstractions built on top of the following Webpack plugins:

- ModuleFederationPlugin from `webpack/lib/container/ModuleFederationPlugin`
- HtmlWebpackPlugin from `html-webpack-plugin`
- VirtualModulesPlugin from `webpack-virtual-modules`

### Basic usage

```js
const { RemoteWebpackPlugin } = require("@leanjs/webpack");

module.exports = {
  plugins: [new RemoteWebpackPlugin()],
};
```

### Configuration

`RemoteWebpackPlugin(config: RemoteWebpackOptions)` accepts the following arguments

```ts
interface RemoteWebpackOptions {
  /**
   * Add shared dependencies manually. Not required in a monorepo.
   * If this Webpack config is in a monorepo, this plugin will automatically
   * generate the shared dependencies based on the dependency graph
   */
  shared?: SharedDependencies;
  shared?: Record<string, string | SharedDependencies>;
}

interface SharedDependencies {
  /**
   * Include the provided and fallback module directly instead of async.
   * This allows to use this shared module in initial load too.
   * All possible shared modules need to be eager too.
   */
  eager?: boolean;

  /**
   * Version requirement from module in share scope.
   */
  requiredVersion?: string | false;

  /**
   * Allow only a single version of the shared module in share scope
   * (disabled by default).
   */
  singleton?: boolean;

  /**
   * Do not accept shared module if version is not valid
   * (defaults to yes, if local fallback module is available
   * and shared module is not a singleton, otherwise,
   * has no effect if there is no required version specified)
   */
  strictVersion?: boolean;

  /**
   * Version of the provided module.
   * Will replace lower matching versions, but not higher.
   */
  version?: string | false;
}
```

## HostWebpackPlugin

This plugin is an abstractions built on top of the following Webpack plugins:

- ModuleFederationPlugin from `webpack/lib/container/ModuleFederationPlugin`

### Basic usage

```js
const { HostWebpackPlugin } = require("@leanjs/webpack");

module.exports = {
  plugins: [new HostWebpackPlugin()],
};
```

### Configuration

`HostWebpackPlugin(config: HostWebpackOptions)` accepts the following arguments

```ts
interface HostWebpackOptions {
  /**
   * Add shared dependencies manually. Not required in a monorepo.
   * If this Webpack config is in a monorepo, this plugin will automatically
   * generate the shared dependencies based on the dependency graph
   */
  shared?: SharedDependencies;
  /**
   * Define what dependencies are automatically shared.
   * You can disable auto sharing passing false to it.
   */
  autoShared?: AutoShared | boolean;
  /**
   * Applies to all shared dependencies that don't have `eager` defined.
   */
  eager?: boolean;
  /**
   * Which packages are managed by Module Federation.
   * By default none of the packages.
   */
  remotes?: {
    packages: string[];
  };
}

interface AutoShared {
  excludePackages?: string[];
  excludeDirPattern?: string;
}

interface SharedDependencies {
  /**
   * Include the provided and fallback module directly instead of async.
   * This allows to use this shared module in initial load too.
   * All possible shared modules need to be eager too.
   */
  eager?: boolean;

  /**
   * Version requirement from module in share scope.
   */
  requiredVersion?: string | false;

  /**
   * Allow only a single version of the shared module in share scope
   * (disabled by default).
   */
  singleton?: boolean;

  /**
   * Do not accept shared module if version is not valid
   * (defaults to yes, if local fallback module is available
   * and shared module is not a singleton, otherwise,
   * has no effect if there is no required version specified)
   */
  strictVersion?: boolean;

  /**
   * Version of the provided module.
   * Will replace lower matching versions, but not higher.
   */
  version?: string | false;
}
```
