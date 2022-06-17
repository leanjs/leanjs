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

export type OnNavigate = (
  nextPathname: string,
  options?: NavigationOptions
) => void;

export interface MountOptions<MyRuntime extends Runtime = Runtime>
  extends BasePath {
  runtime?: MyRuntime;
  onRemoteNavigate?: OnNavigate;
}

export type NavigateFunc = (arg: NavigationUpdate) => void;

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

export type MountFunc = (
  element: HTMLElement | null,
  options: MountOptions
) => {
  unmount: UnmountFunc;
  onHostNavigate?: OnNavigate;
};

type SaveInitialState = (state: any) => void;
export interface RunRemoteOptions {
  isSelfHosted: boolean;
  initialState?: any;
}

export interface OnBeforeMountArgs<MyRuntime extends Runtime> {
  runtime?: MyRuntime;
  isSelfHosted: boolean;
  initialState?: any;
  saveInitialState: SaveInitialState;
  onBeforeUnmount: (callback: Cleanup) => void;
  onUnmounted: (callback: Cleanup) => void;
}

export type OnUnmounted = () => void;

type AppProps = Record<string, any>;
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
