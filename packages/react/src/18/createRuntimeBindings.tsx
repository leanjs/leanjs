declare module "react" {
  export function useSyncExternalStore<Snapshot>(
    subscribe: (onStoreChange: () => void) => () => void,
    getSnapshot: () => Snapshot,
    getServerSnapshot?: () => Snapshot
  ): Snapshot;
}

import { useCallback, useSyncExternalStore } from "react";
import type { ReactElement } from "react";
import type { KeyOf, CreateRuntime, StateType, GetState } from "@leanjs/core";

import { HostProvider } from "../private/HostProvider";
import type { HostProviderProps } from "../types";
import { useRuntime as useBaseRuntime } from "../core/RuntimeProvider";

export type CreateRuntimeBindings = typeof createRuntimeBindings;

export const createRuntimeBindings = <
  MyCreateRuntime extends CreateRuntime = CreateRuntime,
  MyRuntime extends ReturnType<MyCreateRuntime> = ReturnType<MyCreateRuntime>
>(
  _createRuntime: MyCreateRuntime // arg only used to infer Runtime type
) => {
  type State = GetState<MyRuntime>;

  const useRuntime = () => useBaseRuntime() as MyRuntime;

  const useGetter = <Prop extends KeyOf<State>>(
    prop: Prop,
    loader?: () =>
      | GetState<MyRuntime>[Prop]
      | Promise<GetState<MyRuntime>[Prop]>
  ): State[Prop] => {
    const runtime = useRuntime();
    if (loader) runtime.state.load(prop, loader, runtime.context);
    const getSnapshot = () => runtime.state.get(prop) as State[Prop];

    return useSyncExternalStore(
      (callback) => runtime.state.listen(prop, callback),
      getSnapshot,
      getSnapshot
    );
  };

  const useSetter = <Prop extends KeyOf<State>>(prop: Prop) => {
    const runtime = useRuntime();

    return useCallback(
      (value: StateType<MyRuntime>[Prop]) => {
        runtime.state.set(prop, value);
      },
      [runtime]
    );
  };

  const useLoading = <Prop extends KeyOf<State>>(prop: Prop) => {
    const runtime = useRuntime();
    const getSnapshot = () => runtime.state.loader[prop].loading;

    return useSyncExternalStore(
      (callback) => runtime.state.listen(prop, callback),
      getSnapshot,
      getSnapshot
    );
  };

  const useError = <Prop extends KeyOf<State>>(prop: Prop) => {
    const runtime = useRuntime();
    const getSnapshot = () => runtime.state.loader[prop].error;

    return useSyncExternalStore(
      (callback) => runtime.state.listen(prop, callback),
      getSnapshot,
      getSnapshot
    );
  };

  return {
    useGetter,
    useSetter,
    useLoading,
    useError,
    useRuntime,
    HostProvider: HostProvider as (
      props: HostProviderProps<MyRuntime>
    ) => ReactElement,
  };
};
