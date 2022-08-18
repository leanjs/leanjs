import React from "react";
import { _ as ReactUtils } from "@leanjs/react";
import type { HostProps, AsyncHostProps } from "@leanjs/react";
import { useNavigate } from "react-router-dom";
import { useListen } from "./UniversalRouter";

const { useHost, Mount, DefaultError, useAppResolver } = ReactUtils;

interface BaseReactRouterHostProps {
  basename?: string;
  pathname?: string;
}

interface AsyncReactRouterHostProps
  extends BaseReactRouterHostProps,
    AsyncHostProps {}

export const Host = (props: AsyncReactRouterHostProps) =>
  useAppResolver(ReactRouterHost, props);

interface ReactRouterHostProps extends BaseReactRouterHostProps, HostProps {}

function ReactRouterHost({
  app,
  basename = "/",
  fallback = <>...</>,
  errorComponent: ErrorComponent = DefaultError,
  ...rest
}: ReactRouterHostProps) {
  const navigate = useNavigate();
  const { mount, error, runtime } = useHost({ app });
  const listen = useListen();

  return mount ? (
    <Mount
      {...rest}
      mount={mount}
      navigate={navigate}
      listen={listen}
      basename={basename}
      runtime={runtime}
    />
  ) : error ? (
    <ErrorComponent error={error} />
  ) : (
    fallback
  );
}
