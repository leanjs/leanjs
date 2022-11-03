import React, { useCallback, useRef, useEffect } from "react";
import { _ as ReactUtils } from "@leanjs/react";
import type { OuterHostProps, InnerHostProps } from "@leanjs/react";
import { useNavigate, useLocation } from "react-router-dom";

import type { NavigationListener } from "@leanjs/core";
const { createHost, Mount } = ReactUtils;

interface BaseReactRouterHostProps {
  basename?: string;
}

interface OuterReactRouterHostProps
  extends OuterHostProps,
    BaseReactRouterHostProps {}

interface InnerReactRouterHostProps
  extends InnerHostProps,
    BaseReactRouterHostProps {}

export const Host = createHost<OuterReactRouterHostProps>(ReactRouterHost);

function ReactRouterHost({
  basename = "/",
  ...rest
}: InnerReactRouterHostProps) {
  const location = useLocation();
  const pathname = useRef(location.pathname.replace(basename, "/")).current;
  const navigate = useCallback(useNavigate(), []); // https://github.com/remix-run/react-router/issues/7634
  const listener = useRef<NavigationListener>();
  const listen = useCallback((navigationListener: NavigationListener) => {
    listener.current = navigationListener;
    return () => {
      listener.current = undefined;
    };
  }, []);

  useEffect(() => {
    listener.current?.({ action: "PUSH", location });
  }, [location]);

  return (
    <Mount
      {...rest}
      pathname={pathname}
      basename={basename}
      navigate={navigate}
      listen={listen}
    />
  );
}
