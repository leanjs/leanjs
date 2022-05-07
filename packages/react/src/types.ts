import type { ReactNode } from "react";
import type { Runtime as BaseRuntime } from "@leanjs/core";

export interface RuntimeProviderProps<Runtime extends BaseRuntime> {
  children: ReactNode;
  runtime: Runtime;
}

export type RuntimeProviderComp<Runtime extends BaseRuntime = BaseRuntime> = ({
  children,
  runtime,
}: RuntimeProviderProps<Runtime>) => JSX.Element;
