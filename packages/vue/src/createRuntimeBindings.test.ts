import { createApp } from "vue";
import { configureRuntime, GetRuntime } from "@leanjs/core";
import waitForExpect from "wait-for-expect";

import { createRuntimeBindings } from "./createRuntimeBindings";

const defaultState = {
  theme: "light",
  username: {
    current: "alex",
    previous: "alejandro",
  },
};

function onError(_error: Error) {
  // empty
}

const createRuntime = () => {
  // Vue will mutate the original defaultState so we need to deeply copy defaultState for each test
  // otherwise tests can affect each other
  const deeplyClonedDefaultState = JSON.parse(
    JSON.stringify(defaultState)
  ) as typeof defaultState;

  return configureRuntime(deeplyClonedDefaultState)({
    onError,
  }).createRuntime();
};

createRuntime.log = onError;

export const { useSharedState } = createRuntimeBindings(createRuntime);
type MyRuntime = GetRuntime<typeof createRuntime>;

interface WithSetupOptions {
  runtime?: MyRuntime | null;
}
export function withSetup<
  MyComposable extends (...args: any) => any,
  VueState extends ReturnType<MyComposable>
>(
  composable: () => VueState,
  { runtime = createRuntime() }: WithSetupOptions = {}
) {
  let vueState: VueState | undefined;
  const app = createApp({
    setup() {
      vueState = composable();

      return () => {
        // empty
      };
    },
  });
  app.provide("runtime", runtime);
  app.mount(document.createElement("div"));

  return { vueState, app, runtime };
}

