# @leanjs/webpack

## MicroFrontend Webpack Plugin

It exports a Webpack plugin to implement [LEAN](https://alexlobera.com/what-are-micro-frontends-4-lean-principles/) micro-frontends. MicroFrontendWebpackPlugin is an abstraction built on top of the following Webpack plugins:

- ModuleFederationPlugin from `webpack/lib/container/ModuleFederationPlugin`
- HtmlWebpackPlugin from `html-webpack-plugin`
- VirtualModulesPlugin from `webpack-virtual-modules`

# Installation

`yarn add @leanjs/webpack`

# Usage

## Basic

```js
const { MicroFrontendWebpackPlugin } = require("@leanjs/webpack");

module.exports = {
  plugins: [new MicroFrontendWebpackPlugin()],
};
```

## API

`MicroFrontendWebpackPlugin(config: SharedConfig)` accepts the following arguments

```ts
interface SharedConfig {
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
