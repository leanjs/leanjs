import { _ } from "@leanjs/core";
import React from "react";

import type { HostProps, AsyncHostProps } from "./types";
import { useMount, Mount, DefaultError, useApp } from "./utils";

export const Host = (props: AsyncHostProps) => useApp(ReactHost, props);

function ReactHost({
  app,
  fallback = <>...</>,
  errorComponent: ErrorComponent = DefaultError,
  ...rest
}: HostProps) {
  const { mount, runtime, error, setError } = useMount({ app });
  const throwErrors = ErrorComponent === null;

  if (error) {
    if (throwErrors) {
      throw error;
    }
    return <ErrorComponent error={error} />;
  } else if (mount) {
    return (
      <Mount {...rest} setError={setError} mount={mount} runtime={runtime} />
    );
  } else {
    return fallback;
  }
}
