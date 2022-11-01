import React from "react";
import { _ as ReactUtils } from "@leanjs/react";
import type { OuterHostProps, InnerHostProps } from "@leanjs/react";
import { useNavigate } from "react-router-dom";
import { useListen } from "./UniversalRouter";

const { createHost, Mount } = ReactUtils;

interface BaseReactRouterHostProps {
  basename?: string;
  pathname?: string;
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
  const navigate = useNavigate();
  const listen = useListen();

  return (
    <Mount {...rest} basename={basename} navigate={navigate} listen={listen} />
  );
}
