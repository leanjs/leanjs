import type {
  Runtime,
  MountFunc,
  NavigateFunc,
  ListenFunc,
  BasePath,
  ComposableAppAsync,
  ComposableAppSync,
  ComposableApp,
} from "@leanjs/core";
import type { ReactElement } from "react";

export type { AppProps } from "@leanjs/core";
export interface MountProps extends BasePath {
  mount: MountFunc;
  runtime: Runtime;
  navigate?: NavigateFunc;
  listen?: ListenFunc;
  className?: string;
}

export interface BaseHostProps {
  errorComponent?: ErrorComponent;
  fallback?: ReactElement;
  className?: string;
}

export interface AsyncHostProps extends BaseHostProps {
  app: ComposableAppAsync | ComposableAppSync;
}

export interface HostProps extends BaseHostProps {
  app: ComposableApp;
}

export type ErrorComponent = (props: { error: Error }) => React.ReactElement;

export interface UseHostArgs {
  app: ComposableAppSync;
}

export interface HostContextValues {
  origin?: string;
  errorComponent?: ErrorComponent;
  fallback?: ReactElement;
}

export interface HostProviderProps<BaseRuntime extends Runtime = Runtime> {
  origin?: string;
  errorComponent?: ErrorComponent;
  fallback?: ReactElement;
  runtime: BaseRuntime;
  children: ReactElement | ReactElement[];
}
