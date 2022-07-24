# @leanjs/next

This package provides a React `Host` component to

## Installation

If you use a monorepo (recommended) execute the following command at the root of your repository:

```sh
yarn add @leanjs/next @leanjs/react
```

Then in the `package.json` of your Nextjs app add the following `dependencies`:

```
"dependencies": {
  "@leanjs/next": "*",
  "@leanjs/react": "*"
}
```

## Usage

### HostProvider

You must add a `HostProvider` at the root of your component tree in `pages/_app.tsx`.

**Heads up!** `HostProvider` can't be imported from @leanjs/next. Learn more about the `HostProvider` [here](/packages/react#usage).

Next example:

```tsx
import type { AppProps } from "next/app";
import React from "react";
// react runtime example package created by your org
import { HostProvider } from "@my-org/react-runtime";
// shared runtime example package created by your org
import { createRuntime } from "@my-org/shared-runtime";

const runtime = createRuntime();
const origin = process.env.LEAN_ORIGIN; // e.g. http://localhost:${LEAN_CONFIG_DEV_SERVER_PORT}

const App = ({ Component, pageProps }: AppProps) => (
  <HostProvider origin={origin} runtime={runtime}>
    <Component {...pageProps} />
  </HostProvider>
);

export default App;
```

### Host

It hosts a micro-frontend and calls its life cycle functions.

Props:

- `remote`, required. It's an object with a requried key `packageName: string`. The `packageName` is the `name` field in the `package.json` of a micro-frontend.

Example:

```tsx
import type { NextPage } from "next";
import { Host } from "@leanjs/next";

const Home: NextPage = () => {
  return (
    <>
      <h1>Nextjs Host</h1>
      <Host remote={{ packageName: "@my-org/micro-frontend-1" }} />
    </>
  );
};

export default Home;
```
