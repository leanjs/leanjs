import type {
  MountFunc,
  GetComposableApp,
  ComposableApp,
  RemoteComposableApp,
} from "@leanjs/core";
import { _ as CoreUtils } from "@leanjs/core";
import { RemoteProp } from "..";
import type { HostContextValues } from "../types";

const {
  loadModule,
  loadScript,
  createRemoteName,
  deleteTrailingSlash,
  getRemoteUrl,
} = CoreUtils;

const mountCache = new Map<string, MountFunc | undefined>();

export interface GetMountArgs {
  app: GetComposableApp | ComposableApp;
  context?: HostContextValues;
  remote?: RemoteProp;
}

function isNotRemoteApp(
  app: RemoteComposableApp | ComposableApp
): app is ComposableApp {
  return typeof app === "object" && !(app as RemoteComposableApp).packageName;
}

export async function getMount({
  app,
  context,
  remote,
}: GetMountArgs): Promise<{
  name: string;
  mount: MountFunc | undefined;
  url?: string;
}> {
  const appObject =
    typeof app === "function" ? app({ isSelfHosted: false }) : app;

  if (isNotRemoteApp(appObject)) {
    const { appName, mount } = appObject;
    if (!mount) {
      throw new Error(`mount is required`);
    }

    return { mount, name: appName };
  } else {
    const { packageName } = appObject;
    if (!packageName) {
      throw new Error(`Remote app with no packageName can't be hosted`);
    }
    if (!context?.origin) {
      throw new Error(
        `origin prop is required in HostProvider to host a remote app`
      );
    }

    const origin = deleteTrailingSlash(context.origin);
    const url = getRemoteUrl({ origin, packageName, version: remote?.version });
    const name = createRemoteName(packageName);
    const cachedMount = mountCache.get(url);

    if (!cachedMount) {
      await loadScript(url);
      const { default: createComposableApp } = await loadModule(name);
      if (typeof createComposableApp === "function") {
        const { mount } = createComposableApp({
          isSelfHosted: false,
        });
        mountCache.set(url, mount);

        return { mount, name: packageName, url };
      } else if (
        typeof createComposableApp === "object" &&
        createComposableApp.mount
      ) {
        return createComposableApp;
      } else {
        throw new Error("Remote module didn't return a function");
      }
    } else {
      return { mount: cachedMount, name: packageName, url };
    }
  }
}
