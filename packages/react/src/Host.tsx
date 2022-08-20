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
  const { mount, error, runtime } = useMount({ app });

  return mount ? (
    <Mount {...rest} mount={mount} runtime={runtime} />
  ) : error ? (
    <ErrorComponent error={error} />
  ) : (
    fallback
  );
}
