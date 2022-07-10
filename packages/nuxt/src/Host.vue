
<template>
  <Mount
    v-if="mount && runtime"
    :mount="mount"
    :navigate="navigate"
    :listen="listen"
    :basename="basename"
    :pathname="props.pathname"
    :runtime="runtime"
  />
  <div v-else="!mount || !runtime">Loading...</div>
</template> 

<script setup lang="ts">
  import { inject, defineProps, watchEffect, ref, onBeforeMount } from 'vue';
  import type { Runtime, NavigateFunc, ListenFunc } from '@leanjs/core';
  import { _ as CoreUtils } from "@leanjs/core";
  import { Mount } from "@leanjs/vue";
  import './types';
  import mountCache from './mountCache';

  export interface HostProps {
    remote:  {
      packageName: string;
    };
    pathname?: string;
  }

  // TODO - vue lifecycle and stick this in the right place

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

  let route;
  if (useRoute) {
    route = useRoute();
  }
  
  // Confirm that router.path includes baseURL if provided
  // @see https://v3.nuxtjs.org/api/configuration/nuxt.config#baseurl
  const basename = route?.path;

  const router = useRouter();

  const navigate: NavigateFunc = ({ pathname, hash, search = '' }) => {
    router.push({ path: `${pathname}${hash}${search}` });
  }
  
  const listen: ListenFunc = (listener) => {
    const routeAfterEachOff = router.afterEach((to) => {
      const { path, hash } = to;
      const {
        location: { search },
      } = window;
      listener({
        action: "PUSH",
        location: { pathname: path, hash, search },
      });
    });

    return () => {
      routeAfterEachOff();
    }
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
