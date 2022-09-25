# @leanjs/react-router

## Installation

If you use a monorepo (recommended), at the root of your repository:

```
my-monorepo/
├─ micro-apps/
│  ├─ react-router-micro-app-example/
│  │  ├─ package.json
├─ package.json  👈
```

execute the following command:

```sh
yarn add @leanjs/react-router @leanjs/core @leanjs/react react-router-dom@6 react-dom@17 react@17
```

Then in the `package.json` of your micro-app app

```
my-monorepo/
├─ micro-apps/
│  ├─ react-router-micro-app-example/
│  │  ├─ package.json 👈
├─ package.json
```

add the following `peerDependencies`:

```
"peerDependencies": {
  "@leanjs/react-router": "*",
  "@leanjs/react": "*",
  "react-router-dom": "*",
  "react-dom": "*",
  "react": "*"
}
```

and also the following `devDependencies`:

```
  "devDependencies": {
    "@leanjs/cli": "*"
  }
```

## Usage

Create a file called `index.ts` in the `src` directory where your micro-app is.

```
my-monorepo/
├─ micro-apps/
│  ├─ react-router-micro-app-example/
│  │  ├─ package.json
│  │  ├─ src/
│  │  │  ├─ ReactApp.tsx
│  │  │  ├─ index.ts 👈
├─ package.json
```

> **Note**
> Read the recommended setup in our [getting started page](../../docs/getting-started.md#recommended-setup) if you want to create a similar monorepo structure

Call `createApp` with the root component of your App and your `createRuntime` function and:

```ts
import { createApp } from "@leanjs/react-router";
// shared runtime example package created by your org
import { createRuntime } from "@my-org/runtime-shared";

import packageJson from "../package.json";
import { ReactApp } from "./ReactApp";

// 👇  you must `export default createApp(`
export default createApp(ReactApp, {
  createRuntime,
  packageName: packageJson.name,
});
```

> **Note**
> Read [@leanjs/core](/packages/core#runtime) if you have not already created your own `createRuntime` function

Create `ReactApp.tsx` component, for example:

```tsx
import React from "react";

export const ReactApp = () => <div>Hello React micro-app</div>;
```
