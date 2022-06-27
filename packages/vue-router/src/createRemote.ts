import type {
  CreateRemoteConfig,
  RunRemoteOptions,
  MountOptions,
  Cleanup,
  CreateRuntime,
  AppProps,
  GetRuntime,
  MountFunc,
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

const { configureMount, getDefaultPathname } = CoreUtils;

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
  <MyCreateRuntime extends CreateRuntime = CreateRuntime>(
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

    const mount: MountFunc<GetRuntime<MyCreateRuntime>> = (
      el,
      {
        runtime = createRuntime?.(),
        onRemoteNavigate,
        basename,
        pathname = getDefaultPathname(isSelfHosted),
      } = {}
    ) => {
      let app: App;
      const history = isSelfHosted
        ? createWebHistory(basename)
        : createMemoryHistory(basename);
      history.replace(pathname);
      const router = createRouter({
        history,
        routes,
        ...routerConfig,
      });

      return {
        ...configureMount({
          el,
          ...options,
          log: createRuntime?.log,
          runtime,
          onBeforeMount,
          cleanups: onRemoteNavigate
            ? [
                router.beforeEach((to, from) => {
                  if (from !== START_LOCATION) {
                    onRemoteNavigate?.({
                      pathname: [basename, to.path]
                        .join("/")
                        .replace(/\/{2,}/g, "/"),
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
        onHostNavigate: ({ pathname: nextPathname }) => {
          const currentPathname = document.location.pathname;
          if (nextPathname !== currentPathname) {
            router?.push(nextPathname);
          }
        },
      };
    };

    return { mount, createRuntime };
  };
