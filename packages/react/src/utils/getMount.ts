import type { MountFunc, ComposableAppSync } from "@leanjs/core";
import { _ as CoreUtils } from "@leanjs/core";
import type { ErrorComponent, HostContextValues } from "../types";

const {
  loadModule,
  loadScript,
  createRemoteName,
  deleteTrailingSlash,
  getRemoteUrl,
} = CoreUtils;

const mountCache = new Map<string, MountFunc | undefined>();

export interface GetMountArgs {
  app: ComposableAppSync;
  context?: HostContextValues;
  errorComponent?: ErrorComponent;
}

export async function getMount({ app, context }: GetMountArgs): Promise<{
  name: string;
  mount: MountFunc | undefined;
  url: string | undefined;
}> {
  const { packageName } = app;
  if (!packageName) {
    throw new Error(`App with no packageName can't be hosted`);
  }

  const isAppObject = typeof app === "object";
  const name = createRemoteName(packageName);
  let url: string | undefined;
  let mountKey = name;

  if (isAppObject && !app.mount) {
    if (!context?.origin) {
      throw new Error(
        `origin prop is required in HostProvider to host a remote app`
      );
    }
    const origin = deleteTrailingSlash(context.origin);
    url = getRemoteUrl({ origin, packageName });
    mountKey = name + url;
  } else if (!mountCache.get(mountKey)) {
    mountCache.set(mountKey, isAppObject ? app.mount : app().mount);
  }

  const cachedMount = mountCache.get(mountKey);

  if (!cachedMount && url) {
    await loadScript(url);
    const { default: createComposableApp } = await loadModule(name);
    if (typeof createComposableApp !== "function") {
      throw new Error("Remote module didn't return a function");
    } else {
      const { mount } = createComposableApp({
        isSelfHosted: false,
      });

      return { mount, name, url };
    }
  }

  return { mount: cachedMount, name, url };
}
