<template>
  <div>
    <h2>Index (React)</h2>
        <Host
          :remote="{ packageName: '@leanjs/e2e-test-subjects-remote-react-1' }"
        />
  </div>
</template>

<script setup lang="ts">
  import { Host } from "@leanjs/nuxt";
</script>