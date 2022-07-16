import { inject, onUnmounted, ref, watch, toRaw, Ref } from "vue";
import type {
  Runtime as BaseRuntime,
  KeyOf,
  CreateRuntime,
} from "@leanjs/core";

import type { Cleanups, StatePropArgs } from "./types";
import { isPrimitive, shallowCopy } from "./utils";

export const createRuntimeBindings = <
  MyCreateRuntime extends CreateRuntime = CreateRuntime,
  MyRuntime extends ReturnType<MyCreateRuntime> = ReturnType<MyCreateRuntime>,
  State extends MyRuntime["state"] = MyRuntime["state"]
>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _createRuntime: MyCreateRuntime // arg only used to infer Runtime type
) => {
  const useSharedState = <Prop extends KeyOf<State> = KeyOf<State>>(
    ...props: Prop[] | StatePropArgs<State, Prop>[]
  ) => {
    const cleanups: Cleanups[] = [];
    const runtime = inject<MyRuntime>("runtime");
    const vueState = {} as { [P in Prop]: Ref<State[P]> };
    if (!runtime) {
      throw new Error(
        "You must `provide` a `runtime` to the app at the root of the component tree"
      );
    }
    props.forEach((prop) => {
      let propName: Prop;
      let deep = false;
      if (typeof prop === "string") {
        propName = prop;
      } else if (isPropObj(prop)) {
        propName = prop.prop;
        if (prop.loader) {
          runtime.load(propName, prop.loader);
        }
        deep = !!prop.deep;
      } else {
        throw new Error(
          `prop must be either a string or an object with the key prop`
        );
      }
      // It uses a `ref` for each state prop instead of `reactive(vueState)` so state can be destructured
      vueState[propName] = ref(runtime.state[propName]);
      if (deep || isPrimitive(runtime.state[propName])) {
        // ref( runtime.state[propName] ) adds a proxy recursively to each property of runtime.state[propName]
        // so any property in any level of runtime.state[propName] will change when that property changes in vueState[propName].
        // However, if the change is not at the root of runtime.state[propName] then runtime.state subscribers won't be called
        cleanups.push(
          // watch returns an unwatch function
          watch(
            vueState[propName],
            function syncState(newValue) {
              const rawValue = toRaw(newValue);
              // If runtime.state[propName] === rawValue then runtime doesn't calls its subscribers
              if (rawValue === runtime.state[propName] && deep) {
                // newValue was mutated, meaning a deep value changed in newValue but the reference to newValue didn't.
                // Therefore, we need to change the reference to newValue so that runtime is aware of the change
                vueState[propName].value = shallowCopy(rawValue);
                // Assigning vueState[propName].value triggers the syncState watch function again,
                // so we don't set runtime.state in this branch to avoid an infinite loop
              } else {
                // Update runtime state with the new value so runtime subscribers are called
                runtime.state[propName] = rawValue;
              }
            },
            { deep }
          )
        );
      }
      cleanups.push(
        // Runtime returns a unsubscribe function
        runtime.subscribe(propName, (value) => {
          // If vueState[propName].value === toRaw(value) then Vue bails out of setting the value
          vueState[propName].value = value as State[Prop];
        })
      );
    });
    // We call all the clean-up functions when the composable unmounts
    onUnmounted(() => cleanups.forEach((cleanup) => cleanup()));

    return vueState;
  };

  return {
    useSharedState,
  };
};

export const isPropObj = <Runtime extends BaseRuntime>(
  prop: any
): prop is StatePropArgs<Runtime["state"]> => !!prop.prop;
