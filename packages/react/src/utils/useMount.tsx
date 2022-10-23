import { useState, useEffect, useContext, useRef } from "react";

import type {
  MountFunc,
  RemoteComposableApp,
  ComposableApp,
  GetComposableApp,
} from "@leanjs/core";
import { _ as CoreUtils } from "@leanjs/core";
import type { UseMountArgs } from "../types";
import { HostContext } from "../private/HostProvider";
import { useRuntime } from "../runtime";

const {
  loadModule,
  loadScript,
  createRemoteName,
  deleteTrailingSlash,
  getRemoteUrl,
} = CoreUtils;

const mountCache = new Map<string, MountFunc | undefined>();

function isRemoteApp(
  app: RemoteComposableApp | ComposableApp
): app is RemoteComposableApp {
  return !!(app as RemoteComposableApp).packageName;
}

export function useMount({ app }: UseMountArgs) {
  const context = useContext(HostContext);
  const appObject =
    typeof app === "function" ? app({ isSelfHosted: false }) : app;
  let mountKey: string;
  let url: string | undefined;
  let packageName: string | undefined;

  if (isRemoteApp(appObject)) {
    packageName = appObject.packageName;
    if (!context?.origin) {
      throw new Error(
        `origin prop is required in HostProvider to host a remote app`
      );
    }
    url = getRemoteUrl({
      origin: deleteTrailingSlash(context.origin),
      packageName,
    });
    mountKey = url;
  } else {
    mountKey = appObject.appName;
    mountCache.set(mountKey, appObject.mount);
  }

  const cachedMount = mountCache.get(mountKey);
  const runtime = useRuntime();
  const [mount = cachedMount, setMount] = useState();
  const [error, setError] = useState<Error>();
  const loadingMountKey = useRef<string>();

  useEffect(() => {
    if (!cachedMount && loadingMountKey.current !== mountKey) {
      if (!url || !packageName) {
        throw new Error(`packageName and URL are required for remote apps`);
      }
      loadingMountKey.current = mountKey;
      const remoteName = createRemoteName(packageName);
      loadScript(url)
        .then(() => loadModule(remoteName))
        .then(({ default: createComposableApp }) => {
          if (typeof createComposableApp !== "function") {
            setError(new Error("Remote module didn't return a function"));
          } else {
            const { mount: remoteMount } = createComposableApp({
              isSelfHosted: false,
            });

            setMount(() => remoteMount);
            mountCache.set(mountKey, remoteMount);
            loadingMountKey.current = undefined;
          }
        })
        .catch(setError);
    }

    return () => {
      setError(undefined);
      setMount(undefined);
    };
  }, [packageName, mountKey, url, cachedMount]);

  return { mount, error, url, runtime, setError };
}
