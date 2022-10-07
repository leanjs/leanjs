# @leanjs/next

## Installation

If your Nextjs app is in a monorepo (recommended) execute the following command at the root of your repository:

```sh
yarn add -W @leanjs/next @leanjs/react @leanjs/core
```

then in the `package.json` of your Nextjs app add the following `peerDependencies`:

```
"dependencies": {
  "@leanjs/core": "*",
  "@leanjs/next": "*",
  "@leanjs/react": "*"
}
```

If your Nextjs app is not in a monorepo, then run the following command instead of the above:

```sh
yarn add @leanjs/next @leanjs/react @leanjs/core
```

## Basic usage

### `HostProvider`

You have to add a `HostProvider` at the root of your component tree in `pages/_app.tsx`. **Heads up!** `HostProvider` is not exported from `@leanjs/next`. Learn more about the `HostProvider` [here](/packages/react/#basic-usage).

Example:

```tsx
import type { AppProps } from "next/app";
import React from "react";
// react runtime example package created within your org
import { HostProvider } from "@my-org/react-runtime";
// shared runtime example package created within your org
import { createRuntime } from "@my-org/shared-runtime";

const runtime = createRuntime();

// e.g. http://localhost:${LEAN_CONFIG_DEV_SERVER_PORT}
const origin = process.env.REMOTE_ORIGIN;

const App = ({ Component, pageProps }: AppProps) => (
  <HostProvider origin={origin} runtime={runtime}>
    <Component {...pageProps} />
  </HostProvider>
);

export default App;
```

## Components

### `Host`

It hosts a micro-app in a Next host.

#### `app` - required prop

The `app` prop can be a `ComposableApp` object, or a function that returns a promise that resolves to a `ComposableApp` object.

```tsx
interface ComposableApp {
  // packageName is the `name` field in the `package.json` of a micro-app
  packageName: string;
  // mount function returned by a `createApp` function
  mount?: MountFunc;
}
```

You can `import` a `ComposableApp` from any `export default createApp()` function, for instance:

```tsx
// @my-org/my-micro-app-1 src/index.ts (package main file)

import { createApp } from "@leanjs/react";
import MyApp from "./MyApp";

// createApp returns a ComposableApp
export default createApp(MyApp, {
  packageName: "@my-org/my-micro-app-1",
});
```

:::info

In this example, the composable app is a React app. However, the Nextjs `<Host>` component can host any composable app, e.g. Vue.

:::

then pass it to the `Host` component in a Next.js app:

```tsx
// @my-org/my-nextjs-app pages/index.tsx

import type { NextPage } from "next";
import { Host } from "@leanjs/next";

// this micro-app is bundled and deployed along with the Nextjs app
import { MyMicroAppExample } from "@my-org/my-micro-app-1";

const Home: NextPage = () => {
  return (
    <>
      <h1>Nextjs Host</h1>
      <Host app={MyMicroAppExample} />
    </>
  );
};

export default Home;
```

You can also pass a function to the `Host` component that returns a dynamic import to lazy load a micro-app:

```tsx
// @my-org/my-nextjs-app pages/index.tsx

import type { NextPage } from "next";
import { Host } from "@leanjs/next";

const Home: NextPage = () => {
  return (
    <>
      <h1>Nextjs Host</h1>
      <Host
        app={() => {
          // this micro-app is bundled in a separate chunk
          // but it's still built and deployed along with the Nextjs app

          return import("@my-org/my-micro-app-1");
        }}
      />
    </>
  );
};

export default Home;
```

Alternatively, you can pass an object to the `app` prop with a `packageName` key which value is the field `name` in the package.json of the micro-app that you want to host. In this case, the `Host` component will try to fetch the `mount` function from the remote `origin` specified in `<HostProvider origin=" 👉 HERE 👈 " runtime={runtime}>` (see [HostProvider](#hostprovider) to know more). For example:

```tsx
// @my-org/my-nextjs-app pages/index.tsx

import type { NextPage } from "next";
import { Host } from "@leanjs/next";

const Home: NextPage = () => {
  return (
    <>
      <h1>Nextjs Host</h1>
      {/* in this case, the micro-app is neither built nor deployed
          along with the Next.js host */}
      <Host app={{ packageName: "@my-org/my-micro-app-1" }} />
    </>
  );
};

export default Home;
```

:::caution
Fetching from a remote `origin` only works with Webpack v5 because this feature uses Module Federation under the hood. You need to add a [HostWebpackPlugin](/packages/webpack/#hostwebpackplugin) to your `next.config.js` to enable this feature. If this feature is enabled you need to build and deploy your micro-apps independently. See [@leanjs/aws](/packages/aws/) to deploy your micro-apps to AWS.
:::

:::tip
You can still pass an `import` (either dynamic or static) to the `app` prop of the `Host` component and configure Webpack to fetch it from a remote origin by changing the configuration of your `HostWebpackPlugin`.
:::

Tip example:

```tsx
// next.config.js
const { HostWebpackPlugin } = require("@leanjs/webpack");

module.exports = {
  webpack: (config) => {
    config.plugins.push(
      new HostWebpackPlugin({
        remotes: {
          // these packages are not built along with the Nextjs app
          // but downloaded from a remote origin
          packages: ["@my-org/my-micro-app-1"],
        },
      })
    );

    return config;
  },
};
```

then in your Next.js app:

```tsx
// @my-org/my-nextjs-app pages/index.tsx

import type { NextPage } from "next";
import { Host } from "@leanjs/next";

// this micro-app is neither bundled nor deployed along with the Nextjs app
// because of the above remote: { packages: ["@my-org/my-micro-app-1"] }
// in the next.config.js HostWebpackPlugin
import { MyMicroAppExample } from "@my-org/my-micro-app-1";

const Home: NextPage = () => {
  return (
    <>
      <h1>Nextjs Host</h1>
      <Host app={MyMicroAppExample} />
    </>
  );
};

export default Home;
```

**Pro-tip**
Configure your `remotes` in `HostWebpackPlugin` on development only. This way no CI/CD changes are required. It also reduces build time of your monolith in development since these packages are excluded from the monolith build. Last but not least, you can experiment with micro-frontends in development without changing how you implement and host your apps.

Pro-tip example:

```tsx
// next.config.js
const { HostWebpackPlugin } = require("@leanjs/webpack");

module.exports = {
  webpack: (config) => {
    config.plugins.push(
      new HostWebpackPlugin({
        remotes: {
          // the following packages are built and deployed along with
          // the Nextjs app on production, but not during development.
          packages:
            process.env.NODE_ENV === "production"
              ? []
              : ["@my-org/my-micro-app-1"],
        },
      })
    );

    return config;
  },
};
```
