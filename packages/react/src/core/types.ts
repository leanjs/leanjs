import type {
  Runtime,
  MountFunc,
  NavigateFunc,
  ListenFunc,
  BasePath,
} from "@leanjs/core";
import type { ReactElement } from "react";

export interface MountProps extends BasePath {
  mount: MountFunc;
  runtime: Runtime;
  navigate?: NavigateFunc;
  listen?: ListenFunc;
  className?: string;
}

export interface AppProps {
  isSelfHosted?: boolean;
}

export type MicroApp = (props: AppProps) => ReactElement;
