import waitForExpect from "wait-for-expect";

import { configureRuntime } from "./runtime";
import { isPromise, setRuntimeContext } from "../utils";
import type { RuntimeApi } from "./types";
import { AppError } from "..";
import { RuntimeContext } from ".";

const emptyFunction = () => {
  // empty
};
interface SharedState {
  locale: string;
  token?: string;
  user?: {
    username: string;
  };
}

const defaultState: SharedState = {
  locale: "en",
  token: undefined,
  user: undefined,
};

class FakeGQLClient {}

class FakeFirebase {
  constructor(token: string) {
    // empty
  }
  public toString = (): string => `FakeFirebase`;
}

class FakeEventEmitter {
  callback?: (value: string) => void;
  on(callback: (value: string) => void) {
    this.callback = callback;

    return emptyFunction;
  }
  emit(value: string) {
    this.callback?.(value);
  }
}

const fetchToken = () =>
  new Promise<string>((resolve) =>
    setTimeout(() => resolve(Math.random().toString()), 5)
  );

const eventEmitter = new FakeEventEmitter();

const { createRuntime } = configureRuntime<SharedState>(defaultState)({
  onError: emptyFunction,
  apiFactory: {
    eventEmitter: () => eventEmitter,
    gql: () => new Promise((resolve) => resolve(new FakeGQLClient())),
    firebase: ({ state }) =>
      new Promise<FakeFirebase>((resolve) => {
        state
          .load("token", fetchToken, { appName: "configureRuntime" })
          .then((token) => {
            if (token) resolve(new FakeFirebase(token));
          });
      }),
  },
});

