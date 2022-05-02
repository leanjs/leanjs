import type { ConfigMicroOptions } from "@leanjs/core";
// TODO move runtime to core?
import type { CreateRuntime } from "@leanjs/runtime";

// TODO type the following propery and move it to @leanjs/core
interface CreateMicroOutput {
  mount: any; // TODO replace any with proper types
  createRuntime: CreateRuntime;
}

export default function (options: ConfigMicroOptions): CreateMicroOutput {}
