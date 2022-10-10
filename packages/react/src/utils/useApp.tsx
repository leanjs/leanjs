import React, { ReactElement, useEffect, useState } from "react";
import type { GetComposableApp } from "@leanjs/core";
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
  const maybeAsyncApp =
    typeof app === "function" ? app({ isSelfHosted: false }) : app;
  const isAppAsync = isPromise(maybeAsyncApp);
  const composableApp = isAppAsync ? undefined : maybeAsyncApp;
  const [loading, setLoading] = useState(isAppAsync);
  const [resolvedApp, setResolvedApp] = useState<GetComposableApp>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (isAppAsync) {
      maybeAsyncApp
        .then(({ default: resolvedApp }) => {
          setResolvedApp(() => resolvedApp);
          setLoading(false);
        })
        .catch(setError);
    }
  }, [maybeAsyncApp, isAppAsync]);

  return loading ? (
    fallback
  ) : resolvedApp || composableApp ? (
    <Host {...props} app={resolvedApp! || composableApp!} />
  ) : (
    <ErrorComponent error={error!} />
  );
};
