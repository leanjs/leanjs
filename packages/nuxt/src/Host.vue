
<template>
  <Mount
    v-if="mount && runtime && !error"
    :mount="mount"
    :navigate="navigate"
    :listen="listen"
    :basename="basename"
    :pathname="props.pathname"
    :runtime="runtime"
  />
  <div v-if="error"><slot name="error" :error="error">Error: {{error}}</slot></div>
  <div v-if="(!mount || !runtime) && !error"><slot name="loading">Loading...</slot></div>
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


  const error = ref<Error | null>(null);

  let route;
  if (useRoute) {
    route = useRoute();
  }

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
              error.value = new Error("Remote module didn't return a function")
            } else {
              const { mount: remoteMount } = config({
                isSelfHosted: false,
              });

              mount.value = remoteMount;
              mountCache.set(mountKey, remoteMount);
              
            }
          }).catch((err) => {
            error.value = err;
          });
      }
    })
  });

</script>
