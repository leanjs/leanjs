import React, { useCallback } from "react";
import { _ as ReactUtils } from "@leanjs/react";
import type { HostProps } from "@leanjs/react";
import type { NavigationUpdate } from "@leanjs/core";
import { useNavigate } from "react-router-dom";
import { useListen } from "./UniversalRouter";

const { useHost, Mount, DefaultLoading, DefaultError } = ReactUtils;

interface ReactRouterHostProps extends HostProps {
  basename?: string;
}

export function Host({
  remote,
  pathname,
  basename = "/",
  className,
  loadingComponent: LoadingComponent = DefaultLoading,
  errorComponent: ErrorComponent = DefaultError,
}: ReactRouterHostProps) {
  const navigate = useNavigate();
  const { mount, error, runtime } = useHost({ remote });
  const listen = useListen();
  const myNavigate = useCallback(({ location }: NavigationUpdate) => {
    navigate(location);
  }, []);

  return mount ? (
    <Mount
      mount={mount}
      navigate={myNavigate}
      listen={listen}
      basename={basename}
      className={className}
      pathname={pathname}
      runtime={runtime}
    />
  ) : error ? (
    <ErrorComponent error={error} />
  ) : (
    <LoadingComponent />
  );
}
