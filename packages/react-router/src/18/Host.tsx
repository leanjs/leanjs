import { _ as ReactUtils } from "@leanjs/react/18";

import {
  OuterReactRouterHostProps,
  ReactRouterHost,
} from "../components/ReactRouterHost";

const { createHost } = ReactUtils;

export const Host = createHost<OuterReactRouterHostProps>(ReactRouterHost);
