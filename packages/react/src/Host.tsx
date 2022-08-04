import React from "react";

import type { HostProps } from "./types";
import { useHost, Mount, DefaultLoading, DefaultError } from "./utils";

export function Host({
  remote,
  loadingComponent: LoadingComponent = DefaultLoading,
  errorComponent: ErrorComponent = DefaultError,
  ...rest
}: HostProps) {
  const { mount, error, runtime } = useHost({ remote });

  return mount ? (
    <Mount {...rest} mount={mount} runtime={runtime} />
  ) : error ? (
    <ErrorComponent error={error} />
  ) : (
    <LoadingComponent />
  );
}
