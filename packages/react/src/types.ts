import type {
  Runtime,
  MountFunc,
  NavigateFunc,
  ListenFunc,
  BasePath,
  ComposableApp,
} from "@leanjs/core";
import type { ReactElement } from "react";

export type Fallback = ReactElement | string;
export interface MountProps extends BasePath {
  mount: MountFunc;
  runtime: Runtime;
  navigate?: NavigateFunc;
  listen?: ListenFunc;
  className?: string;
}

export interface HostProps {
  app: ComposableApp;
  errorComponent?: ErrorComponent;
  fallback?: Fallback;
  className?: string;
}

export type ErrorComponent = (props: { error: Error }) => React.ReactElement;

export interface UseHostArgs {
  app: ComposableApp;
}

export interface HostContextValues {
  origin: string;
  errorComponent?: ErrorComponent;
  fallback?: Fallback;
}

export interface HostProviderProps<BaseRuntime extends Runtime = Runtime> {
  origin: string;
  errorComponent?: ErrorComponent;
  fallback?: Fallback;
  runtime: BaseRuntime;
  children: ReactElement | ReactElement[];
}
