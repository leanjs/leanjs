# @leanjs/vue

This package contains Vue bindings for [@leanjs/core](/leanjs/leanjs/tree/main/packages/core). You can learn more about the rationale behind a shared runtime in the following links:

- 🍿 [Video of talk at CityJS London](https://www.youtube.com/watch?v=pKiZI9meWw8)
- 📖 [Article in Alex Lobera's blog](https://alexlobera.com/sharing-state-in-micro-frontends-at-runtime/)

# Installation

`yarn add @leanjs/vue`

# Usage

1 . Create your custom `useSharedState` composable. This will add type-safety to your `useSharedState` composable based on your instance of LeanJS `runtime`.

```ts
// runtime-vue.ts
// Pro-tip: move this file to its own package, see examples/coolest-todos/packages/runtime-vue

const defaultState = {
  locale: "en", // define your default state accordingly, this is just an example
};

// configureRuntime is a generic TS function (if you use TypeScript)
// handy if the types that you want don't match the inferred types from defaultState
export const { createRuntime } = configureRuntime(defaultState)({
  onError: () => throw new Error("🔥 log this properly!")
});

export const { useSharedState } = createRuntimeBindings(createRuntime);
```

**⚠️ Why is `useSharedState` not a generic function instead of using `createRuntimeBindings` to infer and return a typed `useSharedState`?**

We want `useSharedState` to have custom TypeScript types based on the `runtime` used by a group of micro-apps in the same micro-frontend architecture. We don't want to give the consumers of `useSharedState` the ability to change these types because that could create inconsistencies between different micro-apps that share the same `runtime`.

2 . Provide a `runtime` at the root of your app, e.g.

```tsx
import { createApp } from "vue";
// Pro-tip: move your ./runtime-vue file to its own package, see examples/coolest-todos/packages/runtime-vue
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

## API

To use any of the following, you must first call `createRuntimeBindings`. Read the [usage](#usage) section above for more info.

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

## Example

You have a full example in the following files:

- `examples/coolest-todos/packages/runtime-vue/src/index.ts`
- `examples/coolest-todos/micros/profile-reset/src/components/App.vue`

## Issues

Do you have any issues with this package? Please file an [issue](https://github.com/leanjs/leanjs/issues/new).

## Feedback or questions

Send me a tweet at [@alex_lobera](twitter.com/alex_lobera/) with any feedback or questions 🙏.
