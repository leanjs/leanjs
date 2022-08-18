import React from "react";

import type { HostProps, AsyncHostProps } from "./types";
import { useHost, Mount, DefaultError, useAppResolver } from "./utils";

export const Host = (props: AsyncHostProps) => useAppResolver(ReactHost, props);

function ReactHost({
  app,
  fallback = <>...</>,
  errorComponent: ErrorComponent = DefaultError,
  ...rest
}: HostProps) {
  const { mount, error, runtime } = useHost({ app });

  return mount ? (
    <Mount {...rest} mount={mount} runtime={runtime} />
  ) : error ? (
    <ErrorComponent error={error} />
  ) : (
    fallback
  );
}