describe("createRuntime", () => {
  it(`returns a runtime when it's invoked`, async () => {
    const apiFactory = { a: () => Promise.resolve(1) };
    const defaultLoader = {
      loading: false,
      error: undefined,
    };
    const { createRuntime } = configureRuntime(defaultState)({
      onError: emptyFunction,
      apiFactory,
    });

    const runtime = createRuntime({ context: { appName: "ShellApp" } });
    expect(runtime.state.get("locale")).toEqual(defaultState.locale);
    expect(runtime.state.get("user")).toEqual(defaultState.user);
    expect(runtime.state.get("token")).toEqual(defaultState.token);
    expect(runtime.state.loader.locale).toEqual(defaultLoader);
    expect(runtime.state.loader.user).toEqual(defaultLoader);
    expect(runtime.state.loader.token).toEqual(defaultLoader);
    expect(typeof runtime.state.load).toBe("function");
    expect(typeof runtime.state.loaded).toBe("function");
    expect(typeof runtime.state.listen).toBe("function");
    expect(typeof runtime.logError).toBe("function");
    expect(typeof runtime.cleanup).toBe("function");
    expect(typeof runtime.api).toBe("object");
  });

  it(`can receive some initial state that overrides the default state`, () => {
    const { createRuntime } = configureRuntime<SharedState>(defaultState)({
      onError: emptyFunction,
    });
    const username = Math.random().toString();

    const runtime = createRuntime({
      context: { appName: "ShellApp" },
      initialState: { ...defaultState, user: { username } },
    });

    expect(runtime.state.get("user")?.username).toBe(username);
  });

  it(`returns a runtime that exposes a logError function that accepts an Error argument with options`, async () => {
    const onError = jest.fn();
    const runtimeVersion = Math.random().toString();
    const { createRuntime } = configureRuntime<SharedState>(defaultState)({
      onError,
      version: runtimeVersion,
    });
    const appName = Math.random().toString();
    const customVersion = Math.random().toString();
    const runtime = createRuntime({ context: { appName: "ShellApp" } });

    const error = new Error(Math.random().toString());
    runtime.logError(error, {
      appName,
      version: customVersion,
    });

    expect(onError).toHaveBeenCalledWith(error, {
      appName,
      version: customVersion,
      state: runtime.state,
    });
  });

  it(`returns a runtime that exposes a logError function that accepts an Error argument with appName and version its name`, async () => {
    let assertError: AppError | undefined;
    let assertOptions: RuntimeContext | undefined;
    const onError = (err: AppError, options?: RuntimeContext) => {
      assertError = err;
      assertOptions = options;
    };
    const runtimeVersion = Math.random().toString();
    const { createRuntime } = configureRuntime<SharedState>(defaultState)({
      onError,
      version: runtimeVersion,
    });
    const appName = Math.random().toString();
    const customVersion = Math.random().toString();
    const runtime = createRuntime({ context: { appName: "ShellApp" } });
    const error = new Error(Math.random().toString());
    runtime.logError(error, {
      appName,
      version: customVersion,
    });

    expect(assertOptions?.appName).toBe(appName);
    expect(assertOptions?.version).toBe(customVersion);
    expect(assertError?.appName).toBe(appName);
    expect(assertError?.version).toBe(customVersion);
    expect(assertError?.name).toBe(`Error::${appName}::${customVersion}`);
  });

  describe("given a parent runtime", () => {
    describe("createRuntime", () => {
      it(`can chain multiple runtimes`, async () => {
        const { createRuntime: createGrandparentRuntime } = configureRuntime(
          defaultState
        )({
          onError: emptyFunction,
        });

        const { createRuntime: createParentRuntime } = configureRuntime(
          defaultState
        )({
          onError: emptyFunction,
        });

        const { createRuntime: createChildRuntime } = configureRuntime(
          defaultState
        )({
          onError: emptyFunction,
        });

        const { createRuntime: createGrandchildRuntime } = configureRuntime(
          defaultState
        )({
          onError: emptyFunction,
        });

        const grandparentRuntime = createGrandparentRuntime({
          context: { appName: "ShellApp" },
        });
        const parentRuntime = createParentRuntime({
          runtime: grandparentRuntime,
          context: { appName: "ShellApp" },
        });
        const childRuntime = createChildRuntime({
          context: { appName: "ShellApp" },
          runtime: parentRuntime,
        });
        const grandchildRuntime = createGrandchildRuntime({
          context: { appName: "ShellApp" },
          runtime: childRuntime,
        });

        const childRandomToken = Math.random().toString();
        childRuntime.state.set("token", childRandomToken);

        expect(grandparentRuntime.state.get("token")).toBe(childRandomToken);
        expect(parentRuntime.state.get("token")).toBe(childRandomToken);
        expect(childRuntime.state.get("token")).toBe(childRandomToken);
        expect(grandchildRuntime.state.get("token")).toBe(childRandomToken);
      });
    });

    describe("api", () => {
      it(`calls the parent runtime api instead of the child runtime api if the parent runtime has that api`, async () => {
        const parentFirebase = jest.fn();
        const childFirebase = jest.fn();

        const { createRuntime: createParentRuntime } = configureRuntime({
          token: "",
        })({
          onError: emptyFunction,
          apiFactory: {
            firebase: () =>
              new Promise<FakeFirebase>((resolve) => {
                resolve({ toString: parentFirebase });
              }),
          },
        });

        const { createRuntime: createChildRuntime } = configureRuntime({
          token: "",
          locale: "en",
        })({
          onError: emptyFunction,
          apiFactory: {
            firebase: () =>
              new Promise<FakeFirebase>((resolve) => {
                resolve({ toString: childFirebase });
              }),
          },
        });

        const parentRuntime = createParentRuntime({
          context: { appName: "ShellApp" },
        });
        const childRuntime = createChildRuntime({
          runtime: parentRuntime,
          context: { appName: "ShellApp" },
        });

        (await childRuntime.api.firebase).toString();

        expect(parentFirebase).toHaveBeenCalled();
        expect(childFirebase).not.toHaveBeenCalled();
      });
    });

    describe("state", () => {
      it("throws an Error if an invalid state prop is used", () => {
        const { createRuntime: createParentRuntime } = configureRuntime({
          token: "",
        })({
          onError: emptyFunction,
        });

        const { createRuntime: createChildRuntime } = configureRuntime({
          token: "",
          locale: "en",
        })({
          onError: emptyFunction,
        });

        const parentRuntime = createParentRuntime({
          context: { appName: "ShellApp" },
        });
        const childRuntime = createChildRuntime({
          context: { appName: "ShellApp" },
          runtime: parentRuntime,
        });

        let errorMessage;

        try {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          childRuntime.state.get("invalid_prop");
        } catch (error: any) {
          errorMessage = error.message;
        }

        expect(errorMessage).toBe(`"invalid_prop" is not a valid state prop.
Did you forget to set "invalid_prop" to a value in your defaultState (including null or undefined) when calling configureState function?
Current valid props are: token, locale`);
      });

      describe("set", () => {
        it("sets the value of a state prop in the parent runtime if the parent runtime has that state prop", () => {
          const { createRuntime: createParentRuntime } = configureRuntime({
            token: "",
          })({
            onError: emptyFunction,
          });

          const { createRuntime: createChildRuntime } = configureRuntime({
            token: "",
            locale: "en",
          })({
            onError: emptyFunction,
          });

          const parentRuntime = createParentRuntime({
            context: { appName: "ShellApp" },
          });
          const childRuntime = createChildRuntime({
            context: { appName: "ShellApp" },
            runtime: parentRuntime,
          });

          const childRandomToken = Math.random().toString();
          childRuntime.state.set("token", childRandomToken);

          expect(parentRuntime.state.get("token")).toBe(childRandomToken);
        });
      });

      describe("get", () => {
        it("returns state from the parent runtime given a state prop if the parent runtime has that state prop", () => {
          const { createRuntime: createParentRuntime } = configureRuntime({
            token: "",
          })({
            onError: emptyFunction,
          });

          const { createRuntime: createChildRuntime } = configureRuntime({
            token: Math.random().toString() + "default state for child token",
            locale: "en",
          })({
            onError: emptyFunction,
          });

          const parentRandomToken = Math.random().toString();
          const parentRuntime = createParentRuntime({
            context: { appName: "ShellApp" },
            initialState: { token: parentRandomToken },
          });
          const childRuntime = createChildRuntime({
            context: { appName: "ShellApp" },
            runtime: parentRuntime,
          });

          expect(childRuntime.state.get("token")).toBe(parentRandomToken);
        });
      });

      describe("listen", () => {
        it(`calls parent listeners when child runtime changes`, async () => {
          const { createRuntime: createParentRuntime } = configureRuntime({
            locale: "en",
          })({
            onError: emptyFunction,
            apiFactory: {
              eventEmitter: () => eventEmitter,
            },
          });

          const parentRuntime = createParentRuntime({
            context: { appName: "ShellApp" },
          });
          const parentLocaleCallback = jest.fn();
          parentRuntime.state.listen("locale", parentLocaleCallback);

          const childRuntime = createRuntime({
            context: { appName: "ShellApp" },
            runtime: parentRuntime,
          });
          const randomString = Math.random().toString();
          childRuntime.state.set("locale", randomString);

          expect(parentLocaleCallback).toBeCalledWith(
            randomString,
            false,
            undefined
          );
        });

        it(`calls child listeners when child runtime changes`, async () => {
          const { createRuntime: createParentRuntime } = configureRuntime({
            locale: "en",
          })({
            onError: emptyFunction,
            apiFactory: {
              eventEmitter: () => eventEmitter,
            },
          });

          const parentRuntime = createParentRuntime({
            context: { appName: "ShellApp" },
          });
          const localeCallback = jest.fn();

          const childRuntime = createRuntime({
            context: { appName: "ShellApp" },
            runtime: parentRuntime,
          });
          childRuntime.state.listen("locale", localeCallback);
          const randomString = Math.random().toString();
          childRuntime.state.set("locale", randomString);

          expect(localeCallback).toBeCalledWith(randomString, false, undefined);
        });

        it(`calls child listeners when parent runtime changes`, async () => {
          const { createRuntime: createParentRuntime } = configureRuntime({
            locale: "en",
          })({
            onError: emptyFunction,
            apiFactory: {
              eventEmitter: () => eventEmitter,
            },
          });

          const parentRuntime = createParentRuntime({
            context: { appName: "ShellApp" },
          });

          const localeCallback = jest.fn();
          const childRuntime = createRuntime({
            context: { appName: "ShellApp" },
            runtime: parentRuntime,
          });
          childRuntime.state.listen("locale", localeCallback);

          const randomString = Math.random().toString();
          parentRuntime.state.set("locale", randomString);

          expect(localeCallback).toBeCalledWith(randomString, false, undefined);
        });

        it(`calls child and parent listeners when child and parent runtime change`, async () => {
          const { createRuntime: createParentRuntime } = configureRuntime({
            locale: "en",
          })({
            onError: emptyFunction,
            apiFactory: {
              eventEmitter: () => eventEmitter,
            },
          });

          const parentRuntime = createParentRuntime({
            context: { appName: "ShellApp" },
          });
          const parentLocaleCallback = jest.fn();
          parentRuntime.state.listen("locale", parentLocaleCallback);

          const childRuntime = createRuntime({
            context: { appName: "ShellApp" },
            runtime: parentRuntime,
          });
          const childLocaleCallback = jest.fn();
          childRuntime.state.listen("locale", childLocaleCallback);

          const randomString1 = Math.random().toString();
          childRuntime.state.set("locale", randomString1);

          expect(parentLocaleCallback).toHaveBeenCalledWith(
            randomString1,
            false,
            undefined
          );
          expect(childLocaleCallback).toHaveBeenCalledWith(
            randomString1,
            false,
            undefined
          );

          const randomString2 = Math.random().toString();
          childRuntime.state.set("locale", randomString2);

          expect(parentLocaleCallback).toHaveBeenLastCalledWith(
            randomString2,
            false,
            undefined
          );
          expect(childLocaleCallback).toHaveBeenLastCalledWith(
            randomString2,
            false,
            undefined
          );
        });

        it(`unubscribes child and parent listeners`, async () => {
          const { createRuntime: createParentRuntime } = configureRuntime({
            locale: "en",
          })({
            onError: emptyFunction,
            apiFactory: {
              eventEmitter: () => eventEmitter,
            },
          });

          const parentRuntime = createParentRuntime({
            context: { appName: "ShellApp" },
          });
          const parentLocaleCallback = jest.fn();
          const unsubscribeFromParent = parentRuntime.state.listen(
            "locale",
            parentLocaleCallback
          );

          const childRuntime = createRuntime({
            context: { appName: "ShellApp" },
            runtime: parentRuntime,
          });
          const childLocaleCallback = jest.fn();
          const unsubscribeFromChild = childRuntime.state.listen(
            "locale",
            childLocaleCallback
          );

          unsubscribeFromParent();
          const randomString1 = Math.random().toString();
          childRuntime.state.set("locale", randomString1);

          expect(parentLocaleCallback).not.toHaveBeenCalled();
          expect(childLocaleCallback).toHaveBeenCalledWith(
            randomString1,
            false,
            undefined
          );

          unsubscribeFromChild();
          const randomString2 = Math.random().toString();
          childRuntime.state.set("locale", randomString2);

          expect(parentLocaleCallback).not.toHaveBeenCalled();
          childLocaleCallback.mockReset();
          expect(childLocaleCallback).not.toHaveBeenCalled();
        });
      });

      describe("loader", () => {
        it("is loading true for a given state prop while either runtime load function is working and it is false before and after", async () => {
          const { createRuntime: createParentRuntime } = configureRuntime(
            defaultState
          )({
            onError: emptyFunction,
          });

          const { createRuntime: createChildRuntime } = configureRuntime(
            defaultState
          )({
            onError: emptyFunction,
          });

          const parentRuntime = createParentRuntime({
            context: { appName: "ShellApp" },
          });
          const childRuntime = createChildRuntime({
            context: { appName: "ShellApp" },
            runtime: parentRuntime,
          });

          expect(parentRuntime.state.loader.locale.loading).toBe(false);

          childRuntime.state.load(
            "locale",
            () => new Promise((resolve) => setTimeout(resolve, 0)),
            { appName: Math.random().toString() }
          );

          expect(parentRuntime.state.loader.locale.loading).toBe(true);
          expect(childRuntime.state.loader.locale.loading).toBe(true);
          await waitForExpect(() => {
            expect(parentRuntime.state.loader.locale.loading).toBe(false);
            expect(childRuntime.state.loader.locale.loading).toBe(false);
          });

          parentRuntime.state.load(
            "token",
            () => new Promise((resolve) => setTimeout(resolve, 0)),
            { appName: Math.random().toString() }
          );

          expect(parentRuntime.state.loader.token.loading).toBe(true);
          expect(childRuntime.state.loader.token.loading).toBe(true);
          await waitForExpect(() => {
            expect(parentRuntime.state.loader.token.loading).toBe(false);
            expect(childRuntime.state.loader.token.loading).toBe(false);
          });
        });

        it("has an error in parent and child runtimes if the load function of a given state prop fails", async () => {
          const { createRuntime: createParentRuntime } = configureRuntime(
            defaultState
          )({
            onError: emptyFunction,
          });

          const { createRuntime: createChildRuntime } = configureRuntime(
            defaultState
          )({
            onError: emptyFunction,
          });

          const parentRuntime = createParentRuntime({
            context: { appName: "ShellApp" },
          });
          const childRuntime = createChildRuntime({
            context: { appName: "ShellApp" },
            runtime: parentRuntime,
          });
          const errorMssg = Math.random().toString();

          expect(parentRuntime.state.loader.locale.loading).toBe(false);
          expect(childRuntime.state.loader.locale.loading).toBe(false);

          childRuntime.state
            .load(
              "locale",
              () =>
                new Promise((_resolve, reject) =>
                  setTimeout(() => reject(errorMssg), 10)
                ),
              { appName: Math.random().toString() }
            )
            .catch(emptyFunction);

          expect(childRuntime.state.loader.locale.loading).toBe(true);
          expect(parentRuntime.state.loader.locale.loading).toBe(true);

          await waitForExpect(() => {
            expect(childRuntime.state.loader.locale.error).toBe(errorMssg);
            expect(childRuntime.state.loader.locale.loading).toBe(false);
            expect(parentRuntime.state.loader.locale.error).toBe(errorMssg);
            expect(parentRuntime.state.loader.locale.loading).toBe(false);
          });
        });
      });

      describe("load", () => {
        it("always returns the same promise from either the parent runtime or the child runtime given a valid state prop", () => {
          const { createRuntime: createParentRuntime } = configureRuntime(
            defaultState
          )({
            onError: emptyFunction,
          });

          const { createRuntime: createChildRuntime } = configureRuntime(
            defaultState
          )({
            onError: emptyFunction,
          });

          const parentRuntime = createParentRuntime({
            context: { appName: "ShellApp" },
          });
          const childRuntime = createChildRuntime({
            context: { appName: "ShellApp" },
            runtime: parentRuntime,
          });

          const childPromise = childRuntime.state.load(
            "locale",
            () => "title",
            { appName: Math.random().toString() }
          );

          const parentPromise = parentRuntime.state.load(
            "locale",
            () => "title",
            { appName: Math.random().toString() }
          );

          expect(isPromise(childPromise)).toBe(true);
          expect(isPromise(parentPromise)).toBe(true);
          expect(childPromise).toEqual(parentPromise);
        });

        it("can load a value asynchronously from the parent runtime or the child runtime but only one load function runs", async () => {
          const { createRuntime: createParentRuntime } = configureRuntime(
            defaultState
          )({
            onError: emptyFunction,
          });

          const { createRuntime: createChildRuntime } = configureRuntime(
            defaultState
          )({
            onError: emptyFunction,
          });

          const parentRuntime = createParentRuntime({
            context: { appName: "ShellApp" },
          });
          const childRuntime = createChildRuntime({
            context: { appName: "ShellApp" },
            runtime: parentRuntime,
          });
          const random = Math.random().toString();
          const childLoader = jest.fn(() => Promise.resolve(random));
          const parentLoader = jest.fn(() => Promise.resolve(random));

          const childValue = await childRuntime.state.load(
            "locale",
            childLoader,
            { appName: Math.random().toString() }
          );
          const parentValue = await parentRuntime.state.load(
            "locale",
            parentLoader,
            { appName: Math.random().toString() }
          );

          expect(childValue).toBe(random);
          expect(parentValue).toBe(random);
          expect(childLoader).toHaveBeenCalled();
          expect(parentLoader).not.toHaveBeenCalled();
        });

        it("sets an error message if it fails in both the parent runtime and the child runtime", async () => {
          const { createRuntime: createParentRuntime } = configureRuntime(
            defaultState
          )({
            onError: emptyFunction,
          });

          const { createRuntime: createChildRuntime } = configureRuntime(
            defaultState
          )({
            onError: emptyFunction,
          });

          const parentRuntime = createParentRuntime({
            context: { appName: "ShellApp" },
          });
          const childRuntime = createChildRuntime({
            context: { appName: "ShellApp" },
            runtime: parentRuntime,
          });

          const randomLocale = Math.random().toString();
          await childRuntime.state.load(
            "locale",
            () => Promise.reject(randomLocale),
            { appName: Math.random().toString() }
          );

          expect(childRuntime.state.loader.locale.error).toBe(randomLocale);
          expect(childRuntime.state.loader.locale.loading).toBe(false);
          expect(parentRuntime.state.loader.locale.error).toBe(randomLocale);
          expect(parentRuntime.state.loader.locale.loading).toBe(false);

          const randomToken = Math.random().toString();
          await parentRuntime.state.load(
            "token",
            () => Promise.reject(randomToken),
            { appName: Math.random().toString() }
          );

          expect(parentRuntime.state.loader.token.error).toBe(randomToken);
          expect(parentRuntime.state.loader.token.loading).toBe(false);
          expect(parentRuntime.state.loader.token.error).toBe(randomToken);
          expect(parentRuntime.state.loader.token.loading).toBe(false);
        });

        it("doesn't run on the server", async () => {
          const { window } = global;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          delete global.window;
          const { createRuntime: createParentRuntime } = configureRuntime(
            defaultState
          )({
            onError: emptyFunction,
          });

          const { createRuntime: createChildRuntime } = configureRuntime(
            defaultState
          )({
            onError: emptyFunction,
          });

          const parentRuntime = createParentRuntime({
            context: { appName: "ShellApp" },
          });
          const childRuntime = createChildRuntime({
            context: { appName: "ShellApp" },
            runtime: parentRuntime,
          });

          const random = Math.random().toString();
          const childValue = await childRuntime.state.load(
            "locale",
            () => Promise.resolve(random),
            { appName: Math.random().toString() }
          );
          const parentValue = await childRuntime.state.load(
            "locale",
            () => Promise.resolve(random),
            { appName: Math.random().toString() }
          );

          global.window = window;
          expect(childValue).toBe("en");
          expect(parentValue).toBe("en");
        });

        it("it only loads a value once from any runtime even if `load` is called many times for the same state prop ", async () => {
          const { createRuntime: createParentRuntime } = configureRuntime(
            defaultState
          )({
            onError: emptyFunction,
          });

          const { createRuntime: createChildRuntime } = configureRuntime(
            defaultState
          )({
            onError: emptyFunction,
          });

          const parentRuntime = createParentRuntime({
            context: { appName: "ShellApp" },
          });
          const childRuntime = createChildRuntime({
            context: { appName: "ShellApp" },
            runtime: parentRuntime,
          });

          const random = Math.random().toString();
          const loader = jest.fn(() => Promise.resolve(random));
          const context = { appName: Math.random().toString() };

          childRuntime.state.load("locale", loader, context);
          childRuntime.state.load("locale", loader, context);
          parentRuntime.state.load("locale", loader, context);
          childRuntime.state.load("locale", loader, context);
          parentRuntime.state.load("locale", loader, context);
          await childRuntime.state.load("locale", loader, context);
          await parentRuntime.state.load("locale", loader, context);

          expect(childRuntime.state.get("locale")).toBe(random);
          expect(parentRuntime.state.get("locale")).toBe(random);

          expect(loader).toHaveBeenCalledTimes(1);
        });

        it("throws an Error if an invalid state prop is used", async () => {
          const { createRuntime: createParentRuntime } = configureRuntime(
            defaultState
          )({
            onError: emptyFunction,
          });

          const { createRuntime: createChildRuntime } = configureRuntime(
            defaultState
          )({
            onError: emptyFunction,
          });

          const parentRuntime = createParentRuntime({
            context: { appName: "ShellApp" },
          });
          const childRuntime = createChildRuntime({
            context: { appName: "ShellApp" },
            runtime: parentRuntime,
          });

          let errorMessage;

          try {
            await childRuntime.state
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              .load("invalid_prop", emptyFunction);
          } catch (error: any) {
            errorMessage = error.message;
          }

          expect(errorMessage).toBe(`"invalid_prop" is not a valid state prop.
Did you forget to set "invalid_prop" to a value in your defaultState (including null or undefined) when calling configureState function?
Current valid props are: locale, token, user`);
        });
      });

      describe("loaded", () => {
        it("returns a promise that resolves to the value of a given state prop after it's being loaded by either the parent runtime or the child runtime", async () => {
          const { createRuntime: createParentRuntime } = configureRuntime(
            defaultState
          )({
            onError: emptyFunction,
          });

          const { createRuntime: createChildRuntime } = configureRuntime(
            defaultState
          )({
            onError: emptyFunction,
          });

          const parentRuntime = createParentRuntime({
            context: { appName: "ShellApp" },
          });
          const childRuntime = createChildRuntime({
            context: { appName: "ShellApp" },
            runtime: parentRuntime,
          });

          const randomLocale = Math.random().toString();
          expect(childRuntime.state.get("locale")).toBe("en");
          expect(parentRuntime.state.get("locale")).toBe("en");

          childRuntime.state.load(
            "locale",
            () => Promise.resolve(randomLocale),
            { appName: Math.random().toString() }
          );

          expect(childRuntime.state.get("locale")).toBe("en");
          expect(parentRuntime.state.get("locale")).toBe("en");
          expect(await parentRuntime.state.loaded("locale")).toBe(randomLocale);
          expect(await childRuntime.state.loaded("locale")).toBe(randomLocale);

          const randomToken = Math.random().toString();
          expect(childRuntime.state.get("token")).toBe(undefined);
          expect(parentRuntime.state.get("token")).toBe(undefined);

          parentRuntime.state.load(
            "token",
            () => Promise.resolve(randomToken),
            { appName: Math.random().toString() }
          );

          expect(childRuntime.state.get("token")).toBe(undefined);
          expect(parentRuntime.state.get("token")).toBe(undefined);
          expect(await parentRuntime.state.loaded("token")).toBe(randomToken);
          expect(await childRuntime.state.loaded("token")).toBe(randomToken);
        });

        it("returns a promise from either the parent runtime or the child runtime that resolves to the default value of a given state prop if that state prop wasn't changed", async () => {
          const { createRuntime: createParentRuntime } = configureRuntime(
            defaultState
          )({
            onError: emptyFunction,
          });

          const { createRuntime: createChildRuntime } = configureRuntime(
            defaultState
          )({
            onError: emptyFunction,
          });

          const parentRuntime = createParentRuntime({
            context: { appName: "ShellApp" },
          });
          const childRuntime = createChildRuntime({
            context: { appName: "ShellApp" },
            runtime: parentRuntime,
          });

          expect(childRuntime.state.get("locale")).toBe("en");
          expect(await childRuntime.state.loaded("locale")).toBe("en");
          expect(parentRuntime.state.get("locale")).toBe("en");
          expect(await parentRuntime.state.loaded("locale")).toBe("en");
        });

        it("returns a promise that resolves to the entire state after all the loaders have resolved if no state prop is given", async () => {
          const { createRuntime: createParentRuntime } = configureRuntime(
            defaultState
          )({
            onError: emptyFunction,
          });

          const { createRuntime: createChildRuntime } = configureRuntime(
            defaultState
          )({
            onError: emptyFunction,
          });

          const parentRuntime = createParentRuntime({
            context: { appName: "ShellApp" },
          });
          const childRuntime = createChildRuntime({
            context: { appName: "ShellApp" },
            runtime: parentRuntime,
          });
          const randomLocale = Math.random().toString();
          const randomUser = { username: Math.random().toString() };

          expect(parentRuntime.state.get("locale")).toBe("en");
          expect(parentRuntime.state.get("user")).toBe(undefined);

          parentRuntime.state.load(
            "locale",
            () => Promise.resolve(randomLocale),
            { appName: Math.random().toString() }
          );
          parentRuntime.state.load("user", () => Promise.resolve(randomUser), {
            appName: Math.random().toString(),
          });

          const result = await childRuntime.state.loaded();

          expect(result).toEqual({ locale: randomLocale, user: randomUser });
          expect(childRuntime.state.get("locale")).toBe(randomLocale);
          expect(childRuntime.state.get("user")).toBe(randomUser);
          expect(parentRuntime.state.get("locale")).toBe(randomLocale);
          expect(parentRuntime.state.get("user")).toBe(randomUser);
        });
      });
    });
  });
});

