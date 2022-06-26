import type { CreateRuntime, Runtime, GetRuntime } from "./runtime";

export interface CreateRemoteOutput {
  mount: MountFunc;
  createRuntime: CreateRuntime;
}

export interface BasePath {
  pathname?: string;
  basename?: string;
}

export interface NavigationOptions {
  hash?: string;
  search?: string;
}

export type UnmountFunc = () => void;

export type OnNavigate = (path: Path) => void;

export interface MountOptions<MyRuntime extends Runtime = Runtime>
  extends BasePath {
  runtime?: MyRuntime;
  onRemoteNavigate?: OnNavigate;
}

export type NavigateFunc = (location: Path) => void;

export type RemoveListener = () => void;

export type ListenFunc = (listener: Listener) => RemoveListener | undefined;

export type Action = "POP" | "PUSH" | "REPLACE";

export interface Listener {
  (update: NavigationUpdate): void;
}

export interface NavigationUpdate {
  action: Action;
  location: Path;
}

export interface Path {
  pathname: string;
  search?: string;
  hash?: string;
}

export interface MountOutput {
  unmount: UnmountFunc;
  onHostNavigate?: OnNavigate;
}

export type MountFunc = (
  element: HTMLElement | null,
  options: MountOptions
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

export type ConfigureMount = <MyAppProps extends AppProps = AppProps>(
  args: ConfigureMountArgs<MyAppProps>
) => MountOutput;

export interface ConfigureMountArgs<MyAppProps extends AppProps> {
  el: HTMLElement;
  appName: string;
  unmount: () => void;
  runtime: any;
  basename?: string;
  pathname?: string;
  setInitialPath: (initialPath: string) => void;
  render: ({ appProps }: { appProps: MyAppProps }) => void;
  isSelfHosted: boolean;
  onBeforeMount: any;
  initialState?: any;
  cleanups: Cleanup[];
}

export interface AppProps {
  isSelfHosted?: boolean;
  [x: string]: any;
}
