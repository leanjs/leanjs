
<template>
  <Mount
    v-if="mount"
    :mount="mount"
    :navigate="navigate"
    :listen="listen"
    :basename="basename"
    :pathname="props.pathname"
    :runtime="runtime"
  />
  <div v-else="mount">Loading...</div>
</template> 

<script setup lang="ts">

  import { inject, defineProps, watchEffect, ref, onBeforeMount } from 'vue';
  import type { Runtime, MountFunc } from '@leanjs/core';
  import { _ as CoreUtils } from "@leanjs/core";
  import { Mount } from "@leanjs/vue";
  export interface HostProps {
    remote:  {
      packageName: string;
    };
    pathname?: string;
  }

  // TODO - vue lifecycle and stick this in the right place
  const mountCache = new Map<string, MountFunc>();

  const {
    loadModule,
    loadScript,
    createRemoteName,
    deleteTrailingSlash,
    getRemoteUrl,
  } = CoreUtils;
  const runtime = inject<Runtime>('runtime');
  const props = defineProps<HostProps>();
  const { packageName } = props.remote;
  const origin = deleteTrailingSlash(inject<string>('origin') ?? '');
  

  const name = createRemoteName(packageName);

  const url = getRemoteUrl({ origin, packageName });

  const mountKey = url + name;

  const cachedMount = mountCache.get(mountKey);
  const mount = ref(cachedMount);

  let router;
  if (useRoute) {
    router = useRoute();
  }
  
  // Confirm that router.path includes baseURL if provided
  // @see https://v3.nuxtjs.org/api/configuration/nuxt.config#baseurl
  const basename = router?.path;

  // TODO
  const navigate = () => {

  }

  // TODO
  const listen = () => {

  }
  onBeforeMount(() => {
    watchEffect(() => {
      if (!cachedMount) {
        loadScript(url)
          .then(() => loadModule(name))
          .then(({ default: config }) => {
            if (typeof config !== "function") {
              // TODO - do this properly
              throw new Error("Remote module didn't return a function");
            } else {
              const { mount: remoteMount } = config({
                isSelfHosted: false,
              });
  
              mount.value = remoteMount;
              mountCache.set(mountKey, remoteMount);
            }
          }).catch((error) => {
            console.log(error);
            // TODO 
            console.error("🚨 ");
          })
      }
    })
  });
</script>
