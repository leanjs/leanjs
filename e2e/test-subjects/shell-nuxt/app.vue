<template>
  <div>
    <h1>Nuxt Host</h1>
    <NuxtLink to="/">Home page</NuxtLink> |
    <NuxtLink to="/vue">Vue page</NuxtLink> |
    <NuxtLink to="/custom">Custom page</NuxtLink> |
    <NuxtLink to="/custom-error">Custom error</NuxtLink> |
    <NuxtLink to="/nested-routing">Nested React</NuxtLink>
    <HostProvider :runtime="runtime" origin="http://localhost:56500">
      <NuxtPage />
    </HostProvider>
  </div>
</template>

<script setup lang="ts">
import { createRuntime, HostProvider } from "@leanjs/e2e-test-package-runtime-vue";

const runtime = createRuntime({
  context: { appName: "NuxtShell", version: "5.6.7" },
});
</script>
