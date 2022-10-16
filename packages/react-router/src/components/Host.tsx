import React from "react";
import { _ as ReactUtils } from "@leanjs/react";
import type { HostProps, AsyncHostProps } from "@leanjs/react";
import { useNavigate } from "react-router-dom";
import { useListen } from "./UniversalRouter";

const { useMount, Mount, DefaultError, useApp } = ReactUtils;

interface BaseReactRouterHostProps {
  basename?: string;
  pathname?: string;
}

interface AsyncReactRouterHostProps
  extends BaseReactRouterHostProps,
    AsyncHostProps {}

export const Host = (props: AsyncReactRouterHostProps) =>
  useApp(ReactRouterHost, props);

interface ReactRouterHostProps extends BaseReactRouterHostProps, HostProps {}

function ReactRouterHost({
  app,
  basename = "/",
  fallback = <>...</>,
  errorComponent: ErrorComponent = DefaultError,
  ...rest
}: ReactRouterHostProps) {
  const navigate = useNavigate();
  const { mount, runtime, error, setError } = useMount({ app });
  const listen = useListen();
  const throwErrors = ErrorComponent === null;

  if (error) {
    if (throwErrors) {
      throw error;
    }
    return <ErrorComponent error={error} />;
  } else if (mount) {
    return (
      <Mount
        {...rest}
        setError={setError}
        mount={mount}
        navigate={navigate}
        listen={listen}
        basename={basename}
        runtime={runtime}
      />
    );
  } else {
    return fallback;
  }
}
