<template>
  <div>
    <h2>Nesting Routing</h2>
    <Host
      :app="{
        packageName:
          '@leanjs/e2e-test-subjects-remote-react-router-sub-pages-17',
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { Host } from "@leanjs/nuxt";
</script>
