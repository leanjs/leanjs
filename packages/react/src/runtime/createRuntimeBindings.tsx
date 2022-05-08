import { useCallback, useEffect, useState, ReactElement } from "react";
import type { KeyOf, CreateRuntime } from "@leanjs/core";

import { useBaseRuntime, BaseRuntimeProvider } from "./RuntimeProvider";

export const createRuntimeBindings = <
  MyCreateRuntime extends CreateRuntime = CreateRuntime,
  MyRuntime extends ReturnType<MyCreateRuntime> = ReturnType<MyCreateRuntime>
>(
  _createRuntime: MyCreateRuntime // arg only used to infer Runtime type
) => {
  const useRuntime = () => useBaseRuntime() as MyRuntime;

  const useGetter = <
    Prop extends KeyOf<MyRuntime["state"]> = KeyOf<MyRuntime["state"]>
  >(
    prop: Prop,
    loader?: () => MyRuntime["state"][Prop] | Promise<MyRuntime["state"][Prop]>
  ) => {
    const runtime = useRuntime();
    if (loader) runtime.load(prop, loader);
    const [value, setValue] = useState<MyRuntime["state"][Prop]>(
      runtime.state[prop]
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

  const useSetter = <Prop extends KeyOf<MyRuntime["state"]>>(prop: Prop) => {
    const runtime = useRuntime();

    return useCallback(
      (value: MyRuntime["state"][Prop]) => {
        runtime.state[prop] = value;
      },
      [runtime]
    );
  };

  const useLoading = <Prop extends KeyOf<MyRuntime["state"]>>(prop: Prop) => {
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

  const useError = <Prop extends KeyOf<MyRuntime["state"]>>(prop: Prop) => {
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
    RuntimeProvider: BaseRuntimeProvider as (props: {
      children: ReactElement;
      runtime: MyRuntime;
    }) => ReactElement,
  };
};
