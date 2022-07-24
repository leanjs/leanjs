# @leanjs/cli

The LeanJS Cli provides commands to help you develop, build, and deploy your LeanJS micro-frontends. This package also includes the [Centralized Dev Server](#centralized-dev-server).

## Installation

If you use a monorepo (recommended) execute the following command at the root of your repository:

```sh
yarn add -D @leanjs/cli
```

Then in the `package.json` of each micro-frontend add the following `devDependency`:

```
"devDependencies": {
  "@leanjs/cli": "*"
}
```

If you don't use a monoreppo, run `yarn add -D @leanjs/cli` in each micro-frontend repository.

<!-- ## Usage

Each micro-frontend is defined in a folder that contains a `package.json` file at the root. -->

## Configuration

You need to create a `lean.config.js` file at the root of the monorepo. You can also use separate repositories for each micro-frontend with a `lean.config.js` in each micro-frontend repo, but it's not recommended.

The minimal `lean.config.js` is the following:

```js
// lean.config.js

module.exports = {
  devServer: { port: 55555 }, // use any available port here
};
```

## Commands

Once you install `@leanjs/cli`, you can execute `lean` commands from your `package.json`/s `scripts` as follows:

### `lean dev`

It starts a development server specific for the micro-frontend defined in the same `package.json` and executes its entry point `src/remote.js|ts`. This development server will either run the micro-frontend at a random available port (recommended) or at a given port (e.g. using `lean dev --port 56567`).

This command will also connect to the local [Centralized Dev Server](#centralized-dev-server) and register the micro-frontend with the address it's running at. If the local Centralized Dev Server is not running at the port defined in `lean.config.js`, `devServer` field, then `lean dev` will start a new Centralized Dev Server.

Arguments:

#### --config NAME

This argument is **requried**. The NAME passed to config must match a config name defined in your `lean.config.js`. We currently support Webpack only. Example:

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

This command will look for a `lean.config.js` in the current directory. If it doesn't find it, it'll look at a few parent directories.

#### --port NUMBER

This argument is **optional**. It will run a development server for your micro-frontend at port NUMBER. If port NUMBER is in use the server won't start and the command will fail. Example:

```
lean dev --port 56567 --config react
```

### `build`

It builds the micro-frontend where the `package.json` that ran `build` is.

Arguments:

#### --config NAME

This argument is **requried**. The NAME passed to config must match a config name defined in your `lean.config.js`. We currently support Webpack only. Example:

```
lean dev --config reactConfig1
```

### `deploy`

It deploys the micro-frontend where the `package.json` that ran `deploy` is.

Arguments:

#### --use PACKAGE

This argument is **optional**. The PACKAGE passed to `--use` must be a package defined and installed in the devDependencies of the package.

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

### `package.json`

This is an example of a `package.json` for a micro-frontend with all the LeanJS commands. Notice, this is not the root `package.json` if you use a monorepo.

```json
{
  "name": "@my-org/micro-frontend-x",
  "version": "1.0.0",
  "scripts": {
    "dev": "lean dev --config react",
    "build": "lean build --config react",
    "predeploy": "yarn build",
    "deploy": "lean deploy --use @leanjs/aws"
  },
  "devDependencies": {
    "@leanjs/cli": "*"
  }
}
```

### Centralized Dev Server

There are two development servers involved when you run a LeanJS micro-frontend.

1. A dev server that watches your micro-frontend code, builds it, and serves it at a given local address (e.g. http://localhost:55556), e.g. Webpack Dev Server.
2. A centralized dev server that all micro-frontends connect to to send some information. This centralized dev server runs at the address defined in your `lean.config.js`, `devServer` field:

```js
// lean.config.js

module.exports = {
  devServer: { port: 55555 }, // 👈 centralized dev server
};
```

The LeanJS Cli `dev` command starts the centralised dev server automatically when you run the first `lean dev`. You can navigate to `http://localhost:{LEAN_CONFIG_JS_DEV_SERVER_PORT}` (e.g. localhost:55555) and see what micro-frontends you are running locally. If you have not run `lean dev` the centralised server won't be running.
