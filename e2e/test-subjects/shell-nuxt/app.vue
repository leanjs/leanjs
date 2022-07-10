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
  import { configureRuntime } from '@leanjs/core';
  import { HostProvider } from "@leanjs/nuxt";
  const defaultState = {
    locale: "en",
  };

  const { createRuntime } =  configureRuntime(defaultState)({
    onError: (error) =>
      console.log(`🚨 log this properly 🔥! e.g. Sentry`, error),
  });

  const runtime = createRuntime();
</script>