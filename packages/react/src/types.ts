import type { ReactNode } from "react";
import type {
  Runtime as BaseRuntime,
  CreateRuntimeArgs,
} from "@leanjs/runtime";

type CreateRuntime = (args: CreateRuntimeArgs<any>) => BaseRuntime;

export interface RuntimeProviderProps<Runtime extends BaseRuntime> {
  children: ReactNode;
  runtime: Runtime;
}

export type RuntimeProviderComp<Runtime extends BaseRuntime = BaseRuntime> = ({
  children,
  runtime,
}: RuntimeProviderProps<Runtime>) => JSX.Element;

export type GetRuntime<MyCreateRuntime extends CreateRuntime> =
  ReturnType<MyCreateRuntime>;
