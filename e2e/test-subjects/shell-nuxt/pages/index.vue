<template>
  <div>
    <h1>index</h1>
    <HostProvider :runtime="runtime" origin="http://localhost:56500">
        <Host
          :remote="{ packageName: '@leanjs/e2e-test-subjects-remote-vue-1' }"
        />
    </HostProvider>
  </div>
</template>

<script setup lang="ts">
  import { configureRuntime } from '@leanjs/core';
  import { Host, HostProvider } from "@leanjs/nuxt";
  const defaultState = {
    locale: "en",
  };

  const { createRuntime } =  configureRuntime(defaultState)({
    onError: (error) =>
      console.log(`🚨 log this properly 🔥! e.g. Sentry`, error),
  });

  const runtime = createRuntime();
</script>