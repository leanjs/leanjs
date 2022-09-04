import type { Runtime, LogAnyError } from "./runtime";

export type RemoteTarget = "browser" | "node";
export interface BasePath {
  pathname?: string;
  basename?: string;
}

export interface NavigationOptions {
  hash?: string;
  search?: string;
}

export type UnmountFunc = () => void;

export type OnNavigate = (location: Location) => void;

export interface MountOptions<MyRuntime extends Runtime = Runtime>
  extends BasePath {
  runtime?: MyRuntime;
  onRemoteNavigate?: OnNavigate;
  initialState?: any;
}

export type NavigateFunc = (location: Location) => void;

export type RemoveListener = () => void;

export type ListenFunc = (listener: Listener) => RemoveListener | undefined;

export type Action = "POP" | "PUSH" | "REPLACE";

export interface Listener {
  (update: NavigationUpdate): void;
}

export interface NavigationUpdate {
  action: Action;
  location: Location;
}

export interface Location {
  pathname: string;
  search?: string;
  hash?: string;
}

export interface MountOutput {
  unmount: UnmountFunc;
  onHostNavigate?: OnNavigate;
}
export interface CreateComposableApp {
  (options?: CreateComposableAppOptions): ComposableApp;
  packageName: string;
}

export type ComposableApp = {
  packageName: string;
  mount?: MountFunc;
};

export type ComposableAppSync = ComposableApp | CreateComposableApp;

export type ComposableAppAsync = () => Promise<{ default: ComposableAppSync }>;
export interface MountFunc<MyRuntime extends Runtime = Runtime> {
  (element: HTMLElement | null, options: MountOptions<MyRuntime>): MountOutput;
}

type UdpateInitialState = (state: any) => void;

export interface CreateComposableAppOptions {
  isSelfHosted?: boolean;
}
export interface CreateAppConfig {
  packageName: string;
}
export interface NavigationOptions {
  hash?: string;
  search?: string;
}

export type OnRemoteNavigate = (
  nextPathname: string,
  options?: NavigationOptions
) => void;

export type Cleanup = () => void;

export type CreateMount = (args: CreateMountArgs) => MountOutput;

interface CreateMountRenderArgs {
  appProps?: AppProps;
  logScopedError: LogAnyError;
}
export interface CreateMountArgs {
  el: HTMLElement | null;
  packageName: string;
  unmount: () => void;
  render: ({ appProps, logScopedError }: CreateMountRenderArgs) => void;
  isSelfHosted: boolean | undefined;
  initialState: any;
  onError: LogAnyError | undefined;
  cleanups?: Cleanup[];
}

export interface AppProps {
  isSelfHosted: boolean;
  initialState: any;
  updateInitialState: UdpateInitialState;
  [x: string]: any;
}
