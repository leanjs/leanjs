import { useCallback, useEffect, useState } from "react";
import type { ReactElement } from "react";
import type { KeyOf, CreateRuntime, StateType } from "@leanjs/core";

import { HostProvider } from "../private/HostProvider";
import type { HostProviderProps } from "../types";
import { useRuntime as useBaseRuntime } from "./RuntimeProvider";
import { Host } from "../components";

export const createRuntimeBindings = <
  MyCreateRuntime extends CreateRuntime = CreateRuntime,
  MyRuntime extends ReturnType<MyCreateRuntime> = ReturnType<MyCreateRuntime>
>(
  _createRuntime: MyCreateRuntime // arg only used to infer Runtime type
) => {
  const useRuntime = () => useBaseRuntime<MyRuntime>();

  const useGetter = <Prop extends KeyOf<MyRuntime["state"]["loader"]>>(
    prop: Prop,
    loader?: () =>
      | MyRuntime["state"]["loader"][Prop]
      | Promise<MyRuntime["state"]["loader"][Prop]>
  ) => {
    const runtime = useRuntime();
    if (loader) runtime.state.load(prop, loader);
    const [value, setValue] = useState<StateType<MyRuntime>[Prop]>(
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

  const useSetter = <Prop extends KeyOf<MyRuntime["state"]["loader"]>>(
    prop: Prop
  ) => {
    const runtime = useRuntime();

    return useCallback(
      (value: StateType<MyRuntime>[Prop]) => {
        runtime.state.set(prop, value);
      },
      [runtime]
    );
  };

  const useLoading = <Prop extends KeyOf<MyRuntime["state"]["loader"]>>(
    prop: Prop
  ) => {
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

  const useError = <Prop extends KeyOf<MyRuntime["state"]["loader"]>>(
    prop: Prop
  ) => {
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
