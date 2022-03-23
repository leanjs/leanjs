import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useGenericRuntime } from "@leanjs/react";

import { useDynamicScript } from "./useDynamicScript";
import { Loader } from "./Loader";

// 🔥 this code is is not production ready, no error handling, no perf optimizations, etc

const mountCache = new Map<string, Function>();

const CreateRoot = React.memo(function CreateRoot({
  mount,
}: {
  mount: Function;
}) {
  const ref = useRef();
  const runtime = useGenericRuntime();

  useLayoutEffect(() => {
    const { unmount } = mount(ref.current, { runtime });

    return unmount;
  }, [ref.current, runtime]);

  return <div ref={ref} />;
});

export function MountMicroFrontend({ url, name }) {
  const mountKey = url + name;
  const cachedMount = mountCache.get(mountKey);
  const [mount = cachedMount, setMount] = useState();
  const { ready } = useDynamicScript({ url });

  useEffect(() => {
    if (ready && !mount) {
      loadModule(name).then(({ mount: remoteMount }) => {
        setMount(() => remoteMount);
        mountCache.set(mountKey, remoteMount);
      });
    }
  }, [url, ready]);

  return mount ? <CreateRoot mount={mount} /> : <Loader />;
}

async function loadModule(scope: string, module = "./Index") {
  const container = (window as Record<string, any>)?.[scope];
  if (!container?.init || !container?.get) return null;

  await __webpack_init_sharing__("default");
  await container.init(__webpack_share_scopes__.default);
  const factory = await container.get(module);
  const Module = factory();
  return Module;
}

declare const __webpack_init_sharing__: (arg0: string) => Promise<void>;
declare const __webpack_share_scopes__: { default: any };
