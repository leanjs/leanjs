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

export interface RemoteProp {
  version: string;
}
export interface OuterHostProps extends BaseHostProps {
  app: GetComposableApp | GetComposableAppAsync;
  remote?: RemoteProp;
}

export interface InnerHostProps extends BaseHostProps {
  mount: MountFunc;
  runtime: Runtime;
  url?: string;
  className?: string;
  setError: LogAnyError;
  remote?: RemoteProp;
}

export interface UseMountArgs {
  app: GetComposableApp | ComposableApp;
}

export interface HostContextValues {
  origin?: string;
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
  (props: { children: ReactElement }): ReactElement;
  displayName?: string;
}
