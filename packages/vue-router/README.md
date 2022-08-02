# @leanjs/vue-router

## Installation

If you use a monorepo (recommended), at the root of your repository:

```
my-monorepo/
├─ micro-frontends/
│  ├─ vue-router-micro-frontend-example/
│  │  ├─ package.json
├─ package.json  👈
```

execute the following command:

```sh
yarn add @leanjs/vue-router vue-router@4 vue@3
```

Then in the `package.json` of your micro-frontend app

```
my-monorepo/
├─ micro-frontends/
│  ├─ vue-router-micro-frontend-example/
│  │  ├─ package.json 👈
├─ package.json
```

add the following `peerDependencies`:

```
"dependencies": {
  "@leanjs/vue-router": "*",
  "vue-router": "*",
  "vue": "*"
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
│  ├─ vue-router-micro-frontend-example/
│  │  ├─ package.json
│  │  ├─ src/
│  │  │  ├─ VueApp.vue
│  │  │  ├─ remote.ts 👈
├─ package.json
```

> **Note**
> Read the recommended setup in our [getting started page](../../docs/getting-started.md#recommended-setup) if you want to create a similar monorepo structure

Call `createRemote` with the root component of your VueApp and your `createRuntime` function:

```ts
import { createRemote } from "@leanjs/vue-router";
// shared runtime example package created by your org
import { createRuntime } from "@my-org/runtime-shared";

import VueApp from "./VueApp.vue";

// 👇  you must `export default createRemote(`
export default createRemote(VueApp, { createRuntime });
```

> **Note**
> Read [@leanjs/core](/packages/core#runtime) if you have not already created your own `createRuntime` function

Create `VueApp.vue` component, for example:

```vue
<template>
  <h1>Hello Vue micro-frontend</h1>
</template>
```
