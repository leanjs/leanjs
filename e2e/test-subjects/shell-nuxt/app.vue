<template>
  <div>
    <h1>Nuxt Host</h1>
    <NuxtLink to="/">Home page</NuxtLink> | 
    <NuxtLink to="/vue">Vue page</NuxtLink> | 
    <NuxtLink to="/custom">Custom page</NuxtLink> |
    <NuxtLink to="/custom-error">Custom error</NuxtLink>
    <HostProvider :runtime="runtime" origin="http://localhost:56500">
      <NuxtPage />
    </HostProvider>
  </div>
</template>

<script setup lang="ts">
  import { HostProvider } from "@leanjs/nuxt";
  import { createRuntime }from "@leanjs/e2e-test-subjects-package-runtime-shared";

  const runtime = createRuntime();
</script>