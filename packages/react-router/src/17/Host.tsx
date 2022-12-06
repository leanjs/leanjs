import {
  OuterReactRouterHostProps,
  ReactRouterHost,
} from "../components/ReactRouterHost";
import { _ as ReactUtils } from "@leanjs/react/17";

const { createHost } = ReactUtils;

export const Host = createHost<OuterReactRouterHostProps>(ReactRouterHost);
