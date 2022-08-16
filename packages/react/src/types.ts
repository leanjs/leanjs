import type {
  Runtime,
  MountFunc,
  NavigateFunc,
  ListenFunc,
  BasePath,
  ComposableApp,
} from "@leanjs/core";
import type { ReactElement } from "react";

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
  loadingComponent?: LoadingComponent;
  className?: string;
}

export type ErrorComponent = (props: { error: Error }) => React.ReactElement;
export type LoadingComponent = () => React.ReactElement;

export interface UseHostArgs {
  app: ComposableApp;
}

export interface HostContextValues {
  origin: string;
  errorComponent?: ErrorComponent;
  loadingComponent?: LoadingComponent;
}

export interface HostProviderProps<BaseRuntime extends Runtime = Runtime> {
  origin: string;
  errorComponent?: ErrorComponent;
  loadingComponent?: LoadingComponent;
  runtime: BaseRuntime;
  children: ReactElement | ReactElement[];
}
