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
  onError: LogAnyError;
}

export type NavigateFunc = (location: Location) => void;

export type RemoveListener = () => void;

export type ListenFunc = (
  listener: NavigationListener
) => RemoveListener | undefined;

export type Action = "POP" | "PUSH" | "REPLACE";

export interface NavigationListener {
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

export interface ComposableApp {
  appName: string;
  mount: MountFunc;
}

export interface RemoteComposableApp {
  packageName: string;
}

export interface CreateComposableAppOptions {
  isSelfHosted?: boolean;
}

export interface CreateComposableApp {
  (options?: CreateComposableAppOptions): ComposableApp;
  appName: string;
}

export interface GetComposableAppAsync {
  (): Promise<{
    default: GetComposableApp;
  }>;
  appName?: string;
}

export type GetComposableApp = RemoteComposableApp | CreateComposableApp;

export interface MountFunc<MyRuntime extends Runtime = Runtime> {
  (element: HTMLElement | null, options: MountOptions<MyRuntime>): MountOutput;
}

type UdpateInitialState = (state: any) => void;

export interface CreateAppConfig {
  appName?: string;
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
}
export interface CreateMountArgs {
  el: HTMLElement | null;
  appName: string;
  unmount: () => void;
  render: (args: CreateMountRenderArgs) => void;
  isSelfHosted: boolean | undefined;
  initialState: any;
  onError: LogAnyError;
  cleanups?: Cleanup[];
}

export interface AppProps {
  isSelfHosted: boolean;
  initialState: any;
  updateInitialState: UdpateInitialState;
}
