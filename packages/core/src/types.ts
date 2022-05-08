import type { CreateRuntime, Runtime } from "./runtime";

export interface CreateMicroOutput {
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

export interface MountOptions extends BasePath {
  runtime?: Runtime;
  onMicroNavigate?: OnNavigate;
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
export interface RunMicroOptions {
  isSelfHosted: boolean;
  initialState?: any;
}

export interface OnBeforeMountArgs {
  runtime?: Runtime;
  isSelfHosted: boolean;
  initialState?: any;
  saveInitialState: SaveInitialState;
  onBeforeUnmount: (callback: Cleanup) => void;
  onUnmounted: (callback: Cleanup) => void;
}

export type OnUnmounted = () => void;

type AppProps = Record<string, any>;
export interface CreateMicroConfig {
  createRuntime?: CreateRuntime;
  onBeforeMount?: (args: OnBeforeMountArgs) => AppProps;
}

export interface NavigationOptions {
  hash?: string;
  search?: string;
}

export type OnMicroNavigate = (
  nextPathname: string,
  options?: NavigationOptions
) => void;

export type Cleanup = () => void;
