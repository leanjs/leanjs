<template>
  <slot />
</template>

<script setup lang="ts">
  import { defineProps, provide } from 'vue';
  import type { Runtime } from '@leanjs/core';
  
  export interface HostProviderProps<BaseRuntime extends Runtime = Runtime> {
    origin: string;
    // TODO - error and loading
    // errorComponent?: ErrorComponent;
    // loadingComponent?: LoadingComponent;
    runtime: BaseRuntime;
  }

  const props = defineProps<HostProviderProps>();
  
  provide('origin', props.origin);
  provide('runtime', props.runtime);

</script>
