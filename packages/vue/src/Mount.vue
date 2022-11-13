<template>
  <div ref="root" />
</template>

<script setup lang="ts">
import type {
  BasePath,
  ListenFunc,
  LogAnyError,
  MountFunc,
  NavigateFunc,
  RemoveListener,
  Runtime,
  UnmountFunc,
} from "@leanjs/core";
import { onBeforeUnmount, onMounted, ref } from "vue";

export interface MountProps extends BasePath {
  mount: MountFunc;
  runtime: Runtime;
  basename?: string;
  navigate?: NavigateFunc;
  listen?: ListenFunc;
  setError: LogAnyError;
}

const props = defineProps<MountProps>();
const { mount, listen, navigate, basename, pathname, runtime } = props;
const root = ref<HTMLDivElement>();

const initialPathname = ref(pathname).value;
let unmount: UnmountFunc;
let removeListener: RemoveListener | null | undefined;

onMounted(() => {
  const myRoot = root.value;
  const mountRes = mount(myRoot ?? null, {
    onRemoteNavigate: (location): void => {
      const { pathname } = window.location;
      if (pathname !== location.pathname) {
        navigate?.(location);
      }
    },
    basename,
    pathname: initialPathname,
    runtime,
    onError: (error) => {
      throw error;
    },
  });

  unmount = mountRes.unmount;
  const { onHostNavigate } = mountRes;
  removeListener = onHostNavigate
    ? listen?.((navigationUpdate) => {
        onHostNavigate(navigationUpdate.location);
      })
    : null;
});

onBeforeUnmount(() => {
  unmount();
  removeListener?.();
});
</script>