describe("state", () => {
  it("throws an error if no default state is passed when configuring a runtime", () => {
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      configureRuntime()();
    }).toThrow("default state is required to configure a runtime");
  });

  describe("get", () => {
    it("throws an Error if an invalid state prop is used getting state", () => {
      let errorMessage;

      try {
        const runtime = createRuntime({ context: { appName: "ShellApp" } });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        runtime.state.get("invalid_prop");
      } catch (error: any) {
        errorMessage = error.message;
      }

      expect(errorMessage).toBe(`"invalid_prop" is not a valid state prop.
Did you forget to set "invalid_prop" to a value in your defaultState (including null or undefined) when calling configureState function?
Current valid props are: locale, token, user`);
    });

    it("can return state given a state prop", () => {
      const runtime = createRuntime({ context: { appName: "ShellApp" } });
      expect(runtime.state.get("locale")).toBe("en");
    });

    it("can return state given a state prop and a new context", () => {
      const initialContext = { appName: Math.random().toString() };
      const newContext = { appName: Math.random().toString() };
      const runtime = createRuntime({ context: initialContext });
      const newRuntimeContext = setRuntimeContext(newContext, runtime);
      const newLocale = Math.random().toString();

      expect(runtime.state.get("locale")).toBe("en");
      expect(newRuntimeContext?.state.get("locale")).toBe("en");

      runtime.state.set("locale", newLocale);

      expect(runtime.state.get("locale")).toBe(newLocale);
      expect(newRuntimeContext?.state.get("locale")).toBe(newLocale);
    });
  });

  describe("set", () => {
    it("throws an Error if an invalid state prop is used setting state", () => {
      let errorMessage;

      try {
        const runtime = createRuntime({ context: { appName: "ShellApp" } });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        runtime.state.set("invalid_prop", Math.random());
      } catch (error: any) {
        errorMessage = error.message;
      }

      expect(errorMessage).toBe(`"invalid_prop" is not a valid state prop.
Did you forget to set "invalid_prop" to a value in your defaultState (including null or undefined) when calling configureState function?
Current valid props are: locale, token, user`);
    });

    it("can set new state given a state prop", () => {
      const runtime = createRuntime({ context: { appName: "ShellApp" } });
      const random = Math.random().toString();

      runtime.state.set("locale", "pt");
      expect(runtime.state.get("locale")).toBe("pt");

      runtime.state.set("locale", random);
      expect(runtime.state.get("locale")).toBe(random);
    });
  });
  describe("listen", () => {
    it("throws an Error if an invalid state prop is used", async () => {
      let errorMessage;

      const runtime = createRuntime({ context: { appName: "ShellApp" } });
      try {
        await runtime.state
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .listen("invalid_prop", emptyFunction);
      } catch (error: any) {
        errorMessage = error.message;
      }

      expect(errorMessage).toBe(`"invalid_prop" is not a valid state prop.
Did you forget to set "invalid_prop" to a value in your defaultState (including null or undefined) when calling configureState function?
Current valid props are: locale, token, user`);
    });

    it("calls listeners of a state prop when its value changes", () => {
      const runtime = createRuntime({ context: { appName: "ShellApp" } });
      const listener = jest.fn();
      const random = Math.random().toString();

      runtime.state.listen("locale", listener);
      runtime.state.set("locale", random);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(random, false, undefined);
    });

    it("calls listeners of a state prop when its value changes in different contexts", () => {
      const initialContext = { appName: Math.random().toString() };
      const newContext = { appName: Math.random().toString() };
      const runtime = createRuntime({ context: initialContext });
      const newRuntimeContext = setRuntimeContext(newContext, runtime);
      const newLocale = Math.random().toString();

      const listener1 = jest.fn();
      const listener2 = jest.fn();
      runtime.state.listen("locale", listener1);
      newRuntimeContext?.state.listen("locale", listener2);

      runtime.state.set("locale", newLocale);

      expect(runtime.state.get("locale")).toBe(newLocale);
      expect(newRuntimeContext?.state.get("locale")).toBe(newLocale);

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener1).toHaveBeenCalledWith(newLocale, false, undefined);
      expect(listener2).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledWith(newLocale, false, undefined);
    });

    it("it won't call any listeners of a prop if the current value is shallowly equal to the new value", () => {
      const runtime = createRuntime({ context: { appName: "ShellApp" } });
      const listener = jest.fn();

      runtime.state.listen("locale", listener);
      runtime.state.set("locale", runtime.state.get("locale"));

      expect(listener).not.toHaveBeenCalled();
    });

    it("only adds the same listener once given the same state prop", () => {
      const runtime = createRuntime({ context: { appName: "ShellApp" } });
      const listener = jest.fn();
      const random = Math.random().toString();

      runtime.state.listen("locale", listener);
      runtime.state.listen("locale", listener);

      runtime.state.set("locale", random);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(random, false, undefined);
    });

    it("can unsubscribe and stops calling the listener", () => {
      const runtime = createRuntime({ context: { appName: "ShellApp" } });
      const listenerA = jest.fn();
      const listenerB = jest.fn();
      const unsubscribeA = runtime.state.listen("locale", listenerA);
      const unsubscribeB = runtime.state.listen("locale", listenerB);
      const random = Math.random().toString();

      runtime.state.set("locale", random);

      expect(listenerA).toHaveBeenCalledTimes(1);
      expect(listenerA).toHaveBeenCalledWith(random, false, undefined);
      expect(listenerB).toHaveBeenCalledTimes(1);
      expect(listenerB).toHaveBeenCalledWith(random, false, undefined);

      listenerA.mockReset();
      listenerB.mockReset();

      unsubscribeB();

      runtime.state.set("locale", Math.random().toString());
      expect(listenerB).toHaveBeenCalledTimes(0);
      expect(listenerA).toHaveBeenCalledTimes(1);

      unsubscribeA();

      listenerA.mockReset();
      runtime.state.set("locale", Math.random().toString());
      expect(listenerA).toHaveBeenCalledTimes(0);
    });

    it("can use the same listener for different state props", () => {
      const runtime = createRuntime({ context: { appName: "ShellApp" } });
      const randomA = Math.random().toString();
      const randomB = { username: randomA };
      const listener = jest.fn();

      runtime.state.listen("locale", listener);
      runtime.state.listen("user", listener);
      runtime.state.set("locale", randomA);
      runtime.state.set("user", randomB);

      expect(listener).toHaveBeenCalledTimes(2);
      expect(listener).toHaveBeenCalledWith(randomA, false, undefined);
      expect(listener).toHaveBeenCalledWith(randomB, false, undefined);
    });
  });

  describe("loader", () => {
    it("is loading true for a given state prop while the associated load function is working and it is false before and after", async () => {
      const runtime = createRuntime({ context: { appName: "ShellApp" } });
      expect(runtime.state.loader.locale.loading).toBe(false);

      runtime.state.load(
        "locale",
        () => new Promise((resolve) => setTimeout(resolve, 0)),
        { appName: Math.random().toString() }
      );

      expect(runtime.state.loader.locale.loading).toBe(true);
      await waitForExpect(() => {
        expect(runtime.state.loader.locale.loading).toBe(false);
      });
    });

    it("has an error if the load function of a given state prop fails", async () => {
      const runtime = createRuntime({ context: { appName: "ShellApp" } });

      expect(runtime.state.loader.locale.loading).toBe(false);

      const errorMssg = Math.random().toString();
      runtime.state
        .load(
          "locale",
          () =>
            new Promise((_resolve, reject) =>
              setTimeout(() => reject(errorMssg), 10)
            ),
          { appName: Math.random().toString() }
        )
        .catch(() => null);

      expect(runtime.state.loader.locale.loading).toBe(true);

      await waitForExpect(() => {
        expect(runtime.state.loader.locale.error).toBe(errorMssg);
        expect(runtime.state.loader.locale.loading).toBe(false);
      });
    });
  });

  describe("load", () => {
    it("always returns a promise given a valid state prop", () => {
      const runtime = createRuntime({ context: { appName: "ShellApp" } });
      const value = runtime.state.load("locale", () => "title", {
        appName: Math.random().toString(),
      });

      expect(isPromise(value)).toBe(true);
    });

    it("can load a value asynchronously", async () => {
      const runtime = createRuntime({ context: { appName: "ShellApp" } });
      const random = Math.random().toString();
      const value = await runtime.state.load(
        "locale",
        () => new Promise((resolve) => setTimeout(() => resolve(random), 10)),
        { appName: Math.random().toString() }
      );

      expect(value).toBe(random);
    });

    it("sets an error message if it fails", async () => {
      const runtime = createRuntime({ context: { appName: "ShellApp" } });
      const random = Math.random().toString();
      const value = await runtime.state.load(
        "locale",
        () => Promise.reject(random),
        { appName: Math.random().toString() }
      );

      expect(runtime.state.loader.locale.error).toBe(random);
      expect(runtime.state.loader.locale.loading).toBe(false);
    });

    it("doesn't run on the server", async () => {
      const { window } = global;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete global.window;
      const runtime = createRuntime({ context: { appName: "ShellApp" } });
      const random = Math.random().toString();
      const value = await runtime.state.load(
        "locale",
        () => new Promise((resolve) => setTimeout(() => resolve(random), 10)),
        { appName: Math.random().toString() }
      );

      global.window = window;
      expect(value).toBe("en");
    });

    it("it only loads a value once even if `load` is called many times for the same state prop ", async () => {
      const random = Math.random().toString();
      const runtime = createRuntime({ context: { appName: "ShellApp" } });
      const loader = jest.fn(
        () =>
          new Promise<string>((resolve) => setTimeout(() => resolve(random), 2))
      );
      const context = { appName: Math.random().toString() };

      await runtime.state.load("locale", loader, context);
      runtime.state.load("locale", loader, context);
      runtime.state.load("locale", loader, context);
      runtime.state.load("locale", loader, context);
      await runtime.state.load("locale", loader, context);

      expect(runtime.state.get("locale")).toBe(random);

      expect(loader).toHaveBeenCalledTimes(1);
    });

    it("throws an Error if an invalid state prop is used", async () => {
      let errorMessage;

      const runtime = createRuntime({ context: { appName: "ShellApp" } });
      try {
        await runtime.state
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .load("invalid_prop", emptyFunction);
      } catch (error: any) {
        errorMessage = error.message;
      }

      expect(errorMessage).toBe(`"invalid_prop" is not a valid state prop.
Did you forget to set "invalid_prop" to a value in your defaultState (including null or undefined) when calling configureState function?
Current valid props are: locale, token, user`);
    });
  });

  describe("loaded", () => {
    it("returns a promise that resolves to the value of a given state prop after it's being loaded", async () => {
      const runtime = createRuntime({ context: { appName: "ShellApp" } });
      const random = Math.random().toString();

      expect(runtime.state.get("locale")).toBe("en");

      runtime.state.load(
        "locale",
        () => new Promise((resolve) => setTimeout(() => resolve(random), 5)),
        { appName: Math.random().toString() }
      );

      expect(runtime.state.get("locale")).toBe("en");
      expect(await runtime.state.loaded("locale")).toBe(random);
    });

    it("returns a promise that resolves to the default value of a given state prop if that prop wasn't updated", async () => {
      const runtime = createRuntime({ context: { appName: "ShellApp" } });

      expect(runtime.state.get("locale")).toBe("en");
      expect(await runtime.state.loaded("locale")).toBe("en");
    });

    it("returns a promise that resolves to the entire state after all the loaders have resolved if no state prop is given", async () => {
      const runtime = createRuntime({ context: { appName: "ShellApp" } });
      const randomA = Math.random().toString();
      const randomB = { username: Math.random().toString() };

      expect(runtime.state.get("locale")).toBe("en");

      runtime.state.load(
        "locale",
        () => new Promise((resolve) => setTimeout(() => resolve(randomA), 2)),
        { appName: Math.random().toString() }
      );
      runtime.state.load(
        "user",
        () => new Promise((resolve) => setTimeout(() => resolve(randomB), 3)),
        { appName: Math.random().toString() }
      );

      const result = await runtime.state.loaded();

      expect(result).toEqual({ locale: randomA, user: randomB });
      expect(runtime.state.get("locale")).toBe(randomA);
      expect(runtime.state.get("user")).toBe(randomB);
    });

    it("throws an Error if an invalid state prop is used", async () => {
      let errorMessage;

      const runtime = createRuntime({ context: { appName: "ShellApp" } });
      try {
        await runtime.state
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .loaded("invalid_prop", emptyFunction);
      } catch (error: any) {
        errorMessage = error.message;
      }

      expect(errorMessage).toBe(`"invalid_prop" is not a valid state prop.
Did you forget to set "invalid_prop" to a value in your defaultState (including null or undefined) when calling configureState function?
Current valid props are: locale, token, user`);
    });
  });
});

