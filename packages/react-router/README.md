# @leanjs/react-router

## Installation

If you use a monorepo (recommended), at the root of your repository:

```
my-monorepo/
├─ micro-frontends/
│  ├─ react-router-micro-frontend-example/
│  │  ├─ package.json
├─ package.json  👈
```

execute the following command:

```sh
yarn add @leanjs/react-router @leanjs/react react-router-dom@6 react-dom@17 react@17
```

Then in the `package.json` of your micro-frontend app

```
my-monorepo/
├─ micro-frontends/
│  ├─ react-router-micro-frontend-example/
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

Create a file called `remote.ts` in the `src` directory where your micro-frontend is.

```
my-monorepo/
├─ micro-frontends/
│  ├─ react-router-micro-frontend-example/
│  │  ├─ package.json
│  │  ├─ src/
│  │  │  ├─ ReactApp.tsx
│  │  │  ├─ remote.ts 👈
├─ package.json
```

> **Note**
> Read the recommended setup in our [getting started page](../../docs/getting-started.md#recommended-setup) if you want to create a similar monorepo structure

Call `createRemote` with the root component of your App and your `createRuntime` function and:

```ts
import { createRemote } from "@leanjs/react-router";
// shared runtime example package created by your org
import { createRuntime } from "@my-org/runtime-shared";

import { ReactApp } from "./ReactApp";

// 👇  you must `export default createRemote(`
export default createRemote(ReactApp, { createRuntime });
```

> **Note**
> Read [@leanjs/core](/packages/core#runtime) if you have not already created your own `createRuntime` function

Create `ReactApp.tsx` component, for example:

```tsx
import React from "react";

export const ReactApp = () => <div>Hello React micro-frontend</div>;
```
