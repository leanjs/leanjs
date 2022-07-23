<template>
  <div>
    <h2>Nesting Routing</h2>
        <Host
          :remote="{ packageName: '@leanjs/e2e-test-subjects-remote-react-sub-pages' }"  
        />
  </div>
</template>

<script setup lang="ts">
  import { Host } from "@leanjs/nuxt";
</script>