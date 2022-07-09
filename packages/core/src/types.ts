import type { CreateRuntime, Runtime, GetRuntime } from "./runtime";

export interface CreateRemoteOutput {
  mount: MountFunc;
  createRuntime: CreateRuntime;
}

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

export type MountFunc<MyRuntime extends Runtime = Runtime> = (
  element: HTMLElement | null,
  options: MountOptions<MyRuntime>
) => MountOutput;

type UdpateInitialState = (state: any) => void;
export interface RunRemoteOptions {
  isSelfHosted: boolean;
  initialState?: any;
  appName: string;
}

export interface OnBeforeMountArgs<MyRuntime extends Runtime> {
  runtime?: MyRuntime;
  isSelfHosted: boolean;
  initialState?: any;
  updateInitialState: UdpateInitialState;
  onBeforeUnmount: (callback: Cleanup) => void;
  onUnmounted: (callback: Cleanup) => void;
}

export type OnUnmounted = () => void;

export interface CreateRemoteConfig<
  MyCreateRuntime extends CreateRuntime = CreateRuntime,
  MyAppProps extends AppProps = AppProps
> {
  createRuntime?: MyCreateRuntime;
  onBeforeMount?: (
    args: OnBeforeMountArgs<GetRuntime<MyCreateRuntime>>
  ) => MyAppProps;
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

export type ConfigureMount = <
  MyCreateRuntime extends CreateRuntime,
  MyAppProps extends AppProps
>(
  args: ConfigureMountArgs<GetRuntime<MyCreateRuntime>, MyAppProps>
) => MountOutput;

export interface ConfigureMountArgs<
  MyRuntime extends Runtime,
  MyAppProps extends AppProps
> {
  el: HTMLElement | null;
  appName: string;
  unmount: () => void;
  runtime?: MyRuntime;
  render: ({ appProps }: { appProps?: MyAppProps }) => void;
  isSelfHosted: boolean;
  onBeforeMount?: (args: OnBeforeMountArgs<MyRuntime>) => MyAppProps;
  initialState?: any;
  cleanups: Cleanup[];
  log?: (error: any) => void;
}

export interface AppProps {
  isSelfHosted?: boolean;
  [x: string]: any;
}
