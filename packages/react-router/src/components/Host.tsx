import React from "react";
import { _ as ReactUtils, CreateHostProps } from "@leanjs/react";
import type { AsyncHostProps } from "@leanjs/react";
import { useNavigate } from "react-router-dom";
import { useListen } from "./UniversalRouter";

const { createHost, Mount } = ReactUtils;

interface BaseReactRouterProps {
  basename?: string;
  pathname?: string;
}

interface ReactRouterHostProps extends BaseReactRouterProps, AsyncHostProps {}

export const Host = createHost<ReactRouterHostProps>(ReactRouterHost);

interface CreateReactRouterHostProps
  extends BaseReactRouterProps,
    CreateHostProps {}

function ReactRouterHost({
  basename = "/",
  ...rest
}: CreateReactRouterHostProps) {
  return (
    <Mount
      {...rest}
      navigate={useNavigate()}
      listen={useListen()}
      basename={basename}
    />
  );
}
