import type { CreateRuntime } from "./runtime";

export interface ConfigMicroOptions {
  isDev: boolean;
  isSelfHosted: boolean;
}

export interface CreateMicroOutput {
  mount: any; // TODO replace any with proper types
  createRuntime: CreateRuntime;
}
