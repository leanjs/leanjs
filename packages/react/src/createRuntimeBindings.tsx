import { useCallback, useEffect, useState } from "react";
import type {
  Runtime as BaseRuntime,
  KeyOf,
  CreateRuntimeArgs,
} from "@leanjs/runtime";

import { useGenericRuntime, RuntimeProvider } from "./RuntimeProvider";
import type { RuntimeProviderComp } from "./types";

type CreateRuntime = (args: CreateRuntimeArgs<any>) => BaseRuntime;

export const createRuntimeBindings = <
  MyCreateRuntime extends CreateRuntime = CreateRuntime,
  MyRuntime extends ReturnType<MyCreateRuntime> = ReturnType<MyCreateRuntime>
>(
  createRuntime: MyCreateRuntime // arg only used to infer Runtime type
) => {
  const useRuntime = () => useGenericRuntime() as MyRuntime;

  const useGetter = <
    Prop extends KeyOf<MyRuntime["state"]> = KeyOf<MyRuntime["state"]>
  >(
    prop: Prop,
    loader?: () => MyRuntime["state"][Prop] | Promise<MyRuntime["state"][Prop]>
  ) => {
    const runtime = useRuntime();
    if (loader) runtime.load(prop, loader);
    const [value, setLocalState] = useState(runtime.state[prop]);

    useEffect(
      () =>
        runtime.subscribe(prop, (nextValue) => {
          setLocalState(nextValue);
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

  const useLoader = <Prop extends KeyOf<MyRuntime["state"]>>(prop: Prop) => {
    const runtime = useRuntime();
    const [error, setLocalError] = useState(runtime.loader[prop].error);
    const [loading, setLocalLoading] = useState(runtime.loader[prop].loading);

    useEffect(
      () =>
        runtime.subscribe(prop, (_, nextLoading, nextError) => {
          setLocalLoading(nextLoading);
          setLocalError(nextError);
        }),
      [runtime]
    );

    return [loading, error];
  };

  return {
    useGetter,
    useSetter,
    useLoader,
    useRuntime,
    RuntimeProvider: RuntimeProvider as RuntimeProviderComp<MyRuntime>,
  };
};
