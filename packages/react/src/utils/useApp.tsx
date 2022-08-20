import React, { ReactElement, useEffect, useState } from "react";
import type { ComposableApp } from "@leanjs/core";
import { _ as CoreUtils } from "@leanjs/core";

import type { HostProps, AsyncHostProps } from "../types";
import { DefaultError } from "./DefaultError";

const { isPromise } = CoreUtils;

export const useApp = (
  Host: (props: HostProps) => ReactElement,
  props: AsyncHostProps
): ReactElement => {
  const {
    app,
    errorComponent: ErrorComponent = DefaultError,
    fallback = <>...</>,
  } = props;
  const myApp = typeof app === "function" ? app() : app;
  const isMyAppPromise = isPromise(myApp);
  const noPromiseApp = isMyAppPromise ? undefined : myApp;
  const [loading, setLoading] = useState(isMyAppPromise);
  const [resolvedApp, setResolvedApp] = useState<ComposableApp>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (isMyAppPromise) {
      myApp
        .then(({ default: resolvedApp }) => {
          setResolvedApp(() => resolvedApp);
          setLoading(false);
        })
        .catch(setError);
    }
  }, [myApp, isMyAppPromise]);

  return loading ? (
    fallback
  ) : resolvedApp || noPromiseApp ? (
    <Host {...props} app={resolvedApp! || noPromiseApp!} />
  ) : (
    <ErrorComponent error={error!} />
  );
};
