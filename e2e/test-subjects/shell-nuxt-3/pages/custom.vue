<template>
  <div>
    <h2>Custom Loading Vue</h2>
    <Host :app="{ packageName: '@leanjs/e2e-test-subjects-remote-vue-3' }">
      <template #error="errorProps">
        <Error :error="errorProps.error" />
      </template>
      <template v-slot:loading>
        <Loader />
      </template>
    </Host>
  </div>
</template>

<script setup lang="ts">
import { Host } from "@leanjs/nuxt";
</script>
