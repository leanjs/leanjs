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

add the following `dependencies`:

```
"dependencies": {
  "@leanjs/react-router": "*",
  "@leanjs/react": "*",
  "react-router-dom": "*",
  "react-dom": "*",
  "react": "*"
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
│  │  │  ├─ App.tsx
│  │  │  ├─ remote.ts 👈
├─ package.json
```

Call `createRemote` with the root component of your App and your `createRuntime` function and:

```tsx
import { createRemote } from "@leanjs/react-router";
// shared runtime example package created by your org
import { createRuntime } from "@my-org/runtime-shared";

import { App } from "./App";

// 👇  you must `export default createRemote(`
export default createRemote(App, { createRuntime });
```

⚠️ How do I create my `createRuntime` function? Read [@leanjs/core](/packages/core#runtime).
