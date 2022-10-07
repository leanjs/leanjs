# @leanjs/react

## Installation

If your React app is in a monorepo (recommended) execute the following command at the root of your repository:

```sh
yarn add -W @leanjs/react @leanjs/core
```

then in the `package.json` of your React app add the following `peerDependencies`:

```
"peerDependencies": {
  "@leanjs/core": "*",
  "@leanjs/react": "*"
}
```

If your React app is not in a monorepo, then run the following command instead of the above:

```sh
yarn add @leanjs/react @leanjs/core
```

## Basic usage

### `createRuntimeBindings`

First, you have to create your React bindings (**HostProvider**, **useGetter**, etc) for your `runtime`.

```ts
// shared-runtime.ts

// You need to configure your runtime
const defaultState = { locale: "en" }; // this is just an example
export const { createRuntime } = configureRuntime(defaultState)({
  onError: () => {},
});

// Then create the React bindings for your runtime
export const {
  HostProvider,
  useGetter,
  useSetter,
  useLoading,
  useError,
  useRuntime,
} = createRuntimeBindings(createRuntime);
```

Add your `HostProvider` at the root of your React component tree, e.g.

```tsx
// It's recommended to move your ./shared-runtime file to its own package
import { createRuntime, HostProvider } from "./shared-runtime";

const runtime = createRuntime();

export function App({ children }) {
  return <HostProvider runtime={runtime}>{children}</HostProvider>;
}
```

Use any of your hooks in your components, e.g.

```tsx
// It's recommended to move your ./shared-runtime file to its own package
import { useGetter } from "./shared-runtime";

export function LocaleComponent() {
  const locale = useGetter("locale");

  return <p>Current locale is {locale}</p>;
}
```

## App

Create small React apps that can be composed with other apps.

### `createApp`

Create a file called `index.ts|js` in the `src` directory where your composable app is. For example:

```
my-monorepo/
├─ apps/
│  ├─ react-host/
├─ composable-apps/
│  ├─ react-app-1/
│  │  ├─ package.json
│  │  ├─ src/
│  │  │  ├─ ReactApp1.tsx
│  │  │  ├─ index.ts 👈
├─ package.json
```

:::tip

