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
  [x: string]: any;
}

export interface HostProps {
  remote: { packageName: string };
  errorComponent?: ErrorComponent;
  loadingComponent?: LoadingComponent;
  className?: string;
  pathname?: string;
}

export type ErrorComponent = (props: { error: Error }) => React.ReactElement;
export type LoadingComponent = () => React.ReactElement;

export interface Remote {
  packageName: string;
}

export interface UseHostArgs {
  remote: Remote;
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
