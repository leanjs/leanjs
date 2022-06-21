import type {
  CreateRemoteConfig,
  RunRemoteOptions,
  MountOptions,
  Cleanup,
  CreateRuntime,
  AppProps,
  GetRuntime,
} from "@leanjs/core";
import { createApp } from "vue";
import type { Component, App } from "vue";
import {
  createRouter,
  createWebHistory,
  createMemoryHistory,
  START_LOCATION,
} from "vue-router";
import { _ as CoreUtils } from "@leanjs/core";

const { configureMount } = CoreUtils;

export {
  CreateRemoteConfig,
  RunRemoteOptions,
  MountOptions,
  Cleanup,
  CreateRuntime,
};

export const createRemote =
  <
    MyCreateRuntime extends CreateRuntime = CreateRuntime,
    MyAppProps extends AppProps = AppProps
  >(
    App: Component,
    config?: CreateRemoteConfig
  ) =>
  (options: RunRemoteOptions) => {
    const { isSelfHosted = false, initialState, appName } = options;
    const { createRuntime, onBeforeMount } = config || {};

    function mount(
      el: HTMLElement,
      {
        runtime = createRuntime?.() as GetRuntime<MyCreateRuntime>,
        onRemoteNavigate,
        basename,
        pathname,
      }: MountOptions<GetRuntime<MyCreateRuntime>> = {}
    ) {
      const routes = [];
      if (basename && basename !== "/") {
        // we need to provide a "/" to vue router so we pass a fake template
        routes.push({ path: "/", component: { template: "" } });
        routes.push({ path: basename, component: App });
      } else {
        routes.push({ path: "/", component: App });
      }
      const history = isSelfHosted
        ? createWebHistory(basename)
        : createMemoryHistory(basename);

      const router = createRouter({
        history,
        routes,
      });

      let app: App;

      return {
        ...configureMount<MyAppProps>({
          el,
          appName,
          runtime,
          basename,
          pathname,
          isSelfHosted,
          initialState,
          onBeforeMount,
          pushInitialPath: history.push,
          cleanups: onRemoteNavigate
            ? [
                router.beforeEach((to, from) => {
                  if (from !== START_LOCATION) {
                    onRemoteNavigate?.(to.path, {
                      hash: to.hash,
                      // TODO search: to.query,
                    });
                  }
                }),
              ]
            : [],
          render: ({ appProps }) => {
            app = createApp(App, { ...appProps, isSelfHosted })
              .provide("runtime", runtime)
              .use(router);
            app.mount(el);
          },
          unmount: () => {
            app?.unmount();
          },
        }),
        onHostNavigate: (nextPathname: string) => {
          const currentPathname = history.location;
          if (nextPathname !== currentPathname) router?.push(nextPathname);
        },
      };
    }

    return { mount, createRuntime };
  };