describe("api", () => {
  it(`returns a value from the api given an api prop`, async () => {
    const runtime = createRuntime({ context: { appName: "ShellApp" } });
    const firebase = await runtime.api.firebase;

    expect(firebase.toString()).toBe("FakeFirebase");
    expect(runtime.api.eventEmitter).toBe(eventEmitter);
  });

  it(`lazy initializes a value from the api when it's read`, async () => {
    const runtime = createRuntime({ context: { appName: "ShellApp" } });

    expect(Object.keys(runtime.api).length).toEqual(0);

    await runtime.api.firebase;
    expect(Object.keys(runtime.api).length).toEqual(1);

    runtime.api.eventEmitter;
    expect(Object.keys(runtime.api).length).toEqual(2);
  });

  it(`throws an error if an api prop is set with a new value`, async () => {
    const runtime = createRuntime({ context: { appName: "ShellApp" } });

    let errorMessage;
    try {
      runtime.api.eventEmitter = eventEmitter;
    } catch (error: any) {
      errorMessage = error.message;
    }

    expect(errorMessage).toBe(
      `Cannot assign to read only api property 'eventEmitter'`
    );
  });

  it(`doesn't initialise an api property more than once`, async () => {
    let firebaseResolvedCounter = 0;
    const firebase = ({ state }: RuntimeApi<SharedState>) =>
      new Promise<FakeFirebase>((resolve) => {
        state
          .load("token", fetchToken, { appName: Math.random().toString() })
          .then((token) => {
            firebaseResolvedCounter++;
            if (token) resolve(new FakeFirebase(token));
          });
      });

    const runtime = configureRuntime<SharedState>(defaultState)({
      onError: emptyFunction,
      apiFactory: {
        firebase,
      },
    }).createRuntime({ context: { appName: "ShellApp" } });

    runtime.state.get("locale");

    // reading firebase from api which triggers firebase initialization
    await runtime.api.firebase;
    await runtime.api.firebase;
    await runtime.api.firebase;
    await runtime.api.firebase;

    expect(firebaseResolvedCounter).toBe(1);
  });
});

