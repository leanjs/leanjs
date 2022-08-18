import type { CreateRuntime, Runtime, GetRuntime } from "./runtime";

export interface BootstrapOutput {
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

export interface CreateComposableApp<
  MyCreateRuntime extends CreateRuntime = CreateRuntime
> {
  (options?: BootstrapOptions): CreateBootstrapOutput<MyCreateRuntime>;
  packageName: string;
}

export type ComposableAppInstance<MyRuntime extends Runtime> = {
  packageName: string;
  mount?: MountFunc<MyRuntime>;
};

export type ComposableApp<
  MyCreateRuntime extends CreateRuntime = CreateRuntime
> =
  | ComposableAppInstance<GetRuntime<MyCreateRuntime>>
  | CreateComposableApp<MyCreateRuntime>;

export type AsyncComposableApp<
  MyCreateRuntime extends CreateRuntime = CreateRuntime
> =
  | ComposableApp<MyCreateRuntime>
  | Promise<{ default: ComposableApp<MyCreateRuntime> }>;

export type CreateBootstrapOutput<MyCreateRuntime extends CreateRuntime> =
  ComposableAppInstance<GetRuntime<MyCreateRuntime>> & {
    createRuntime?: MyCreateRuntime;
  };

export interface MountFunc<MyRuntime extends Runtime = Runtime> {
  (element: HTMLElement | null, options: MountOptions<MyRuntime>): MountOutput;
}

type UdpateInitialState = (state: any) => void;
export interface BootstrapOptions {
  isSelfHosted?: boolean;
  initialState?: any;
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
  packageName: string;
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
  packageName: string;
  unmount: () => void;
  runtime?: MyRuntime;
  render: ({ appProps }: { appProps?: MyAppProps }) => void;
  isSelfHosted?: boolean;
  onBeforeMount?: (args: OnBeforeMountArgs<MyRuntime>) => MyAppProps;
  initialState?: any;
  cleanups?: Cleanup[];
  log?: (error: any) => void;
}

export interface AppProps {
  isSelfHosted?: boolean;
  [x: string]: any;
}
