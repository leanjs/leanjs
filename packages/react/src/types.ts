import type {
  Runtime,
  MountFunc,
  NavigateFunc,
  ListenFunc,
  BasePath,
  GetComposableAppAsync,
  GetComposableApp,
  ComposableApp,
  CreateAppConfig as CreateAppCoreConfig,
  LogAnyError,
  RemoteProp,
  UnmountFunc,
  Cleanup,
} from "@leanjs/core";
import type { ReactElement } from "react";

export type { AppProps } from "@leanjs/core";
export interface MountProps extends BasePath {
  mount: MountFunc;
  runtime: Runtime;
  navigate?: NavigateFunc;
  listen?: ListenFunc;
  className?: string;
  setError: LogAnyError;
}

export interface BaseHostProps {
  className?: string;
}

export interface OuterHostProps extends BaseHostProps {
  app: GetComposableApp | GetComposableAppAsync;
  remote?: RemoteProp;
}

export type MountComponent = (props: MountProps) => JSX.Element | null;
export interface InnerHostProps extends BaseHostProps {
  mount: MountFunc;
  Mount: MountComponent;
  runtime: Runtime;
  url?: string;
  className?: string;
  setError: LogAnyError;
  remote?: RemoteProp;
}

export interface UseMountArgs {
  app: GetComposableApp | ComposableApp;
}

export interface HostProviderProps<BaseRuntime extends Runtime = Runtime> {
  origin?: string;
  runtime: BaseRuntime;
  children: ReactElement | ReactElement[];
}

export interface CreateAppConfig extends CreateAppCoreConfig {
  strict?: boolean;
}

export interface RootComponent {
  (props: {
    children: ReactElement;
    onRendered: () => Cleanup | void;
  }): ReactElement;
  displayName?: string;
}

export interface ReactRoot {
  unmount: UnmountFunc;
  render: (element: ReactElement) => void;
}
