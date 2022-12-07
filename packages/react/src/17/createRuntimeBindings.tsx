import { useCallback, useEffect, useState } from "react";
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
  ) => {
    const runtime = useRuntime();

    if (loader) runtime.state.load(prop, loader, runtime.context);
    const [value, setValue] = useState<GetState<MyRuntime>[Prop]>(
      runtime.state.get(prop)
    );

    useEffect(
      () =>
        runtime.state.listen(prop, (nextValue) => {
          setValue(nextValue);
        }),
      [runtime]
    );

    return value;
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
    const [loading, setLoading] = useState(runtime.state.loader[prop].loading);

    useEffect(
      () =>
        runtime.state.listen(prop, (_, nextLoading) => {
          setLoading(nextLoading);
        }),
      [runtime]
    );

    return loading;
  };

  const useError = <Prop extends KeyOf<State>>(prop: Prop) => {
    const runtime = useRuntime();
    const [error, setError] = useState(runtime.state.loader[prop].error);

    useEffect(
      () =>
        runtime.state.listen(prop, (_, __, nextError) => {
          setError(nextError);
        }),
      [runtime]
    );

    return error;
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
