# @leanjs/react-router

## Installation

If your React Router app is in a monorepo (recommended) execute the following command at the root of your repository:

```sh
yarn add -W react-router-dom@6 react-dom@17 react@17 \
  @leanjs/react-router @leanjs/core @leanjs/react
```

then in the `package.json` of your React Router app add the following `peerDependencies`:

```
"peerDependencies": {
  "@leanjs/core": "*",
  "@leanjs/react-router": "*",
  "@leanjs/react": "*",
  "react-router-dom": "*",
  "react-dom": "*",
  "react": "*"
}
```

If your React Router app is not in a monorepo, then run the following command instead of the above:

```sh
yarn add react-router-dom@6 react-dom@17 react@17 \
  @leanjs/react-router @leanjs/core @leanjs/react
```

## Basic usage

### `HostProvider`

You have to add a `HostProvider` at the root of your component tree if you want to host composable apps. **Heads up!** `HostProvider` is not exported from `@leanjs/react-router`. Learn more about the [`HostProvider`](/packages/react/#hostprovider).

Example:

```tsx
import React from "react";
// react runtime package created within your org
import { HostProvider } from "@my-org/react-runtime";
// shared runtime package created within your org
import { createRuntime } from "@my-org/shared-runtime";
import HostApp from "./HostApp.tsx";

const runtime = createRuntime();

const Root = () => (
  <HostProvider runtime={runtime}>
    <HostApp />
  </HostProvider>
);

export default Root;
```

:::info

Read [@leanjs/core](/packages/core#basic-usage) if you have not already created your own `createRuntime` function

:::

## Composable app

Create small React Router apps that can be composed with other apps.

### `createApp`

Arguments:

- `App: ReactElement` - required
- `options: { appName?: string }` - optional. By default, the name of your composable app is the name of your `App` component. You can change it using the optional argument `appName`.

Create a file called `index.ts|js` in the `src` directory where your composable app is. For example:

```
my-monorepo/
├─ apps/
│  ├─ react-router-host/
├─ composable-apps/
│  ├─ react-router-app-1/
│  │  ├─ package.json
│  │  ├─ src/
│  │  │  ├─ ReactRouterApp1.tsx
│  │  │  ├─ index.ts 👈
├─ package.json
```

:::tip

<!-- Read the recommended setup in our [getting started page](../../docs/getting-started#recommended-setup) if you want to create a similar monorepo structure -->

Read the recommended setup in our [getting started page](/getting-started#recommended-setup) if you want to create a similar monorepo structure

:::

Call `createApp` with the root component of your app, for example:

```ts
// my-monorepo/composable-apps/react-router-app-1/src/index.ts

import { createApp } from "@leanjs/react-router";

import { ReactRouterApp1 } from "./ReactRouterApp1";

// 👇 you have to `export default`
export default createApp(ReactRouterApp1);

// The name of the composable app is the name of your component,
// "ReactRouterApp1 in this case.
// you can pass a different name using the second argument, e.g.
// export default createApp(ReactRouterApp1, { appName: "SomeName" });
```

Hello world example of the `ReactRouterApp1` imported above

```tsx
// my-monorepo/composable-apps/react-router-app-1/src/ReactRouterApp1.tsx

import React from "react";

export const ReactRouterApp1 = () => <h1>Hello React Router app</h1>;
```

Create a file called `selfHosted.ts|js` in the `src` directory where your composable app is, for example:

```
my-monorepo/
├─ apps/
│  ├─ react-router-host/
├─ composable-apps/
│  ├─ react-router-app-1/
│  │  ├─ package.json
│  │  ├─ src/
│  │  │  ├─ ReactRouterApp1.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ selfHosted.ts 👈
├─ package.json
```

Export a `createRuntime` function from the `selfHosted.ts|js` file. This is the runtime that will be used when the app runs in isolation, meaning without a host.

```ts
// my-monorepo/composable-apps/react-router-app-1/src/selfHosted.ts

export { createRuntime } from "@my-org/runtime-react";
```

:::info

Read [@leanjs/core](/packages/core#basic-usage) if you have not already created your own `createRuntime` function

:::

## Components

### `Host`

It hosts a composable app in a React Router host.

#### `app` - required prop

The `app` prop expects a `GetComposableApp` type. You can `import` a `GetComposableApp` from any `export default createApp()` function, for instance:

```tsx
// my-monorepo/composable -apps/react-router-app-1/src/ReactRouterApp1.tsx

import { createApp } from "@leanjs/react-router";

import { ReactRouterApp1 } from "./ReactRouterApp1";

export default createApp(ReactRouterApp1);
```

:::info

In this example, both the host app and the composable app are React Router apps. However, the React Router `<Host>` component can host any composable app, e.g. Vue.

:::

then pass it to the `Host` component in a React Router app:

```tsx
// my-monorepo/apps/react-router-host/src/pages/index.tsx

import { Host } from "@leanjs/react-router";

// this composable app is bundled and deployed along with the host app
import ReactRouterApp1 from "@my-org/react-router-app-1";

const Home = () => {
  return (
    <>
      <h1>React Router Host</h1>
      <Host app={ReactRouterApp1} />
    </>
  );
};

export default Home;
```

You can also pass a function to the `Host` component that returns a dynamic import to lazy load a composable app:

```tsx
// my-monorepo/apps/react-router-host/src/pages/index.tsx

import { Host } from "@leanjs/react-router";

const Home = () => {
  return (
    <>
      <h1>React Router Host</h1>
      <Host
        app={() => {
          // this composable app is bundled in a separate chunk
          // but it's still built and deployed along with the host app
          return import("@my-org/react-router-app-1");
        }}
      />
    </>
  );
};

export default Home;
```

Alternatively, you can pass an object to the `app` prop with a `packageName` key which value is the field `name` in the package.json of the composable app that you want to host. In this case, the `Host` component will try to fetch the `mount` function from the remote `origin` specified in `<HostProvider origin=" 👉 HERE 👈 " runtime={runtime}>` (see [origin prop](/packages/react/#origin-prop---optional) to know more). For example:

```tsx
// my-monorepo/apps/react-router-host/src/pages/index.tsx

import { Host } from "@leanjs/react";

const Home = () => {
  return (
    <>
      <h1>React Host</h1>
      {/* in this case, the composable app is neither built nor deployed
          along with the React host */}
      <Host app={{ packageName: "@my-org/react-router-app-1" }} />
    </>
  );
};

export default Home;
```

:::caution
Fetching from a remote `origin` only works with Webpack v5 because this feature uses Module Federation under the hood. You need to add a [HostWebpackPlugin](/packages/webpack/#hostwebpackplugin) to your Webpack configuration to enable this feature. If this feature is enabled you need to build and deploy your composable apps independently. See [@leanjs/aws](/packages/aws/) to deploy your composable apps to AWS.
:::

:::tip
You can still pass an `import` (either dynamic or static) to the `app` prop of the `Host` component and configure Webpack to fetch it from a remote origin by changing the configuration of your `HostWebpackPlugin`.
:::

Tip example:

```tsx
// webpack.config.js of the host application
const { HostWebpackPlugin } = require("@leanjs/webpack");

module.exports = {
  // the rest of your configuration goes here
  plugins: [
    new HostWebpackPlugin({
      remotes: {
        // these packages are not built along with the host app
        // but downloaded from a remote origin
        packages: ["@my-org/react-router-app-1"],
      },
    }),
  ],
};
```

then in your React app:

```tsx
// @my-org/my-react-app pages/index.tsx

import { Host } from "@leanjs/react";

// this composable app is neither bundled nor deployed along with the host app
// because of the above remote: { packages: ["@my-org/react-router-app-1"] }
// in the webpack.config.js HostWebpackPlugin
import ReactRouterApp1 from "@my-org/react-router-app-1";

const Home = () => {
  return (
    <>
      <h1>React Host</h1>
      <Host app={ReactRouterApp1} />
    </>
  );
};

export default Home;
```

**Pro-tip**
Configure your `remotes` in `HostWebpackPlugin` on development only. This way no CI/CD changes are required. It also reduces build time of your monolith in development since these packages are excluded from the monolith build. Last but not least, you can experiment with micro-frontends in development without changing how you implement and host your apps.

Pro-tip example:

```tsx
// webpack.config.js of the host application
const { HostWebpackPlugin } = require("@leanjs/webpack");

module.exports = {
  // the rest of your configuration goes here
  plugins: [
    new HostWebpackPlugin({
      remotes: {
        // the following packages are built and deployed along with
        // the React Router app on production, but not during development.
        packages:
          process.env.NODE_ENV === "production"
            ? []
            : ["@my-org/react-router-app-1"],
      },
    }),
  ],
};
```

#### `errorComponent` prop - optional

React component displayed when a hosted `app` errors and the error is not handled by the `app`.

```ts
type ErrorComponent = null | (props: { error: Error }) => ReactElement;
```

If the `errorComponent` prop is not passed then the `Host` component will catch the error and display a default error component. The default behaviour is to always catch errors within the boundaries of the host.

If `null` is passed to the `errorComponent` prop then the `Host` component will throw any errors not handled by the hosted `app`. This is useful if you want to display a single error message for a group of elements in case of error, e.g.:

```tsx
<MyErrorBoundary>
  <Host app={exampleApp1} errorComponent={null} />
  <Host app={exampleApp2} errorComponent={null} />
  <h1>Don't show this if either of the above hosted apps fail</h1>
</MyErrorBoundary>
```

#### `fallback` prop - optional

React element displayed when a `<Host>` component is fetching a remote app.
