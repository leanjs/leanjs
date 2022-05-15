import type {
  CreateRemoteConfig,
  RunRemoteOptions,
  MountOptions,
  Cleanup,
} from "@leanjs/core";
import { createApp, App as VueApp } from "vue";
import {
  createRouter,
  createWebHistory,
  createMemoryHistory,
  Router,
  START_LOCATION,
} from "vue-router";

let inMemoryInitialState: any | undefined = undefined;

function saveInitialState(state: any) {
  inMemoryInitialState = state;
}

export const createRemote =
  (App: VueApp, config?: CreateRemoteConfig) =>
  (
    options: RunRemoteOptions = {
      isSelfHosted: false,
    }
  ) => {
    const { isSelfHosted, initialState } = options;
    const { createRuntime, onBeforeMount } = config || {};
    const log = createRuntime?.log;

    if (inMemoryInitialState === undefined) saveInitialState(initialState);

    function mount(
      el: HTMLElement,
      {
        runtime = createRuntime?.(),
        onRemoteNavigate,
        basename,
        pathname,
      }: MountOptions = {}
    ) {
      let cleanups: Cleanup[] = [];
      const onBeforeUnmountCallbacks: Cleanup[] = [];
      const onUnmountedCallbacks: Cleanup[] = [];
      let router: Router | undefined = undefined;
      const history = isSelfHosted
        ? createWebHistory(basename)
        : createMemoryHistory(basename);

      if (el) {
        const runMount = async () => {
          try {
            const initialPath = [basename, pathname]
              .join("/")
              .replace(/\/{2,}/g, "/");

            const appProps = onBeforeMount?.({
              runtime,
              isSelfHosted,
              initialState: inMemoryInitialState,
              saveInitialState,
              onBeforeUnmount: (callback: Cleanup) => {
                onBeforeUnmountCallbacks.push(callback);
              },
              onUnmounted: (callback: Cleanup) => {
                onUnmountedCallbacks.push(callback);
              },
            });

            const routes = [];
            if (basename && basename !== "/") {
              routes.push({ path: "/", component: { template: "" } });
              routes.push({ path: basename, component: App });
            } else {
              routes.push({ path: "/", component: App });
            }

            const router = createRouter({
              history,
              routes,
            });

            await router.replace(initialPath);
            const app = createApp(App, { ...appProps, isSelfHosted })
              .provide("runtime", runtime)
              .use(router);

            app.mount(el);

            cleanups = cleanups.concat(onBeforeUnmountCallbacks);
            cleanups.push(() => app.unmount());
            cleanups = cleanups.concat(onUnmountedCallbacks);

            if (onRemoteNavigate) {
              cleanups.push(
                router.beforeEach((to, from) => {
                  if (from !== START_LOCATION) {
                    onRemoteNavigate?.(to.path, {
                      hash: to.hash,
                      // TODO search: to.query,
                    });
                  }
                })
              );
            }
          } catch (error: any) {
            log?.(error as Error);
            el.innerText = `Error: ${error.message ?? error}`;
          }
        };

        runMount();
      }

      return {
        unmount: () => {
          cleanups.forEach((cleanup) => cleanup());
        },
        onHostNavigate: (newPathname: string) => {
          const pathname = history.location;
          if (newPathname !== pathname) router?.push(newPathname);
        },
      };
    }

    return { mount, createRuntime };
  };
