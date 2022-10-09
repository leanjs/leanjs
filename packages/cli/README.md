# @leanjs/cli

The LeanJS CLI provides commands to help you develop, build, and deploy your composable apps. This package also includes the [Proxy Dev Server](#proxy-dev-server).

## Installation

If you use a monorepo (recommended) execute the following command at the root of your repository:

```sh
yarn add -D -W @leanjs/cli && yarn add -W @leanjs/core
```

then in the `package.json` of each composable app add the following `devDependency`:

```
"devDependencies": {
  "@leanjs/cli": "*"
}
```

If your app is not in a monorepo, then run the following command instead of the above:

```sh
yarn add -D @leanjs/cli && yarn add @leanjs/core
```

## Basic usage

You need to create a `lean.config.js` file at the root of the repository.

```
my-repo/
├─ lean.config.js 👈
├─ package.json
```

The minimal `lean.config.js` is the following:

```js
// lean.config.js

module.exports = {
  devServer: { port: 55555 }, // use any available port here
};
```

## Proxy Dev Server

There are two development servers involved when you run a composable app.

1. A usual development server that watches your composable app code, builds it, and serves it at a given local address. For instance, Webpack Dev Server.
2. A proxy development server that all composable apps connect to to send some information. This dev server runs at the address defined in your `lean.config.js`, `devServer` field:

```js
// lean.config.js

module.exports = {
  devServer: { port: 55555 }, // 👈 proxy dev server
};
```

The Lean CLI `dev` command starts the proxy dev server automatically when you run the first `lean dev` command. You can navigate to `http://localhost:{LEAN_CONFIG_JS_DEV_SERVER_PORT}` (e.g. localhost:55555) and see what composable apps you are running locally. If you have not run a `lean dev` command, the proxy server won't be running.

## Commands

Once you install `@leanjs/cli` and create a `lean.config.js`, you can execute `lean` commands from your `package.json`/s `scripts` as follows:

### `lean dev`

It starts a development server specific for the composable app defined in the same `package.json` and executes its entry point `src/index.js|ts`. This development server will either run the composable app at the next available port after the `devServer` port defined in your `lean.config.js` (recommended), or at a given port (e.g. using `lean dev --port 12345`).

This command will also connect to the local [Proxy Dev Server](#proxy-dev-server) and register the composable app with the address it's running at. If the local Proxy Dev Server is not running at the port defined in `lean.config.js`, `devServer` field, then `lean dev` will start a new Proxy Dev Server using the `devServer` port.

Arguments:

#### --config NAME

This argument is **requried**. The NAME passed to `config` must match a config name defined in your `lean.config.js`. We only support Webpack currently. Example:

Given the following `lean.config.js`:

```js
// lean.config.js
const { reactWebpackConfig1, reactWebpackConfig2 } = require("@my-org/webpack");

module.exports = {
  devServer: { port: 55555 },
  webpack: {
    reactConfig1: reactWebpackConfig1,
    reactConfig2: reactWebpackConfig2,
  },
};
```

You can run:

```
lean dev --config reactConfig1
```

This command will look for a `lean.config.js` in the current directory. If it doesn't find it, it'll look at a few parent directories. If `lean.config.js` is found it will read the corresponding config.

#### --port NUMBER

This argument is **optional**. It will run a development server for your composable app at port NUMBER. If port NUMBER is in use the server won't start and the command will fail. Example:

```
lean dev --port 56567 --config react
```

### `lean build`

It builds the composable app where the `package.json` that ran `build` is.

Arguments:

#### --config NAME

This argument is **requried**. The NAME passed to config must match a config name defined in your `lean.config.js`. We currently support Webpack only. Example:

```
lean dev --config reactConfig1
```

This command will look for a `lean.config.js` in the current directory. If it doesn't find it, it'll look at a few parent directories. If `lean.config.js` is found it will read the corresponding config.

### `lean deploy`

It deploys the composable app where the `package.json` that ran `deploy` is.

Arguments:

#### --use PACKAGE

This argument is **optional**. The PACKAGE passed to `--use` must be a package installed in the repository.

```
lean deploy --use @leanjs/aws
```

When running `lean deploy` without `--use` it'll use the default value defined in `lean.config.js`, `deploy` command, `use` field:

```js
// lean.config.js

module.exports = {
  devServer: { port: 55555 },
  command: {
    deploy: {
      use: "@leanjs/aws",
    },
  },
};
```

If no package to `use` is found then `lean deploy` will error and exit with code 1.

## Config examples

This is an example of a `package.json` for a composable app with all the Lean commands. Notice, this is not the root `package.json` if you use a monorepo.

```json
{
  "name": "@my-org/composable-app-x",
  "version": "1.0.0",
  "scripts": {
    "dev": "lean dev --config react",
    "build": "lean build --config react",
    "deploy": "lean deploy --use @leanjs/aws"
  },
  "devDependencies": {
    "@leanjs/cli": "*"
  }
}
```

This is an example of a `lean.config.js` used by the above `package.json`.

```js
// lean.config.js
const { reactWebpackConfig } = require("@my-org/webpack");

module.exports = {
  devServer: { port: 55555 },
  webpack: {
    react: reactWebpackConfig,
  },
};
```
