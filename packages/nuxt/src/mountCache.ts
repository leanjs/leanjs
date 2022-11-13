import type { GetComposableApp, GetComposableAppAsync } from "@leanjs/core";

export default new Map<
  string | GetComposableApp | GetComposableAppAsync,
  any
>();