describe("cleanup", () => {
  it(`calls all the cleanup functions passed to the onCleanup callback of each api factory that was initialised if no api prop is passed`, async () => {
    const cleanup1 = jest.fn();
    const cleanup2 = jest.fn();
    const runtime = configureRuntime<SharedState>(defaultState)({
      onError: emptyFunction,
      apiFactory: {
        eventEmitter1: ({ onCleanup }) => {
          onCleanup(cleanup1);
          return new FakeEventEmitter();
        },
        eventEmitter2: ({ onCleanup }) => {
          onCleanup(cleanup2);
          return new FakeEventEmitter();
        },
      },
    }).createRuntime({ context: { appName: "ShellApp" } });

    // reading this api to invoke eventEmitter1 factory function
    runtime.api.eventEmitter1;

    expect(cleanup1).not.toHaveBeenCalled();
    expect(cleanup2).not.toHaveBeenCalled();

    runtime.cleanup();

    expect(cleanup1).toHaveBeenCalled();
    expect(cleanup2).not.toHaveBeenCalled();
  });

  it(`removes the api instance of a given prop so that its factory function is invoked again when it's accessed again`, async () => {
    const cleanup = jest.fn();
    const initialised = jest.fn();
    const runtime = configureRuntime<SharedState>(defaultState)({
      onError: emptyFunction,
      apiFactory: {
        eventEmitter1: ({ onCleanup }) => {
          onCleanup(cleanup);
          initialised();
          return new FakeEventEmitter();
        },
      },
    }).createRuntime({ context: { appName: "ShellApp" } });

    // reading this api to invoke eventEmitter1 factory function
    runtime.api.eventEmitter1;

    expect(cleanup).not.toHaveBeenCalled();
    expect(initialised).toHaveBeenCalledTimes(1);

    runtime.cleanup("eventEmitter1");
    expect(cleanup).toHaveBeenCalled();

    // reading this api to invoke eventEmitter1 factory function
    runtime.api.eventEmitter1;
    expect(initialised).toHaveBeenCalledTimes(2);

    // this api should not invoke eventEmitter1 factory function because runtime.cleanup("eventEmitter1") didn't run again
    runtime.api.eventEmitter1;
    expect(initialised).toHaveBeenCalledTimes(2);
  });

  it(`removes all the api instances if no prop is passed so that factory functions are invoked again when they are accessed again`, async () => {
    const cleanup1 = jest.fn();
    const initialised1 = jest.fn();
    const cleanup2 = jest.fn();
    const initialised2 = jest.fn();
    const runtime = configureRuntime<SharedState>(defaultState)({
      onError: emptyFunction,
      apiFactory: {
        eventEmitter1: async ({ onCleanup, state }) => {
          await state.load("token", fetchToken, {
            appName: Math.random().toString(),
          });
          onCleanup(cleanup1);
          initialised1();
          return new FakeEventEmitter();
        },
        eventEmitter2: ({ onCleanup }) => {
          onCleanup(cleanup2);
          initialised2();
          return new FakeEventEmitter();
        },
      },
    }).createRuntime({ context: { appName: "ShellApp" } });

    // reading these apis to invoke their factory functions
    await runtime.api.eventEmitter1;
    runtime.api.eventEmitter2;

    expect(cleanup1).not.toHaveBeenCalled();
    expect(initialised1).toHaveBeenCalledTimes(1);
    expect(cleanup2).not.toHaveBeenCalled();
    expect(initialised2).toHaveBeenCalledTimes(1);

    runtime.cleanup();
    expect(cleanup1).toHaveBeenCalled();
    expect(cleanup2).toHaveBeenCalled();

    // reading these apis to invoke factory their functions
    await runtime.api.eventEmitter1;
    await runtime.api.eventEmitter2;
    expect(initialised1).toHaveBeenCalledTimes(2);
    expect(initialised2).toHaveBeenCalledTimes(2);

    // these should not invoke any factory function because runtime.cleanup() didn't run again
    await runtime.api.eventEmitter1;
    await runtime.api.eventEmitter2;
    expect(initialised1).toHaveBeenCalledTimes(2);
    expect(initialised2).toHaveBeenCalledTimes(2);
  });

  it(`calls the cleanup function of a given api prop if an onCleanup callback was added to the given api prop and the api was initialised`, async () => {
    const cleanup1 = jest.fn();
    const cleanup2 = jest.fn();
    const cleanup3 = jest.fn();
    const runtime = configureRuntime<SharedState>(defaultState)({
      onError: emptyFunction,
      apiFactory: {
        eventEmitter1: ({ onCleanup }) => {
          onCleanup(cleanup1);
          return new FakeEventEmitter();
        },
        eventEmitter2: ({ onCleanup }) => {
          onCleanup(cleanup2);
          return new FakeEventEmitter();
        },
        eventEmitter3: ({ onCleanup }) => {
          onCleanup(cleanup3);
          return new FakeEventEmitter();
        },
      },
    }).createRuntime({ context: { appName: "ShellApp" } });

    runtime.cleanup("eventEmitter2");
    expect(cleanup1).not.toHaveBeenCalled();

    // reading these apis to invoke their api factory functions
    await runtime.api.eventEmitter1;
    await runtime.api.eventEmitter2;

    runtime.cleanup("eventEmitter1");

    expect(cleanup1).toHaveBeenCalled();
    expect(cleanup2).not.toHaveBeenCalled();
    expect(cleanup3).not.toHaveBeenCalled();
  });

  it(`a cleanup function is passed to the apiFactory function that can call the onCleanup callback of the given api prop`, async () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    const runtime = configureRuntime<SharedState>(defaultState)({
      onError: emptyFunction,
      apiFactory: {
        eventEmitter1: () => {
          spy1();

          return new FakeEventEmitter();
        },
        eventEmitter2: () => {
          spy2();
          return new FakeEventEmitter();
        },
      },
    }).createRuntime({ context: { appName: "ShellApp" } });

    // reading this api to invoke eventEmitter1 factory function
    await runtime.api.eventEmitter1;

    expect(spy1).toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
  });

  it(`calls the cleanup function of the parent runtime if a prop is passed and there is a parent runtime`, async () => {
    const spyParent1 = jest.fn();
    const spyParent2 = jest.fn();
    const spyChild1 = jest.fn();
    const spyChild2 = jest.fn();
    const { createRuntime: createParentRuntime } =
      configureRuntime<SharedState>(defaultState)({
        onError: emptyFunction,
        apiFactory: {
          eventEmitter1: () => {
            spyParent1();

            return new FakeEventEmitter();
          },
          eventEmitter2: () => {
            spyParent2();
            return new FakeEventEmitter();
          },
        },
      });

    const { createRuntime: createChildRuntime } = configureRuntime(
      defaultState
    )({
      onError: emptyFunction,
      apiFactory: {
        eventEmitter1: () => {
          spyChild1();

          return new FakeEventEmitter();
        },
        eventEmitter2: () => {
          spyChild2();
          return new FakeEventEmitter();
        },
      },
    });

    const parentRuntime = createParentRuntime({
      context: { appName: "ShellApp" },
    });
    const childRuntime = createChildRuntime({
      context: { appName: "ShellApp" },
      runtime: parentRuntime,
    });

    childRuntime.api.eventEmitter1;
    childRuntime.cleanup("eventEmitter1");

    expect(spyParent1).toHaveBeenCalled();
    expect(spyParent2).not.toHaveBeenCalled();
    expect(spyChild1).not.toHaveBeenCalled();
    expect(spyChild2).not.toHaveBeenCalled();
  });

  it(`calls all the cleanup function of the parent runtime if there is a parent runtime`, async () => {
    const spyParent1 = jest.fn();
    const spyParent2 = jest.fn();
    const spyChild1 = jest.fn();
    const spyChild2 = jest.fn();
    const { createRuntime: createParentRuntime } =
      configureRuntime<SharedState>(defaultState)({
        onError: emptyFunction,
        apiFactory: {
          eventEmitter1: () => {
            spyParent1();

            return new FakeEventEmitter();
          },
          eventEmitter2: () => {
            spyParent2();
            return new FakeEventEmitter();
          },
        },
      });

    const { createRuntime: createChildRuntime } = configureRuntime(
      defaultState
    )({
      onError: emptyFunction,
      apiFactory: {
        eventEmitter1: () => {
          spyChild1();

          return new FakeEventEmitter();
        },
        eventEmitter2: () => {
          spyChild2();

          return new FakeEventEmitter();
        },
      },
    });

    const parentRuntime = createParentRuntime({
      context: { appName: "ShellApp" },
    });
    const childRuntime = createChildRuntime({
      context: { appName: "ShellApp" },
      runtime: parentRuntime,
    });

    childRuntime.api.eventEmitter1;
    childRuntime.api.eventEmitter2;
    childRuntime.cleanup();

    expect(spyParent1).toHaveBeenCalled();
    expect(spyParent2).toHaveBeenCalled();
    expect(spyChild1).not.toHaveBeenCalled();
    expect(spyChild2).not.toHaveBeenCalled();
  });
});