Read the recommended setup in our [getting started page](../../docs/getting-started#recommended-setup) if you want to create a similar monorepo structure

:::

Call `createApp` with the root component of your app and pass the package name of the app, for example:

```ts
// my-monorepo/composable-apps/react-app-1/src/index.ts

import { createApp } from "@leanjs/react";

import packageJson from "../package.json";
import { ReactApp1 } from "./ReactApp1";

//       👇  you have to `export default`
export default createApp(ReactApp1, {
  packageName: packageJson.name,
});
```

Hello world example of the `ReactApp1` imported above

```tsx
// my-monorepo/composable-apps/react-app-1/src/ReactApp1.tsx

import React from "react";

export const ReactApp1 = () => <h1>Hello React composable app 1</h1>;
```

Create a file called `selfHosted.ts|js` in the `src` directory where your composable app is, for example:

```
my-monorepo/
├─ apps/
│  ├─ react-host/
├─ composable-apps/
│  ├─ react-app-1/
│  │  ├─ package.json
│  │  ├─ src/
│  │  │  ├─ ReactApp1.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ selfHosted.ts 👈
├─ package.json
```

Export a `createRuntime` function from the `selfHosted.ts|js` file. This is the runtime that will be used when the app runs in isolation, meaning without a host.

```ts
// my-monorepo/composable-apps/react-app-1/src/selfHosted.ts

export { createRuntime } from "@my-org/runtime-react";
```

:::info

Read [@leanjs/core](/packages/core#runtime) if you have not already created your own `createRuntime` function

:::

## Components

### `HostProvider`

You have to **call [createRuntimeBindings](#createruntimebindings) to create a `HostProvider` component** before you use it. `HostProvider` stores in the React context values that are shared across apps hosted in the same component tree. Props:

#### `runtime` prop - required

Your Lean [runtime](/packages/core/).

#### `origin` prop - optional

[Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin) where your remote composable apps are. During development, use the address where you run your Lean [proxy dev server](/packages/cli#proxy-dev-server). Use the address of your CDN in production, e.g. `https://cdn.example.com`.

#### `errorComponent` prop - optional

React component displayed when a `<Host>` component errors and the error is not handled. It can be overridden by the `<Host>` component.

```ts
type ErrorComponent = (props: { error: Error }) => ReactElement;
```

#### `fallback` prop - optional

React element displayed when a `<Host>` component is fetching a remote app. It can be overriden by the `<Host>` component.

```ts
type Fallback = ReactElement;
```

Example:

```tsx
// where does shared-runtime come from? Read the "Usage" section at the top
import { createRuntime, HostProvider } from "./shared-runtime";

const runtime = createRuntime();
const origin = process.env.LEAN_ORIGIN; // e.g. http://localhost:55555

export function App({ children }) {
  return (
    <HostProvider origin={LEAN_ORIGIN} runtime={runtime}>
      {children}
    </HostProvider>
  );
}
```

### `Host`

It hosts a composable app in a React host.

#### `app` - required prop

The `app` prop can be a `ComposableApp` object, or a function that returns a promise that resolves to a `ComposableApp` object.

```tsx
interface ComposableApp {
  // packageName is the `name` field in the `package.json` of a composable app
  packageName: string;
  // mount function returned by a `createApp` function
  mount?: MountFunc;
}
```

You can `import` a `ComposableApp` from any `export default createApp()` function, for instance:

```tsx
// my-monorepo/composable-apps/react-app-1/src/index.tsx

import { createApp } from "@leanjs/react";
import ReactApp1 from "./ReactApp1";

// createApp returns a ComposableApp
export default createApp(MyApp, {
  packageName: "@my-org/react-app-1",
});
```

then pass it to the `Host` component in a React app:

```tsx
// my-monorepo/apps/react-host/src/index.ts

import { Host } from "@leanjs/react";

// this composable app is bundled and deployed along with the host app
import { MyReactApp1 } from "@my-org/react-app-1";

const Home = () => {
  return (
    <>
      <h1>React Host</h1>
      <Host app={MyReactApp1} />
    </>
  );
};

export default Home;
```

:::info

In this example, both the host app and the composable app are React apps. However, the React `<Host>` component can host any composable app, e.g. Vue.

:::

You can also pass a function to the `Host` component that returns a dynamic import to lazy load a composable app:

```tsx
// my-monorepo/apps/react-host/src/index.ts

import { Host } from "@leanjs/react";

const Home = () => {
  return (
    <>
      <h1>React Host</h1>
      <Host
        app={() => {
          // this composable app is bundled in a separate chunk
          // but it's still built and deployed along with the host app

          return import("@my-org/react-app-1");
        }}
      />
    </>
  );
};

export default Home;
```

Alternatively, you can pass an object to the `app` prop with a `packageName` key which value is the field `name` in the package.json of the composable app that you want to host. In this case, the `Host` component will try to fetch the `mount` function from the remote `origin` specified in `<HostProvider origin=" 👉 HERE 👈 " runtime={runtime}>` (see [HostProvider](#hostprovider) to know more). For example:

```tsx
// my-monorepo/apps/react-host/src/index.ts

import { Host } from "@leanjs/react";

const Home = () => {
  return (
    <>
      <h1>React Host</h1>
      {/* in this case, the composable app is neither built nor deployed
          along with the React host */}
      <Host app={{ packageName: "@my-org/react-app-1" }} />
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
        packages: ["@my-org/react-app-1"],
      },
    }),
  ],
};
```

then in your React app:

```tsx
// my-monorepo/apps/react-host/src/index.ts

import { Host } from "@leanjs/react";

// this composable app is neither bundled nor deployed along with the host app
// because of the above remote: { packages: ["@my-org/react-app-1"] }
// in the webpack.config.js HostWebpackPlugin
import { MyReactApp1 } from "@my-org/react-app-1";

const Home = () => {
  return (
    <>
      <h1>React Host</h1>
      <Host app={MyReactApp1} />
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
        // the React app on production, but not during development.
        packages:
          process.env.NODE_ENV === "production" ? [] : ["@my-org/react-app-1"],
      },
    }),
  ],
};
```

## Hooks

### `useGetter`

Hook to get the current state of a given state property. You have to **call [createRuntimeBindings](#createruntimebindings) to create a `useGetter` hook** before you use it.

Arguments:

1. State property, required.
2. Loader function, optional.

The output is the current state of the given property.

Example:

```tsx
// where does shared-runtime come from? Read the "Usage" section at the top
import { useGetter } from "./shared-runtime";

export function LocaleComponent() {
  const locale = useGetter("locale", () =>
    fetch("/api/settings")
      .then((response) => response.json())
      .then((data) => data.locale)
  );

  return <p>Locale is {locale}</p>;
}
```

### `useSetter`

Hook to update the value of a given state property. You have to **call [createRuntimeBindings](#createruntimebindings) to create a `useSetter` hook** before you use it.

Arguments:

1. State property, required.

The output is a function to update the value of the given state property.

Example:

```jsx
// where does shared-runtime come from? Read the "Usage" section at the top
import { useSetter } from "./shared-runtime";

export function ThemeSelector() {
  const shareTheme = useSetter("theme");

  return (
    <>
      <label for="theme-select">Choose a theme:</label>
      <select
        onChange={(e) => shareTheme(e.target.value)}
        name="theme"
        id="theme-select"
      >
        <option value="">--Please choose an option--</option>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
    </>
  );
}
```

### `useLoading`

Hook to get the loading state of a given state property. You have to **call [createRuntimeBindings](#createruntimebindings) to create a `useLoading` hook** before you use it.

Arguments:

1. State property, required.

The output is a boolean indicating if the given state property is loading.

Example:

```tsx
// where does shared-runtime come from? Read the "Usage" section at the top
import { useLoading } from "./shared-runtime";

export function LocaleSpinner() {
  const loading = useLoading("locale");

  if (loading) {
    return <p>Loading...</p>;
  } else {
    return null;
  }
}
```

### `useError`

Hook to get the error state if a given state property failed to load. You have to **call [createRuntimeBindings](#createruntimebindings) to create a `useError` hook** before you use it.

Arguments:

1. State property, required.

The output is undefined or a string with the error message.

Example:

```tsx
// where does shared-runtime come from? Read the "Usage" section at the top
import { useError } from "./shared-runtime";

export function LocaleErrorMessage() {
  const error = useError("locale");

  if (error) {
    return <p>Oops, locale error: {error} </p>;
  } else {
    return null;
  }
}
```

### `useRuntime`

It returns the shared `runtime` from the context. You have to **call [createRuntimeBindings](#createruntimebindings) to create a `useRuntime` hook** before you use it.

Example:

```jsx
// where does shared-runtime come from? Read the "Usage" section at the top
import { useRuntime } from "./shared-runtime";

// HostProvider must be an ancestor of the following component
export function Component() {
  const runtime = useRuntime(); // do something with runtime

  return <h1>My component</h1>;
}
```
