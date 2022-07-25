<template>
  <Mount
    v-if="mount && runtime && !error"
    :mount="mount"
    :listen="listen"
    :basename="basename"
    :pathname="props.pathname"
  :runtime="runtime"
  />
  <div v-if="error">
    <slot name="error" :error="error">Error: {{ error }}</slot>
  </div>
  <div v-if="(!mount || !runtime) && !error">
    <slot name="loading">Loading...</slot>
  </div>
</template>

<script setup lang="ts">
import { inject, defineProps, watchEffect, ref, onBeforeMount } from "vue";
import type { Runtime, NavigateFunc, ListenFunc } from "@leanjs/core";
import { _ as CoreUtils } from "@leanjs/core";
import { Mount } from "@leanjs/vue";
import "./types";
import mountCache from "./mountCache";
import { RouteLocationNormalizedLoaded, Router } from "vue-router";

export interface HostProps {
  remote: {
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
const runtime = inject<Runtime>("runtime");
const injectedOrigin = inject<string>("origin");
if (!injectedOrigin) {
  throw new Error(`you must provide an origin prop in HostProvider`);
}

const props = defineProps<HostProps>();
const { packageName } = props.remote;
const origin = deleteTrailingSlash(injectedOrigin);

const name = createRemoteName(packageName);

const url = getRemoteUrl({ origin, packageName });

const mountKey = url + name;

const cachedMount = mountCache.get(mountKey);
const mount = ref(cachedMount);

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

onBeforeMount(() => {
  watchEffect(() => {
    if (!cachedMount) {
      loadScript(url)
        .then(() => loadModule(name))
        .then(({ default: config }) => {
          if (typeof config !== "function") {
            error.value = new Error("Remote module didn't return a function");
          } else {
            const { mount: remoteMount } = config({
              isSelfHosted: false,
            });

            mount.value = remoteMount;
            mountCache.set(mountKey, remoteMount);
          }
        })
        .catch((err) => {
          error.value = err;
        });
    }
  });
});
</script>
