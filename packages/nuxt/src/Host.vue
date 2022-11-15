<template>
  <component :is="HostApp" v-if="HostApp"/>
  <div v-if="error">
    <slot name="error">Error: {{ error }}</slot>
  </div>
  <div v-if="!HostApp && !error">
    <slot name="loading">Loading...</slot>
  </div>
</template>

<script setup lang="ts">
import  { inject, defineProps, watchEffect, ref, Component, onMounted, shallowRef, h } from "vue";
import type {
  Runtime,
  ListenFunc,
  GetComposableApp,
  GetComposableAppAsync,
  RemoteProp,
  MountFunc,
} from "@leanjs/core";
import { _ as CoreUtils } from "@leanjs/core";
import { Mount } from "@leanjs/vue";
import "./types";
import mountCache from "./mountCache";
import { RouteLocationNormalizedLoaded, Router } from "vue-router";

export interface HostProps {
  app: GetComposableApp | GetComposableAppAsync;
  pathname?: string;
  remote?: RemoteProp;
}

const {
  isRemoteApp,
  loadApp,
} = CoreUtils;
const runtime = inject<Runtime>("runtime");
const injectedOrigin = inject<string>("origin");
if (!injectedOrigin) {
  throw new Error(`you must provide an origin prop in HostProvider`);
}
const props = defineProps<HostProps>();
const version = props?.remote?.version;
const mountKey = isRemoteApp(props.app) ? `${props.app.packageName}${version}` : props.app;

let cachedHostApp = mountCache.get(mountKey);
const HostApp = shallowRef(cachedHostApp);

const error = ref<Error | null>(null);
let route: RouteLocationNormalizedLoaded;
let router: Router;
let basename: string;
try {
  route = useRoute?.();
  router = useRouter?.();
  basename = route?.path;
} catch (e) {
  // stops nuxt from crashing when it can't find these on the server
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
  };
};

const HostWrapper = (mount: MountFunc, url?: string) => {
  //@ts-ignore
  return h(Mount, {
    mount,
    runtime,
    basename,
    listen,
    setError: (e: any) => error.value = e,
  });

  
};

onMounted(() => {
  watchEffect(async () => {
    if (!cachedHostApp) {
      try {
        mountCache.set(
          mountKey,
          (
            await loadApp<Component>({
              app: props.app,
              remote: props.remote,
              version,
              context: {
                origin: injectedOrigin,
              },
              HostWrapper,
            })
          ).default
        )
        HostApp.value = mountCache.get(mountKey);
      } catch (e: any) {
        error.value = e;
      }
    };
  });
});
</script>
