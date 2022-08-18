import React from "react";

import type { HostProps } from "./types";
import { useHost, Mount, DefaultError } from "./utils";

export function Host({
  app,
  fallback = "...",
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
