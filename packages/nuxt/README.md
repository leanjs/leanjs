# @leanjs/nuxt

## Installation

If your NuxtJS app is in a monorepo (recommended) execute the following command at the root of your repository:

```sh
yarn add -W @leanjs/nuxt @leanjs/vue @leanjs/core
```

then, in the package.json of your NuxtJS app add the following

```json
"peerDependencies": {
  "@leanjs/core": "*",
  "@leanjs/nuxt": "*",
  "@leanjs/vue": "*"
}
```

If your app is not in a monorepo, you can instead run:

```sh
yarn add @leanjs/nuxt @leanjs/vue @leanjs/core
```

## Basic Usage

### `HostProvider`

You have to add a `HostProvider` at the root of your nuxt component tree (in `app.vue`).

:::info
`HostProvider` isn't exported from @leanjs/nuxt.
You can lean more about `HostProvider` [here](../vue/README.md#hostprovider)
:::

To add a `HostProvider` you must first create it by calling `createRuntimeBindings`. Read more about this in the [`@leanjs/vue` package](../vue/README.md#createruntimebindings).

Example:

```tsx
<template>
  <HostProvider :runtime="runtime">
    <NuxtPage />
  </HostProvider>
</template>

<script setup lang="ts">
  import { createRuntime, HostProvider } from "@my-org/vue-runtime";

  const runtime = createRuntime({
    context: { appName: "NuxtShell" }
  });
</script>
```

:::info
Read [@leanjs/core](../core/README.md#basic-usage) if you have not already created your own `createRuntime` function.
:::

### `Host`

The `Host` component "hosts" a composable app in a Nuxt host application.

Example:

```tsx
<template>
  <Host
    :app="{ packageName: '@my-org/react-app-1' }"
  />
</template>

<script setup lang="ts">
  import { Host } from "@leanjs/nuxt";
</script>
```

#### The `app` prop

The `app` prop expects a `GetComposableApp` type.

Given a composable app created as follows:

```tsx
import { createApp } from "@leanjs/vue-router";
import VueApp1 from "./VueApp1.vue";

// 👇 your app is created here
export default createApp(VueApp1, {
  appName: "VueApp1",
});
```

You can load this into a host application in 3 ways:

**1. Standard esm import**

```tsx
<template>
  <Host
    :app="VueApp1"
  />
</template>

<script setup lang="ts">
  import { Host } from "@leanjs/nuxt";
  import VueApp1 from "@my-org/vue-app-1";
</script>
```

**2. Dynamic import**

```tsx
<template>
  <Host
    :app="loadApp"
  />
</template>

<script setup lang="ts">
  import { Host } from "@leanjs/nuxt";
  const loadApp = () => import("@my-org/vue-app-1");
</script>
```

**3. Runtime load**

```tsx
<template>
  <Host
    :app="{ packageName: "@my-org/vue-app-1" }"
  />
</template>

<script setup lang="ts">
  import { Host } from "@leanjs/nuxt";
</script>
```

The first two methods are examples of "build-time composition". They will be built as part of the host application bundle.

The 3rd method uses [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/) to allow your application to be loaded at runtime.

:::caution
In order to enable this feature, you must be using Webpack v5
:::

To set up your composable apps for runtime composition, you need to add a [HostWebpackPlugin](../webpack/README.md#hostwebpackplugin) to your `nuxt.config.js` to enable this feature.

If this feature is enable, you need to build and deploy your composable apps independently. See [`@leanjs/aws`](../aws/README.md) to deploy your composable apps in AWS.

## Limitations

Due to the nature of nuxt, we currently cannot support microfrontends that manage multiple routes in nuxt.

While we believe this is an unusual scenario, it is nonetheless a feature we'd like to add in the future.
