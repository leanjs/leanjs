<template>
  <div>
    Something went wrong
    {{ props.error }}
  </div>
</template>

<script setup lang="ts">
  export interface ErrorProps {
    error: Error
  }
  const props = defineProps<ErrorProps>()
</script>