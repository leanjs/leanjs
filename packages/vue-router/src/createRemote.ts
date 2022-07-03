import type {
  CreateRemoteConfig,
  RunRemoteOptions,
  MountOptions,
  Cleanup,
  CreateRuntime,
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

const { configureMount, getDefaultPathname, dedupeSlash } = CoreUtils;

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

let semaphore = true;

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
        onHostNavigate: async ({ pathname: rawNextPathname }) => {
          const nextPathname = basename
            ? dedupeSlash(rawNextPathname.replace(basename, "/"))
            : rawNextPathname;

          if (semaphore && nextPathname !== history.location) {
            semaphore = false;
            // We need a semaphore here because VueRouter router.push is async.
            // router.push triggers an event in the router of the host because of onRemoteNavigate,
            // which triggers onHostNavigate again. However, history.location is not yet updated this second time because router.push is async.
            // That creates an infinite loop. This semaphore avoids such infinite loop.
            await router?.push(nextPathname);
            semaphore = true;
          }
        },
      };
    };

    return { mount, createRuntime };
  };
