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
import type {
  RouteRecordRaw,
  RouterScrollBehavior,
  parseQuery,
  stringifyQuery,
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

interface VueRouterConfig {
  routes?: RouteRecordRaw[];
  scrollBehavior?: RouterScrollBehavior;
  parseQuery?: typeof parseQuery;
  stringifyQuery?: typeof stringifyQuery;
  linkActiveClass?: string;
  linkExactActiveClass?: string;
}
interface CreateRemoteVueConfig extends CreateRemoteConfig {
  router: VueRouterConfig;
}

export const createRemote =
  <
    MyCreateRuntime extends CreateRuntime = CreateRuntime,
    MyAppProps extends AppProps = AppProps
  >(
    App: Component,
    config?: CreateRemoteVueConfig
  ) =>
  (options: RunRemoteOptions) => {
    const { isSelfHosted } = options;
    const {
      createRuntime,
      onBeforeMount,
      router: { routes = [], ...routerConfig } = {},
    } = config || {};

    function mount(
      el: HTMLElement,
      {
        runtime = createRuntime?.() as GetRuntime<MyCreateRuntime>,
        onRemoteNavigate,
        basename,
        pathname,
      }: MountOptions<GetRuntime<MyCreateRuntime>> = {}
    ) {
      const history = isSelfHosted
        ? createWebHistory(basename)
        : createMemoryHistory(basename);
      const router = createRouter({
        history,
        routes,
        ...routerConfig,
      });

      let app: App;

      return {
        ...configureMount<MyAppProps>({
          el,
          ...options,
          runtime,
          basename,
          pathname,
          onBeforeMount,
          setInitialPath: history.replace,
          cleanups: onRemoteNavigate
            ? [
                router.beforeEach((to, from) => {
                  if (from !== START_LOCATION) {
                    onRemoteNavigate?.({
                      pathname: to.path,
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
