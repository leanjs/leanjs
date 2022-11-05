# @leanjs/next

## Installation

If your Nextjs app is in a monorepo (recommended) execute the following command at the root of your repository:

```sh
yarn add -W @leanjs/next @leanjs/react @leanjs/core
```

then in the `package.json` of your Nextjs app add the following `peerDependencies`:

```
"peerDependencies": {
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

You have to add a `HostProvider` at the root of your component tree in `pages/_app.tsx`. **Heads up!** `HostProvider` is not exported from `@leanjs/next`. Learn more about the [`HostProvider`](/packages/react/#hostprovider).

Example:

```tsx
import type { AppProps } from "next/app";
import React from "react";
// react runtime package created within your org
import { HostProvider, createRuntime } from "@my-org/react-runtime";

const runtime = createRuntime();

const App = ({ Component, pageProps }: AppProps) => (
  <HostProvider runtime={runtime}>
    <Component {...pageProps} />
  </HostProvider>
);

export default App;
```

:::info

Read [@leanjs/core](/packages/core#basic-usage) if you have not already created your own `createRuntime` function

:::

## Components

The examples in this section are based on the following project structure:

```
my-monorepo/
├─ apps/
│  ├─ nextjs-host/
│  │  ├─ next.config.js
├─ composable-apps/
│  ├─ react-app-1/
│  │  ├─ package.json
│  │  ├─ src/
│  │  │  ├─ ReactApp1.tsx
│  │  │  ├─ index.ts
├─ package.json
```

### `Host`

It hosts a composable app in a Next host.

#### `app` - required prop

The `app` prop expects a `GetComposableApp` type. You can `import` a `GetComposableApp` from any `export default createApp()` function, for instance:

```tsx
// my-monorepo/composable-apps/react-app-1/src/index.ts

import { createApp } from "@leanjs/react";

import { ReactApp1 } from "./ReactApp1";

export default createApp(ReactApp1);
```

:::info

In this example the composable app is a React app. However, the Nextjs `<Host>` component can host any composable app, e.g. Vue.

:::

then pass it to the `Host` component in a Next.js app:

```tsx
// my-monorepo/apps/nextjs-host/pages/index.tsx

import { Host } from "@leanjs/next";

// this composable app is bundled and deployed along with the Nextjs app
import ReactApp1 from "@my-org/react-app-1";

const Home = () => (
  <>
    <h1>Nextjs Host</h1>
    <Host app={ReactApp1} />
  </>
);

export default Home;
```

You can also pass a function to the `Host` component that returns a dynamic import to lazy load a composable app:

```tsx
// my-monorepo/apps/nextjs-host/pages/index.tsx

import React, { Suspense } from "react";
import { Host, ErrorBoundary } from "@leanjs/next";

const Home = () => (
  <>
    <h1>Nextjs Host</h1>
    {/* The network can fail.
     Add an ErrorBoundary if you are hosting an app using a dynamic import */}
    <ErrorBoundary>
      <Suspense fallback={<p>Loading...</p>}>
        <Host
          app={() => {
            // this composable app is bundled in a separate chunk
            // but it's still built and deployed along with the Nextjs app
            return import("@my-org/react-app-1");
          }}
        />
      </Suspense>
    </ErrorBoundary>
  </>
);

export default Home;
```

Alternatively, you can pass an object to the `app` prop with a `packageName` key which value is the field `name` in the package.json of the composable app that you want to host. In this case, the `Host` component will try to fetch the `mount` function from the remote `origin` specified in `<HostProvider origin=" 👉 HERE 👈 " runtime={runtime}>` (see [origin prop](/packages/react/#origin-prop---optional) to know more). For example:

```tsx
// my-monorepo/apps/nextjs-host/pages/index.tsx

import React, { Suspense } from "react";
import { Host, ErrorBoundary } from "@leanjs/next";

const Home = () => (
  <>
    <h1>Nextjs Host</h1>
    {/* The network can fail.
     Add an ErrorBoundary if you are hosting a remote app */}
    <ErrorBoundary>
      <Suspense fallback={<p>Loading...</p>}>
        {/* in this case, the composable app is neither built nor deployed
          along with the Next.js host */}
        <Host app={{ packageName: "@my-org/react-app-1" }} />
      </Suspense>
    </ErrorBoundary>
  </>
);

export default Home;
```

:::caution
Fetching from a remote `origin` only works with Webpack v5 because this feature uses Module Federation under the hood. You need to add a [HostWebpackPlugin](/packages/webpack/#hostwebpackplugin) to your `next.config.js` to enable this feature. If this feature is enabled you need to build and deploy your composable apps independently. See [@leanjs/aws](/packages/aws/) to deploy your composable apps to AWS.
:::

<!--
:::tip
You can still pass an `import` (either dynamic or static) to the `app` prop of the `Host` component and configure Webpack to fetch it from a remote origin by changing the configuration of your `HostWebpackPlugin`.
:::

Tip example:

```tsx
// my-monorepo/apps/nextjs-host/next.config.js
const { HostWebpackPlugin } = require("@leanjs/webpack");

module.exports = {
  webpack: (config) => {
    config.plugins.push(
      new HostWebpackPlugin({
        remotes: {
          // these packages are not built along with the Nextjs app
          // but downloaded from a remote origin
          packages: ["@my-org/react-app-1"],
        },
      })
    );

    return config;
  },
};
```

then in your Next.js app:

```tsx
// my-monorepo/apps/nextjs-host/pages/index.tsx

import { Host } from "@leanjs/next";

// this composable app is neither bundled nor deployed along with the Nextjs app
// because of the above remote: { packages: ["@my-org/react-app-1"] }
// in the next.config.js HostWebpackPlugin
import ReactApp1 from "@my-org/react-app-1";

const Home = () => (
  <>
    <h1>Nextjs Host</h1>
    <Host app={ReactApp1} />
  </>
);

export default Home;
```

 **Pro-tip**
Configure your `remotes` in `HostWebpackPlugin` on development only. This way no CI/CD changes are required. It also reduces the build time of your monolith in development since these packages are excluded from the monolith build. Last but not least, you can experiment with micro-frontends in development without changing how you implement and host your apps.

Pro-tip example:

```tsx
// my-monorepo/apps/nextjs-host/next.config.js
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
              : ["@my-org/react-app-1"],
        },
      })
    );

    return config;
  },
};
``` -->

#### `className` - optional prop

CSS class added to the root DOM element where the [`app` prop](#app---required-prop) is mounted.

```tsx
// my-monorepo/apps/react-host/src/index.ts

import React from "react";
import { Host } from "@leanjs/next";
import ReactApp1 from "@my-org/react-app-1";

const Home = () => (
  <>
    <h1>Next Host</h1>
    <Host className="some-css-class" app={ReactApp1} />
  </>
);

export default Home;
```
