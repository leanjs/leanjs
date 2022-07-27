# @leanjs/webpack

# Installation

`yarn add -D @leanjs/webpack`

It exports Webpack plugins to implement LeanJS micro-frontends.

## RemoteWebpackPlugin

This plugin is an abstractions built on top of the following Webpack plugins:

- ModuleFederationPlugin from `webpack/lib/container/ModuleFederationPlugin`
- HtmlWebpackPlugin from `html-webpack-plugin`
- VirtualModulesPlugin from `webpack-virtual-modules`

### Usage

```js
const { RemoteWebpackPlugin } = require("@leanjs/webpack");

module.exports = {
  plugins: [new RemoteWebpackPlugin()],
};
```

### API

`RemoteWebpackPlugin(config: RemoteWebpackOptions)` accepts the following arguments

```ts
interface RemoteWebpackOptions {
  shared?: Record<string, string | SharedDependencies>;
  shareAll?: boolean;
}

interface SharedDependencies {
  /**
   * Include the provided and fallback module directly instead behind an async request. This allows to use this shared module in initial load too. All possible shared modules need to be eager too.
   */
  eager?: boolean;

  /**
   * Version requirement from module in share scope.
   */
  requiredVersion?: string | false;

  /**
   * Allow only a single version of the shared module in share scope (disabled by default).
   */
  singleton?: boolean;

  /**
   * Do not accept shared module if version is not valid (defaults to yes, if local fallback module is available and shared module is not a singleton, otherwise no, has no effect if there is no required version specified).
   */
  strictVersion?: boolean;

  /**
   * Version of the provided module. Will replace lower matching versions, but not higher.
   */
  version?: string | false;
}
```

## HostWebpackPlugin

This plugin is an abstractions built on top of the following Webpack plugins:

- ModuleFederationPlugin from `webpack/lib/container/ModuleFederationPlugin`

### Usage

```js
const { HostWebpackPlugin } = require("@leanjs/webpack");

module.exports = {
  plugins: [new HostWebpackPlugin()],
};
```

### API

`HostWebpackPlugin(config: HostWebpackOptions)` accepts the following arguments

```ts
interface RemoteWebpackOptions {
  shared?: Record<string, string | SharedDependencies>;
  shareAll?: boolean;
}

interface SharedDependencies {
  /**
   * Include the provided and fallback module directly instead behind an async request. This allows to use this shared module in initial load too. All possible shared modules need to be eager too.
   */
  eager?: boolean;

  /**
   * Version requirement from module in share scope.
   */
  requiredVersion?: string | false;

  /**
   * Allow only a single version of the shared module in share scope (disabled by default).
   */
  singleton?: boolean;

  /**
   * Do not accept shared module if version is not valid (defaults to yes, if local fallback module is available and shared module is not a singleton, otherwise no, has no effect if there is no required version specified).
   */
  strictVersion?: boolean;

  /**
   * Version of the provided module. Will replace lower matching versions, but not higher.
   */
  version?: string | false;
}
```
