# @leanjs/vue

## Installation

If your Vue app is in a monorepo (recommended) execute the following command at the root of your repository:

```sh
yarn add -W @leanjs/vue @leanjs/core @leanjs/vue-router
```

then in the `package.json` of your Vue app add the following `peerDependencies`:

```
"peerDependencies": {
  "@leanjs/core": "*",
  "@leanjs/vue": "*",
  @leanjs/vue-router: "*"
}
```

If your Vue app is not in a monorepo, then run the following command instead of the above:

```sh
yarn add @leanjs/vue @leanjs/core @leanjs/vue-router
```

## Basic usage

### `createRuntimeBindings`

1 . First, you have to create your Vue bindings for your [`runtime`](../core/README.md#the-leanjs-runtime).

```ts
// shared-runtime.ts

// You need to configure your runtime
const defaultState = { locale: "en" }; // this is just an example
export const { createRuntime } = configureRuntime(defaultState)({
  onError: () => {},
});

// Then create your Vue bindings for your runtime
export const { useSharedState, HostProvider } =
  createRuntimeBindings(createRuntime);
```

:::info

Read [@leanjs/core](../core/README.md#basic-usage) if you have not already created your own `createRuntime` function

:::

2 . Add a `HostProvider` to the root of your app tree

```tsx
<template>
  <div>
    <h1>Nuxt Host</h1>
    <HostProvider :runtime="runtime" origin="http://localhost:56500">
      <NuxtPage />
    </HostProvider>
  </div>
</template>

<script setup lang="ts">
  import { createRuntime, HostProvider } from "./runtime-vue";

  const runtime = createRuntime({ context: { appName: "VueShell" } });
</script>
```

3 . Use your `useSharedState` in your app, e.g.

```html
<template>
  <h1>Locale is {{ locale }}</h1>
</template>
<script>
  import { useSharedState } from "./runtime-vue";
  export default {
    name: "App",
    setup() {
      return useSharedState("locale");
    },
  };
</script>
```

### `useSharedState`

Composable to get the current state of one or many shared state properties. Types:

```ts
type useSharedState = <
  MyState extends Record<string, any>,
  Prop extends keyof MyState
>(
  ...props:
    | Prop[]
    | {
        prop: Prop;
        loader?: () => MyState[Prop] | Promise<MyState[Prop]>;
        deep?: boolean;
      }
) => Record<Prop, Ref<MyState[Prop]>>;
```

## ComposableApps

To use any of the following composables, you must first call `createRuntimeBindings`. Read the [basic usage](#basic-usage) section above for more info.

### `createApp`

Arguments:

- `App: Component` - required
- `options: { appName: string }` - required.

Create a file called `index.ts|js` in the `src` directory where your composable app is. For example:
Create a file called `index.ts|js` in the `src` directory where your composable app is. For example:

```
my-monorepo/
├- apps/
│  ├─ vue-host/
├─ composable-apps/
│  ├─ vue-app-1/
│  │  ├─ package.json
│  │  ├─ src/
│  │  │  ├─ VueApp1.vue
│  │  │  ├─ index.ts 👈
├─ package.json
```

:::tip

Read the recommended setup in our [getting started page](../../docs/getting-started/#recommended-setup) if you want to create a similar monorepo structure

:::

Call `createApp` with the root component of your app, for example:

```ts
// my-monorepo/composable-apps/vue-app-1/src/index.ts
import { createApp } from "@leanjs/vue-router";

import RemoteVue1 from "./RemoteVue1.vue";

export default createApp(RemoteVue1, { appName: "RemoteVue1" });
```

Hello world example of the `RemoteVue1` imported above

```tsx
<template>
  <div>
    <h1>Hello Vue composable-app 1</h1>
  </div>
</template>
```

Create a file called `selfHosted.ts|js` in the `src` directory where your composable app is, for example:

```
my-monorepo/
├- apps/
│  ├─ vue-host/
├─ composable-apps/
│  ├─ vue-app-1/
│  │  ├─ package.json
│  │  ├─ src/
│  │  │  ├─ VueApp1.vue
│  │  │  ├─ index.ts 👈
│  │  │  ├─ selfHosted.ts 👈
├─ package.json
```

Export a `createRuntime` function from the `selfHosted.ts|js` file. This is the runtime that will be used when the app runs in isolation, meaning without a host.

```ts
// my-monorepo/composable-apps/vue-app-1/src/selfHosted.ts
export { createRuntime } from "@my-org/runtime-vue";
```

:::info

Read [@leanjs/core](../core/README.md#basic-usage) if you have not already created your own `createRuntime` function

:::

## Components

### `HostProvider`

You have to **call [createRuntimeBindings](#createruntimebindings) to create a `HostProvider` component** before you use it. `HostProvider` stores in a Vue context values that are shared across apps hosted in the same component tree. Props:

#### `runtime` prop - required

Your Lean [runtime](../core/README.md).

#### `origin` prop - optional

[Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin) where your remote composable apps are. During development, use the address where you run your Lean [proxy dev server](../cli/README.md#proxy-dev-server). Use the address of your CDN in production, e.g. `https://cdn.example.com`.

Example

```tsx
<template>
    <HostProvider :runtime="runtime" :origin="origin">
      <NuxtPage />
    </HostProvider>
</template>

<script setup lang="ts">
  import { createRuntime, HostProvider } from "./shared-runtime";

  const runtime = createRuntime({
    context: { appName: "AppExample" },
  });

  const origin = process.env.MICROFRONTENDS_ORIGIN;
</script>
```

### `Host`

It hosts a composable app in a Vue host.

You can read more about this in [`@leanjs/nuxt`](../nuxt/README.md#host)
