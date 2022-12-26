import type {
  CreateAppConfig,
  CreateComposableApp,
  MountOptions,
  Cleanup,
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

const {
  mountApp,
  getDefaultPathname,
  dedupeSlash,
  createAppError,
  setRuntimeContext,
} = CoreUtils;

export { CreateAppConfig, MountOptions, Cleanup };

interface VueRouterConfig {
  routes?: RouteRecordRaw[];
  scrollBehavior?: RouterScrollBehavior;
  parseQuery?: typeof parseQuery;
  stringifyQuery?: typeof stringifyQuery;
  linkActiveClass?: string;
  linkExactActiveClass?: string;
}
interface CreateRemoteVueConfig extends CreateAppConfig {
  router?: VueRouterConfig;
  appName: string;
}

export const createApp = (
  App: Component,
  {
    appName,
    router: { routes = [], ...routerConfig } = {},
  }: CreateRemoteVueConfig
) => {
  if (!appName) throw new Error("appName required in Vue createApp");

  const createComposableApp: CreateComposableApp = ({
    isSelfHosted,
    version,
  } = {}) => {
    const mount: MountFunc = (
      el,
      {
        runtime,
        onRemoteNavigate,
        basename,
        pathname = getDefaultPathname(isSelfHosted),
        onError,
        ...rest
      }
    ) => {
      let app: App;
      let semaphore = true;
      const history = isSelfHosted
        ? createWebHistory(basename)
        : createMemoryHistory(basename);

      const initialPath = [basename, pathname]
        .join("/")
        .replace(/\/{2,}/g, "/");

      const router = createRouter({
        history,
        routes,
        ...routerConfig,
      });

      return {
        unmount: mountApp({
          ...rest,
          el,
          appName,
          isSelfHosted,
          onError,
          cleanups: onRemoteNavigate
            ? [
                router.beforeEach((to, from) => {
                  if (from !== START_LOCATION) {
                    // check if the next path (to.path) is inside the mfe (in its routes)
                    const isToAppRoute =
                      routes.filter(
                        (route) =>
                          route.path.replace(/\/$/, "") ===
                          to.path.replace(/\/$/, "")
                      ).length > 0;

                    const nextPathname = isToAppRoute
                      ? [initialPath, to.path].join("/").replace(/\/{2,}/g, "/")
                      : to.path;

                    onRemoteNavigate?.({
                      pathname: nextPathname,
                      hash: to.hash,
                      // TODO search: to.query,
                    });
                  }
                }),
              ]
            : [],
          render: ({ appProps, rendered }) => {
            try {
              app = createVueApp(App, { ...appProps, isSelfHosted })
                .provide(
                  "runtime",
                  setRuntimeContext({ appName, version }, runtime)
                )
                .use(router);
              app.mount(el);
              rendered(); // TODO done when onMounted
            } catch (error: any) {
              throw createAppError({ appName, version, error });
            }
          },
          unmount: () => {
            app?.unmount();
          },
        }),
        onHostNavigate: async ({ pathname: rawNextPathname }) => {
          const nextPathname = initialPath
            ? dedupeSlash(rawNextPathname.replace(initialPath, "/"))
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

    return { mount, appName, version };
  };

  createComposableApp.appName = appName;

  return createComposableApp;
};
