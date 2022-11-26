<template>
  <div>
    <h2>Vue</h2>
    <Host :app="VueApp" pathname="build-time" />
  </div>
</template>

<script setup lang="ts">
import { Host } from "@leanjs/nuxt";
import VueApp from "@leanjs/e2e-test-subjects-remote-vue-3";
</script>
