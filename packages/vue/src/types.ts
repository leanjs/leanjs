import type { KeyOf, BaseShape } from "@leanjs/core";

export type Cleanups = () => void;

export interface StatePropArgs<
  State extends BaseShape,
  Prop extends KeyOf<State> = KeyOf<State>
> {
  prop: Prop;
  loader?: () => State[Prop] | Promise<State[Prop]>;
  deep?: boolean;
}
