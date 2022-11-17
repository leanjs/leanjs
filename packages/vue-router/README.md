# @leanjs/vue-router

## Installation

If your Vue Router app is in a monorepo (recommended) execute the following command at the root of your repository:

```sh
yarn add -W @leanjs/vue-router @leanjs/core vue-router@4 vue@3
```

then in the `package.json` of your Vue Router app add the following `peerDependencies`:

```
"peerDependencies": {
  "@leanjs/core": "*",
  "@leanjs/vue-router": "*",
  "vue-router": "*",
  "vue": "*"
}
```

If your Vue Router app is not in a monorepo, then run the following command instead of the above:

```sh
yarn add @leanjs/vue-router @leanjs/core vue-router@4 vue@3
```

## Composable app

Create small Vue Router apps that can be composed with other apps.

### `createApp`

Arguments:

- `App: Component` - required
- `options: { appName: string }` - required. You have to specify the name of your composable app.

Create a file called `index.ts|js` in the `src` directory where your composable app is.

```
my-monorepo/
├─ apps/
├─ composable-apps/
│  ├─ vue-router-app-1/
│  │  ├─ package.json
│  │  ├─ src/
│  │  │  ├─ VueRouterApp1.vue
│  │  │  ├─ index.ts 👈
├─ package.json
```

:::info

Read the recommended setup in our [getting started page](../../docs/getting-started#recommended-setup) if you want to create a similar monorepo structure

:::

Call `createApp` with the root component of your Vue Router app:

```ts
import { createApp } from "@leanjs/vue-router";

import VueRouterApp1 from "./VueRouterApp1.vue";

// 👇  you have to `export default createApp(`
export default createApp(VueApp, {
  appName: "VueRouterApp1",
});
```

Hello world example of the `VueRouterApp1` imported above

```vue
<!-- my-monorepo/composable-apps/vue-router-app-1/src/VueRouterApp1.tsx -->

<template>
  <h1>Hello composable Vue Router app</h1>
</template>
```

Create a file called `selfHosted.ts|js` in the `src` directory where your composable app is, for example:

```
my-monorepo/
├─ apps/
├─ composable-apps/
│  ├─ vue-router-app-1/
│  │  ├─ package.json
│  │  ├─ src/
│  │  │  ├─ VueRouterApp1.vue
│  │  │  ├─ index.ts
│  │  │  ├─ selfHosted.ts 👈
├─ package.json
```

Export a `createRuntime` function from the `selfHosted.ts|js` file. This is the runtime that will be used when the app runs in isolation, meaning without a host.

```ts
// my-monorepo/composable-apps/vue-router-app-1/src/selfHosted.ts

export { createRuntime } from "@my-org/runtime-react";
```

:::info

Read [@leanjs/core](../core/README.md#basic-usage) if you have not already created your own `createRuntime` function

:::
