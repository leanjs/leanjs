import { createRuntimeBindings } from "@leanjs/react/18";
import { createRuntime } from "@art-boards/runtime-shared";

export { createRuntime };

export const {
  useGetter,
  useSetter,
  useLoading,
  useError,
  useRuntime,
  HostProvider,
} = createRuntimeBindings(createRuntime);