describe("useSharedState:", () => {
  it("throws an error if no runtime is provided", () => {
    const warn = console.warn;
    console.warn = () => {
      // empty
    };

    expect(() => {
      withSetup(() => useSharedState(), {
        runtime: null,
      });
    }).toThrowError(
      "You must `provide` a `runtime` to the app at the root of the component tree"
    );
    console.warn = warn;
  });

  it("throws an error if useSharedState is called with no string or valid object", () => {
    const warn = console.warn;
    console.warn = () => {
      // empty
    };

    expect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      withSetup(() => useSharedState({ p: "asdf" }));
    }).toThrowError(
      "prop must be either a string or an object with the key prop"
    );
    console.warn = warn;
  });

  it("returns some state given a list of string arguments that map to state prop names", () => {
    const { vueState, app } = withSetup(() =>
      useSharedState("theme", "username")
    );

    expect(vueState?.theme.value).toEqual("light");
    expect(vueState?.username.value).toEqual({
      current: "alex",
      previous: "alejandro",
    });
    app?.unmount();
  });

  it("doesn't return state unless specified in the arguments", () => {
    const { vueState, app } = withSetup(() => useSharedState("theme"));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(vueState?.username?.value).toEqual(undefined);
    expect(vueState?.theme?.value).toEqual("light");
    app?.unmount();
  });

  it("watches some state given a list of string arguments that map to state prop names", async () => {
    const { vueState, app, runtime } = withSetup(() =>
      useSharedState("theme", "username")
    );

    expect(vueState?.theme.value).toEqual("light");
    expect(vueState?.username.value).toEqual({
      current: "alex",
      previous: "alejandro",
    });

    if (runtime) runtime.setState("theme", "dark");

    expect(vueState?.theme.value).toEqual("dark");

    app?.unmount();
  });

  it("returns some state given a list of object arguments that map to state prop names", () => {
    const { vueState, app } = withSetup(() =>
      useSharedState({ prop: "theme" }, { prop: "username" })
    );

    expect(vueState?.theme.value).toEqual("light");
    expect(vueState?.username.value).toEqual({
      current: "alex",
      previous: "alejandro",
    });

    app?.unmount();
  });

  it("watches some state given a list of object arguments that map to state prop names", () => {
    const { vueState, app, runtime } = withSetup(() =>
      useSharedState({ prop: "theme" }, { prop: "username" })
    );

    expect(vueState?.theme.value).toEqual("light");
    expect(vueState?.username.value).toEqual({
      current: "alex",
      previous: "alejandro",
    });

    if (runtime) runtime.setState("theme", "dark");

    expect(vueState?.theme.value).toEqual("dark");

    app?.unmount();
  });

  it("calls runtime subscribers if deep is false and the value that changed is a primitive type", async () => {
    const { vueState, app, runtime } = withSetup(() =>
      useSharedState({ prop: "theme", deep: false })
    );
    const random = Math.random().toString();
    const spyTheme = jest.fn();
    runtime?.subscribe("theme", spyTheme);

    if (vueState) vueState.theme.value = random;

    expect(vueState?.theme.value).toEqual(random);

    await waitForExpect(() => {
      expect(spyTheme).toHaveBeenCalledWith(random, false, undefined);
    });

    app?.unmount();
  });

  it("calls runtime subscribers if deep is not set and the value that changed is a primitive type ", async () => {
    const { vueState, app, runtime } = withSetup(() => useSharedState("theme"));
    const random = Math.random().toString();
    const spyTheme = jest.fn();
    runtime?.subscribe("theme", spyTheme);

    if (vueState) vueState.theme.value = random;

    expect(vueState?.theme.value).toEqual(random);

    await waitForExpect(() => {
      expect(spyTheme).toHaveBeenCalledWith(random, false, undefined);
    });

    app?.unmount();
  });

  it("deeply watches state given an object argument when its deep argument is true", async () => {
    const { vueState, app, runtime } = withSetup(() =>
      useSharedState({ prop: "username", deep: true })
    );
    const random = Math.random().toString();
    const spyUsername = jest.fn();
    runtime?.subscribe("username", spyUsername);

    expect(vueState?.username.value).toEqual({
      current: "alex",
      previous: "alejandro",
    });

    if (vueState) vueState.username.value.current = random;

    expect(vueState?.username.value.current).toEqual(random);

    await waitForExpect(() => {
      expect(spyUsername).toHaveBeenCalledWith(
        { current: random, previous: "alejandro" },
        false,
        undefined
      );
    });

    app?.unmount();
  });

  it("doesn't deeply watch state given an object argument when its deep value is false", async () => {
    const { vueState, app, runtime } = withSetup(() =>
      useSharedState({ prop: "username", deep: false })
    );
    const random = Math.random().toString();
    const spyUsername = jest.fn();
    if (!runtime) throw Error("No runtime found in test");
    runtime?.subscribe("username", spyUsername);

    expect(vueState?.username.value).toEqual({
      current: "alex",
      previous: "alejandro",
    });

    if (vueState) vueState.username.value.current = random;

    expect(vueState?.username.value.current).toEqual(random);

    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    expect(spyUsername).not.toHaveBeenCalled();

    app?.unmount();
  });

  it("doesn't deeply watch state given an object argument when its deep value is not set", async () => {
    const { vueState, app, runtime } = withSetup(() =>
      useSharedState({ prop: "username" })
    );
    const random = Math.random().toString();
    const spyUsername = jest.fn();
    if (!runtime) throw Error("No runtime found in test");
    runtime?.subscribe("username", spyUsername);

    expect(vueState?.username.value).toEqual({
      current: "alex",
      previous: "alejandro",
    });

    if (vueState) vueState.username.value.current = random;

    expect(vueState?.username.value.current).toEqual(random);

    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    expect(spyUsername).not.toHaveBeenCalled();

    app?.unmount();
  });

  it("doesn't deeply watch state given an object argument when its deep value is not set", async () => {
    const { vueState, app, runtime } = withSetup(() =>
      useSharedState({ prop: "theme" })
    );
    const random = Math.random().toString();
    if (!vueState) throw Error("No vueState found in test");

    expect(vueState?.theme.value).toEqual("light");

    vueState.theme.value = random;

    expect(vueState?.theme.value).toEqual(random);
    expect(runtime?.getState("theme")).toEqual("light");

    app?.unmount();
  });

  it("loads some state given an object argument that maps to a valid state prop with a load property set", async () => {
    const random = Math.random().toString();
    const { vueState, app, runtime } = withSetup(() =>
      useSharedState({
        prop: "theme",
        loader: () =>
          new Promise<string>((resolve) => {
            setTimeout(() => resolve(random), 1);
          }),
      })
    );

    expect(vueState?.theme.value).toEqual("light");

    await runtime?.loaded("theme");

    expect(vueState?.theme.value).toEqual(random);
    expect(runtime?.getState("theme")).toEqual(random);

    app?.unmount();
  });

  it("throws an error if state props that don't exist in the runtime are used", () => {
    const random = Math.random().toString();
    const warn = console.warn;
    console.warn = () => {
      // empty
    };

    expect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      withSetup(() => useSharedState(random));
    }).toThrowError();

    console.warn = warn;
  });

  it("calls the clean-up functions when the composable unmounts", () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Vue = require("vue");
    jest.spyOn(Vue, "watch");
    const runtime = createRuntime();
    const cleanup = jest.fn();
    runtime.subscribe = () => cleanup;
    const { vueState, app } = withSetup(
      () => useSharedState({ prop: "theme", deep: true }),
      {
        runtime,
      }
    );

    expect(vueState?.theme.value).toEqual("light");

    app?.unmount();

    expect(cleanup).toHaveBeenCalled();
    expect(Vue.watch).toHaveBeenCalled();

    Vue.watch.mockRestore();
  });
});
