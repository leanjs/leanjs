import React, { ReactElement, useEffect, useContext, useState } from "react";
import { _ as CoreUtils, MountFunc } from "@leanjs/core";

import type { OuterHostProps, InnerHostProps } from "../types";
import { HostContext } from "../private/HostProvider";

import { useRuntime } from "../runtime";
import { Mount } from "./Mount";

const { loadApp, isRemoteApp } = CoreUtils;

export function createHost<Props extends OuterHostProps = OuterHostProps>(
  Component: <ComponentProps extends InnerHostProps>(
    props: ComponentProps
  ) => ReactElement
) {
  const lazyMap = new Map<OuterHostProps["app"] | string, any>();

  return function Host({ app, remote, ...rest }: Props) {
    const context = useContext(HostContext);
    const runtime = useRuntime();
    const [error, setError] = useState<Error>();
    const [showChild, setShowChild] = useState(false);
    const version = remote?.version;
    const appKey = isRemoteApp(app) ? `${app.packageName}${version}` : app;

    if (error) {
      throw error;
    }

    function HostWrapper(mount: MountFunc, url?: string) {
      return (
        <Component
          {...rest}
          Mount={Mount}
          url={url}
          setError={setError}
          mount={mount}
          runtime={runtime}
        />
      );
    }

    useEffect(() => {
      setShowChild(true);
    }, []);

    if (!showChild) {
      return null;
    }

    if (!lazyMap.has(appKey)) {
      lazyMap.set(
        appKey,
        React.lazy(() =>
          loadApp<ReactElement>({ app, remote, version, context, HostWrapper })
        )
      );
    }
    const HostApp = lazyMap.get(appKey);

    return <HostApp />;
  };
}
