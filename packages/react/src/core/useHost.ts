import { useState, useEffect } from "react";
import type { MountFunc } from "@leanjs/core";
import { loadModule, loadScript, createValidJSVarName } from "@leanjs/core";

const mountCache = new Map<string, MountFunc>();

export interface Remote {
  packageName: string;
}

export interface UseHostArgs {
  src: string;
  remote: Remote;
}

export function useHost({ src, remote }: UseHostArgs) {
  const { packageName } = remote;
  const url = src;
  const name = createValidJSVarName(packageName);
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
              // TODO is this process.env in the final build that the browser runs?
              isDev: process.env.NODE_ENV === "development",
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

  return { mount, error, name };
}
