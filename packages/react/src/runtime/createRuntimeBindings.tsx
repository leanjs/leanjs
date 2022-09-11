import { useCallback, useEffect, useState } from "react";
import type { ReactElement } from "react";
import type { KeyOf, CreateRuntime, StateType } from "@leanjs/core";

import { HostProvider } from "../private/HostProvider";
import type { HostProviderProps } from "../types";
import { useRuntime as useBaseRuntime } from "./RuntimeProvider";

export const createRuntimeBindings = <
  MyCreateRuntime extends CreateRuntime = CreateRuntime,
  MyRuntime extends ReturnType<MyCreateRuntime> = ReturnType<MyCreateRuntime>
>(
  _createRuntime: MyCreateRuntime // arg only used to infer Runtime type
) => {
  const useRuntime = () => useBaseRuntime<MyRuntime>();

  const useGetter = <Prop extends KeyOf<MyRuntime["loader"]>>(
    prop: Prop,
    loader?: () =>
      | MyRuntime["loader"][Prop]
      | Promise<MyRuntime["loader"][Prop]>
  ) => {
    const runtime = useRuntime();
    if (loader) runtime.load(prop, loader);
    const [value, setValue] = useState<StateType<MyRuntime>[Prop]>(
      runtime.getState(prop)
    );

    useEffect(
      () =>
        runtime.subscribe(prop, (nextValue) => {
          setValue(nextValue);
        }),
      [runtime]
    );

    return value;
  };

  const useSetter = <Prop extends KeyOf<MyRuntime["loader"]>>(prop: Prop) => {
    const runtime = useRuntime();

    return useCallback(
      (value: StateType<MyRuntime>[Prop]) => {
        runtime.setState(prop, value);
      },
      [runtime]
    );
  };

  const useLoading = <Prop extends KeyOf<MyRuntime["loader"]>>(prop: Prop) => {
    const runtime = useRuntime();
    const [loading, setLoading] = useState(runtime.loader[prop].loading);

    useEffect(
      () =>
        runtime.subscribe(prop, (_, nextLoading) => {
          setLoading(nextLoading);
        }),
      [runtime]
    );

    return loading;
  };

  const useError = <Prop extends KeyOf<MyRuntime["loader"]>>(prop: Prop) => {
    const runtime = useRuntime();
    const [error, setError] = useState(runtime.loader[prop].error);

    useEffect(
      () =>
        runtime.subscribe(prop, (_, __, nextError) => {
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
