---
title: Getting started
---

# Getting started

## Quick start

To create a simple PoC for a quick start, visit [create micro-frontends](../packages/create-micro-frontends).

## Manual start

You will want to manually start a composable apps project when you have an existing monolith. This is the expected path.

## Recommended setup

### Turn your monolith into a monorepo

** [Skip this step](#add-the-lean-cli)** if your already have a monorepo.

- Create directory `apps/my-monolith` and move all your code there
- Keep also a copy of your `package.json` at the root

  ```
  my-monorepo/
  ├─ apps/
  │  ├─ my-monolith/
  │  │  ├─ package.json  👈 same
  ├─ package.json  👈 same
  ```

- Make all the `dependencies` in the package.json in `my-monorepo/apps/my-monolith` point to version `*`. We are enabling a single-version policy for the entire monorepo.
- Add the following field `workspaces: ["apps/*"]` in the root package.json:

  ```
  my-monorepo/
  ├─ apps/
  │  ├─ my-monolith/
  │  │  ├─ package.json
  ├─ package.json  👈 root
  ```

### Create a `packages` workspace

** [Skip this step](#add-the-lean-cli)** if your already have a monorepo.

Packages are used to share code between composable apps and/or the monolith.

- Add _"packages/\*"_ to the following field `workspaces: ["apps/*", "packages/*"]` in the root package.json.

  ```
  my-monorepo/
  ├─ apps/
  │  ├─ my-monolith/
  │  │  ├─ package.json
  ├─ package.json  👈 here
  ```

- Create a `packages` folder at the root of your monorepo, e.g.

  ```
  my-monorepo/
  ├─ apps/
  ├─ packages/ 👈 here
  ├─ package.json
  ```

- Create a package inside the `packages` folder. You must include a `package.json` in your package.

  ```
  my-monorepo/
  ├─ apps/
  ├─ packages/
  │  ├─ my-package/
  │  │  ├─ package.json  👈 here
  ├─ package.json
  ```

:::tip

Use the same scope in all the `package.json`s of your monorepo, e.g. **@my-org**:

- apps/my-monolith/package.json `{ "name": "@my-org/my-monolith" }`
- packages/new-package/package.json `{ "name": "@my-org/new-package" }`

:::

### Add the `lean` cli

Create a `lean.config.js` file at the root of your monorepo:

```
my-monorepo/
├─ apps/
├─ packages/
├─ lean.config.js  👈 here
├─ package.json
```

Add some config, for example:

```js
const { createReactWebpackConfig } = require("@leanjs/webpack-react");

module.exports = {
  devServer: { port: 43210 },
  webpack: {
    // replace the following config with your custom Webpack config
    react: createReactWebpackConfig(),
  },
};
```

Execute the following command at the root directory of your monorepo:

```sh
yarn add -W -D @leanjs/cli @leanjs/webpack
```

### Create a `composable-apps` workspace

- Add _"composable-apps/\*"_ to the following field `workspaces: ["apps/*", "packages/*", "composable-apps/*"]` in the root package.json.

  ```
  my-monorepo/
  ├─ apps/
  ├─ packages/
  │  ├─ my-monolith/
  │  │  ├─ package.json
  ├─ package.json  👈 here
  ```

- Create a `composable-apps` folder at the root of your monorepo, e.g.

  ```
  my-monorepo/
  ├─ apps/
  ├─ composable-apps/ 👈 here
  ├─ packages/
  ├─ package.json
  ```

- Create a composable app inside the `composable-apps` folder. You must include a `package.json` in your new composable app:

  ```
  my-monorepo/
  ├─ apps/
  ├─ composable-apps/
  │  ├─ my-app/
  │  │  ├─ package.json  👈 here
  ├─ packages/
  ├─ package.json
  ```

- Create a composable app based on your UI library:
  - [React Router](../packages/react-router/)
  - [Vue Router](../packages/vue-router/)
