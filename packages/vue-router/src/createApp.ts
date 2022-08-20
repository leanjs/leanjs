import type {
  CreateRemoteConfig,
  CreateComposableApp,
  MountOptions,
  Cleanup,
  CreateRuntime,
  GetRuntime,
  MountFunc,
} from "@leanjs/core";
import { createApp as createVueApp } from "vue";
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

export { CreateRemoteConfig, MountOptions, Cleanup, CreateRuntime };

interface VueRouterConfig {
  routes?: RouteRecordRaw[];
  scrollBehavior?: RouterScrollBehavior;
  parseQuery?: typeof parseQuery;
  stringifyQuery?: typeof stringifyQuery;
  linkActiveClass?: string;
  linkExactActiveClass?: string;
}
interface CreateRemoteVueConfig<MyCreateRuntime extends CreateRuntime>
  extends CreateRemoteConfig<MyCreateRuntime> {
  router?: VueRouterConfig;
}

export const createApp = <
  MyCreateRuntime extends CreateRuntime = CreateRuntime
>(
  App: Component,
  {
    onBeforeMount,
    packageName,
    router: { routes = [], ...routerConfig } = {},
  }: CreateRemoteVueConfig<MyCreateRuntime>
) => {
  const bootstrap: CreateComposableApp<MyCreateRuntime> = (options = {}) => {
    const { createRuntime, isSelfHosted } = options;
    const mount: MountFunc<GetRuntime<MyCreateRuntime>> = (
      el,
      {
        runtime = createRuntime?.() as GetRuntime<MyCreateRuntime>,
        onRemoteNavigate,
        basename,
        pathname = getDefaultPathname(isSelfHosted),
      } = {}
    ) => {
      let app: App;
      let semaphore = true;
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
          packageName,
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
            app = createVueApp(App, { ...appProps, isSelfHosted })
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

    return { mount, packageName, createRuntime };
  };

  bootstrap.packageName = packageName;

  return bootstrap;
};
