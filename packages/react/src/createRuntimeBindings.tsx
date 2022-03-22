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

  const useGetter = (prop: KeyOf<MyRuntime["state"]>) => {
    const runtime = useRuntime();
    const [value, setLocalState] = useState(runtime.state[prop]);
    const [error, setLocalError] = useState(runtime.loader[prop].error);
    const [loading, setLocalLoading] = useState(runtime.loader[prop].loading);

    useEffect(
      () =>
        runtime.subscribe(prop, (nextValue, nextLoading, nextError) => {
          setLocalState(nextValue);
          setLocalLoading(nextLoading);
          setLocalError(nextError);
        }),
      [runtime]
    );

    return [value, loading, error];
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

  return {
    useGetter,
    useSetter,
    useRuntime,
    RuntimeProvider: RuntimeProvider as RuntimeProviderComp<MyRuntime>,
  };
};
