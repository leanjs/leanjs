import React, { ReactElement, useEffect, useState } from "react";
import type { ComposableApp } from "@leanjs/core";
import { _ as CoreUtils } from "@leanjs/core";

import type { HostProps, AsyncHostProps } from "../types";
import { DefaultError } from "./DefaultError";

const { isPromise } = CoreUtils;

export const useAppResolver = (
  Host: (props: HostProps) => ReactElement,
  props: AsyncHostProps
): ReactElement => {
  const {
    app,
    errorComponent: ErrorComponent = DefaultError,
    fallback = <>...</>,
  } = props;
  const isAppPromise = isPromise(app);
  const defaultApp = !isAppPromise ? app : undefined;
  const [loading, setLoading] = useState(isAppPromise);
  const [resolvedApp, setResolvedApp] = useState<ComposableApp>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (isPromise(app)) {
      app
        .then(({ default: resolvedApp }) => {
          setResolvedApp(() => resolvedApp);
          setLoading(false);
        })
        .catch(setError);
    }
  }, [app]);

  return loading ? (
    fallback
  ) : resolvedApp ? (
    <Host {...props} app={resolvedApp} />
  ) : defaultApp ? (
    <Host {...props} app={defaultApp} />
  ) : (
    <ErrorComponent
      error={error || new Error("It couldn't resolve app promise")}
    />
  );
};
