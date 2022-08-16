<template>
  <div>
    <h2>Vue</h2>
    <Host
      :app="{ packageName: '@leanjs/e2e-test-subjects-remote-vue-1' }"
      pathname="nested"
    />
  </div>
</template>

<script setup lang="ts">
import { Host } from "@leanjs/nuxt";
</script>
