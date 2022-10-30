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
  errorComponent?: ErrorComponent | null;
  className?: string;
}

export interface OuterHostProps extends BaseHostProps {
  app: GetComposableApp | GetComposableAppAsync;
}

export interface InnerHostProps extends BaseHostProps {
  mount: MountFunc;
  runtime: Runtime;
  url?: string;
  className?: string;
  setError: LogAnyError;
}

export type ErrorComponent = (props: { error: Error }) => React.ReactElement;

export interface UseMountArgs {
  app: GetComposableApp | ComposableApp;
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

export interface CreateAppConfig extends CreateAppCoreConfig {
  strict?: boolean;
}

export interface RootComponent {
  (props: { children: ReactElement }): ReactElement;
  displayName?: string;
}
