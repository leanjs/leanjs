import React, { ReactElement, useEffect, useRef, useState } from "react";
import type { GetComposableApp, GetComposableAppAsync } from "@leanjs/core";
import { _ as CoreUtils } from "@leanjs/core";

import type { HostProps, AsyncHostProps } from "../types";
import { DefaultError } from "./DefaultError";

const { isPromise } = CoreUtils;

const cache = new WeakMap();

export const useApp = (
  Host: (props: HostProps) => ReactElement,
  props: AsyncHostProps
): ReactElement => {
  const {
    app,
    errorComponent: ErrorComponent = DefaultError,
    fallback = <>...</>,
  } = props;
  const maybeAsyncApp =
    typeof app === "function" ? app({ isSelfHosted: false }) : app;
  const asyncApp = isPromise(maybeAsyncApp) ? maybeAsyncApp : undefined;
  const syncApp = asyncApp ? undefined : maybeAsyncApp;
  const [resolvedApp = cache.get(app), setResolvedApp] = useState();
  const [error, setError] = useState<Error>();
  const loadingApp = useRef<GetComposableApp | (() => GetComposableAppAsync)>();

  useEffect(() => {
    if (asyncApp && !loadingApp.current && !resolvedApp) {
      loadingApp.current = app;
      asyncApp
        .then((module) => {
          cache.set(app, module.default);
          setResolvedApp(() => cache.get(app));
          loadingApp.current = undefined;
        })
        .catch((error) => {
          loadingApp.current = undefined;
          setError(error);
        });
    }

    return () => {
      setError(undefined);
    };
  }, [asyncApp, resolvedApp, loadingApp, app]);

  if (error) {
    if (ErrorComponent === null) {
      throw error;
    }
    return <ErrorComponent error={error} />;
  } else if (syncApp || resolvedApp) {
    return <Host {...props} app={syncApp || resolvedApp} />;
  } else {
    return fallback;
  }
};
