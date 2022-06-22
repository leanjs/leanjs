<template>
  <div ref="root" />
</template>

<script setup lang="ts">
  import type {
    BasePath,
    ListenFunc,
    MountFunc,
    NavigateFunc,
    RemoveListener,
    Runtime,
    UnmountFunc,
  } from "@leanjs/core";
  import { onBeforeUnmount, ref, watchEffect } from "vue";

  export interface MountProps extends BasePath {
    mount: MountFunc;
    runtime: Runtime;
    navigate?: NavigateFunc;
    listen?: ListenFunc;
  }

  const props = defineProps<MountProps>();
  const { mount, listen, navigate, basename, pathname, runtime } = props;
  const root = ref<HTMLDivElement>();
  

  const initialPathname = ref(pathname).value;
  let unmount: UnmountFunc;
  let removeListener: RemoveListener | null | undefined;

  watchEffect((): void => {
    const myRoot = root.value;
    const mountRes = mount(myRoot ?? null, {
      onRemoteNavigate: (nextPathname, { hash, search } = {}): void => {
        const { pathname } = window.location;
        if (pathname !== nextPathname) {
          navigate?.({
            action: "PUSH",
            location: { pathname: nextPathname, search, hash },
          });
        }
      },
      basename,
      pathname: initialPathname,
      runtime,
    });

    unmount = mountRes.unmount;
    const { onHostNavigate } = mountRes;
    removeListener = onHostNavigate
      ? listen?.(({ location: { pathname: nextPathname, ...rest } }) => {
          onHostNavigate(nextPathname, rest);
        })
      : null;
  });

  onBeforeUnmount(() => {
    unmount();
    removeListener?.();
  });
</script>