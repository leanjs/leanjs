# @leanjs/vue

## Installation

If your Vue app is in a monorepo (recommended) execute the following command at the root of your repository:

```sh
yarn add -W @leanjs/vue @leanjs/core
```

then in the `package.json` of your Vue app add the following `peerDependencies`:

```
"peerDependencies": {
  "@leanjs/core": "*",
  "@leanjs/vue": "*"
}
```

If your Vue app is not in a monorepo, then run the following command instead of the above:

```sh
yarn add @leanjs/vue @leanjs/core
```

## Basic usage

### `createRuntimeBindings`

1 . First, you have to create your Vue bindings for your `runtime`.

```ts
// shared-runtime.ts

// You need to configure your runtime
const defaultState = { locale: "en" }; // this is just an example
export const { createRuntime } = configureRuntime(defaultState)({
  onError: () => {},
});

// Then create your Vue bindings for your runtime
export const { useSharedState } = createRuntimeBindings(createRuntime);
```

:::info

Read [@leanjs/core](/packages/core#basic-usage) if you have not already created your own `createRuntime` function

:::

2 . Provide a `runtime` at the root of your app, e.g.

```tsx
import { createApp } from "vue";
import { createRuntime } from "./runtime-vue";

const runtime = createRuntime();
const app = createApp(App);

app.provide("runtime", runtime);
app.mount(document.getElementById("#app"));
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

## Composables

To use any of the following composables, you must first call `createRuntimeBindings`. Read the [basic usage](#basic-usage) section above for more info.

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
