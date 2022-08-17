import { useState, useEffect, useContext } from "react";

import type { MountFunc } from "@leanjs/core";
import { _ as CoreUtils } from "@leanjs/core";
import type { UseHostArgs } from "../types";
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

export function useHost({ app }: UseHostArgs) {
  const { packageName } = app;
  if (!packageName) {
    throw new Error(`Remote with no packageName can't be hosted`);
  }

  const context = useContext(HostContext);
  if (!context) {
    throw new Error(
      `No HostContext found in the component tree. Did you add a HostProvider?`
    );
  }

  let url = "";
  const name = createRemoteName(packageName);
  const mountKey = url + name;

  if (typeof app === "object") {
    // TODO make origin optional in HostProvider
    if (!context.origin) {
      throw new Error(`origin prop is required in HostProvider to host an app`);
    }
    const origin = deleteTrailingSlash(context.origin);
    url = getRemoteUrl({ origin, packageName });
  } else if (!mountCache.get(mountKey)) {
    mountCache.set(mountKey, app().mount);
  }

  const cachedMount = mountCache.get(mountKey);
  const runtime = useRuntime();
  const [mount = cachedMount, setMount] = useState();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (!cachedMount) {
      loadScript(url)
        .then(() => loadModule(name))
        .then(({ default: config }) => {
          if (typeof config !== "function") {
            setError(new Error("Remote module didn't return a function"));
          } else {
            const { mount: remoteMount } = config({
              isSelfHosted: false,
            });

            setMount(() => remoteMount);
            mountCache.set(mountKey, remoteMount);
          }
        })
        .catch(setError);
    }

    return () => {
      setError(undefined);
      setMount(undefined);
    };
  }, [name, mountKey, url, cachedMount]);

  return { mount, error, name, url, runtime };
}