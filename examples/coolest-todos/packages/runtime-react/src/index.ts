import { createRuntimeBindings } from "@leanjs/react";
import { createRuntime } from "@my-org/runtime-shared";

export { createRuntime };

export const {
  useGetter,
  useSetter,
  useLoading,
  useError,
  useRuntime,
  RuntimeProvider,
} = createRuntimeBindings(createRuntime);
