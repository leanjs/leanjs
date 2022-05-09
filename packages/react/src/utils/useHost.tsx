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
  defaultOrigin,
} = CoreUtils;

const mountCache = new Map<string, MountFunc>();

export function useHost({ remote }: UseHostArgs) {
  const { packageName } = remote;
  const context = useContext(HostContext);
  if (!context) {
    throw new Error(
      `No HostContext found in the component tree. Did you add a HostProvider?`
    );
  }

  const origin = deleteTrailingSlash(context.origin ?? defaultOrigin);
  const url = getRemoteUrl({ origin, packageName });
  const runtime = useRuntime();
  const name = createRemoteName(packageName);
  const mountKey = url + name;
  const cachedMount = mountCache.get(mountKey);
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
