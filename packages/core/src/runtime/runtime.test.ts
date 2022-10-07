import waitForExpect from "wait-for-expect";

import { configureRuntime } from "./runtime";
import { isPromise } from "../utils";

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
    firebase: ({ load }) =>
      new Promise<FakeFirebase>((resolve) => {
        load("token", fetchToken).then((token) => {
          if (token) resolve(new FakeFirebase(token));
        });
      }),
  },
});

describe("configureRuntime", () => {
  it(`calls onError if it can't create any async api`, async () => {
    const onError = jest.fn();
    const randomError = new Error(Math.random().toString());
    const runtime = configureRuntime(defaultState)({
      onError,
      apiFactory: {
        eventEmitter: () => Promise.reject(randomError),
      },
    }).createRuntime();

    runtime.api.eventEmitter;

    await runtime.booted();

    expect(onError).toHaveBeenCalledWith(randomError, undefined);
  });

  it(`calls onError if it can't create any sync api`, async () => {
    const onError = jest.fn();
    const randomError = new Error(Math.random().toString());
    const runtime = configureRuntime(defaultState)({
      onError,
      apiFactory: {
        eventEmitter: () => {
          throw randomError;
        },
      },
    }).createRuntime();

    runtime.api.eventEmitter;

    expect(onError).toHaveBeenCalledWith(randomError, undefined);
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it(`doesn't call onError if it can create the api`, async () => {
    const onError = jest.fn();
    const randomError = new Error(Math.random().toString());
    const runtime = configureRuntime(defaultState)({
      onError,
      apiFactory: {
        eventEmitter: () => Promise.resolve(randomError),
      },
    }).createRuntime();

    await runtime.booted();

    expect(onError).not.toHaveBeenCalled();
  });
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

    const runtime = createRuntime();
    expect(runtime.getState("locale")).toEqual(defaultState.locale);
    expect(runtime.getState("user")).toEqual(defaultState.user);
    expect(runtime.getState("token")).toEqual(defaultState.token);
    expect(runtime.loader.locale).toEqual(defaultLoader);
    expect(runtime.loader.user).toEqual(defaultLoader);
    expect(runtime.loader.token).toEqual(defaultLoader);
    expect(typeof runtime.booted).toBe("function");
    expect(typeof runtime.load).toBe("function");
    expect(typeof runtime.loaded).toBe("function");
    expect(typeof runtime.on).toBe("function");
    expect(typeof runtime.subscribe).toBe("function");
  });

  it(`can receive some initial state that overrides the default state`, () => {
    const { createRuntime } = configureRuntime<SharedState>(defaultState)({
      onError: emptyFunction,
    });
    const username = Math.random().toString();

    const runtime = createRuntime({
      initialState: { ...defaultState, user: { username } },
    });

    expect(runtime.getState("user")?.username).toBe(username);
  });

  it(`returns a runtime that exposes a logError function that accepts an Error argument`, async () => {
    const onError = jest.fn();
    const { createRuntime } = configureRuntime<SharedState>(defaultState)({
      onError,
    });

    const runtime = createRuntime();
    const error = new Error(Math.random().toString());
    runtime.logError(error);

    expect(onError).toHaveBeenCalledWith(error, undefined);
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

        const grandparentRuntime = createGrandparentRuntime();
        const parentRuntime = createParentRuntime({
          runtime: grandparentRuntime,
        });
        const childRuntime = createChildRuntime({ runtime: parentRuntime });
        const grandchildRuntime = createGrandchildRuntime({
          runtime: childRuntime,
        });

        const childRandomToken = Math.random().toString();
        childRuntime.setState("token", childRandomToken);

        expect(grandparentRuntime.getState("token")).toBe(childRandomToken);
        expect(parentRuntime.getState("token")).toBe(childRandomToken);
        expect(childRuntime.getState("token")).toBe(childRandomToken);
        expect(grandchildRuntime.getState("token")).toBe(childRandomToken);
      });
    });

    describe("subscribe", () => {
      it(`calls parent subscribers when child runtime changes`, async () => {
        const { createRuntime: createParentRuntime } = configureRuntime({
          locale: "en",
        })({
          onError: emptyFunction,
          apiFactory: {
            eventEmitter: () => eventEmitter,
          },
        });

        const parentRuntime = createParentRuntime();
        const parentLocaleCallback = jest.fn();
        parentRuntime.subscribe("locale", parentLocaleCallback);

        const childRuntime = createRuntime({ runtime: parentRuntime });
        const randomString = Math.random().toString();
        childRuntime.setState("locale", randomString);

        expect(parentLocaleCallback).toBeCalledWith(
          randomString,
          false,
          undefined
        );
      });

      it(`calls child subscribers when child runtime changes`, async () => {
        const { createRuntime: createParentRuntime } = configureRuntime({
          locale: "en",
        })({
          onError: emptyFunction,
          apiFactory: {
            eventEmitter: () => eventEmitter,
          },
        });

        const parentRuntime = createParentRuntime();
        const localeCallback = jest.fn();

        const childRuntime = createRuntime({ runtime: parentRuntime });
        childRuntime.subscribe("locale", localeCallback);
        const randomString = Math.random().toString();
        childRuntime.setState("locale", randomString);

        expect(localeCallback).toBeCalledWith(randomString, false, undefined);
      });

      it(`calls child subscribers when parent runtime changes`, async () => {
        const { createRuntime: createParentRuntime } = configureRuntime({
          locale: "en",
        })({
          onError: emptyFunction,
          apiFactory: {
            eventEmitter: () => eventEmitter,
          },
        });

        const parentRuntime = createParentRuntime();

        const localeCallback = jest.fn();
        const childRuntime = createRuntime({ runtime: parentRuntime });
        childRuntime.subscribe("locale", localeCallback);

        const randomString = Math.random().toString();
        parentRuntime.setState("locale", randomString);

        expect(localeCallback).toBeCalledWith(randomString, false, undefined);
      });

      it(`calls child and parent subscribers when child and parent runtime change`, async () => {
        const { createRuntime: createParentRuntime } = configureRuntime({
          locale: "en",
        })({
          onError: emptyFunction,
          apiFactory: {
            eventEmitter: () => eventEmitter,
          },
        });

        const parentRuntime = createParentRuntime();
        const parentLocaleCallback = jest.fn();
        parentRuntime.subscribe("locale", parentLocaleCallback);

        const childRuntime = createRuntime({ runtime: parentRuntime });
        const childLocaleCallback = jest.fn();
        childRuntime.subscribe("locale", childLocaleCallback);

        const randomString1 = Math.random().toString();
        childRuntime.setState("locale", randomString1);

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
        childRuntime.setState("locale", randomString2);

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

      it(`unubscribes child and parent subscribers`, async () => {
        const { createRuntime: createParentRuntime } = configureRuntime({
          locale: "en",
        })({
          onError: emptyFunction,
          apiFactory: {
            eventEmitter: () => eventEmitter,
          },
        });

        const parentRuntime = createParentRuntime();
        const parentLocaleCallback = jest.fn();
        const unsubscribeFromParent = parentRuntime.subscribe(
          "locale",
          parentLocaleCallback
        );

        const childRuntime = createRuntime({ runtime: parentRuntime });
        const childLocaleCallback = jest.fn();
        const unsubscribeFromChild = childRuntime.subscribe(
          "locale",
          childLocaleCallback
        );

        unsubscribeFromParent();
        const randomString1 = Math.random().toString();
        childRuntime.setState("locale", randomString1);

        expect(parentLocaleCallback).not.toHaveBeenCalled();
        expect(childLocaleCallback).toHaveBeenCalledWith(
          randomString1,
          false,
          undefined
        );

        unsubscribeFromChild();
        const randomString2 = Math.random().toString();
        childRuntime.setState("locale", randomString2);

        expect(parentLocaleCallback).not.toHaveBeenCalled();
        childLocaleCallback.mockReset();
        expect(childLocaleCallback).not.toHaveBeenCalled();
      });
    });

    describe("booted", () => {
      it(`returns false if it can't resolve any the async apis from the parent runtime`, async () => {
        const parentRuntime = configureRuntime(defaultState)({
          onError: emptyFunction,
          apiFactory: {
            a: () => Promise.resolve(1),
            b: () => Promise.resolve(2),
            c: () => Promise.reject(3),
          },
        }).createRuntime();

        const { createRuntime: createChildRuntime } = configureRuntime(
          defaultState
        )({
          onError: emptyFunction,
          apiFactory: {
            a: () => Promise.resolve(1),
            b: () => Promise.resolve(2),
            c: () => Promise.resolve(3),
          },
        });

        const childRuntime = createChildRuntime({ runtime: parentRuntime });

        // reading api from child runtime to boot this api
        childRuntime.api.c;

        const isBooted = await childRuntime.booted();

        expect(isBooted).toBe(false);
      });

      it(`resolves after all the read async apis from the parent runtime resolve if the parent runtime has any of those apis`, async () => {
        let isParentFirebaseResolved = false;
        let isChildFirebaseResolved = false;
        let isChildEventEmitterResolved = false;

        const { createRuntime: createParentRuntime } = configureRuntime({
          token: "",
        })({
          onError: emptyFunction,
          apiFactory: {
            firebase: ({ load }) =>
              new Promise<FakeFirebase>((resolve) => {
                load("token", fetchToken).then((token) => {
                  isParentFirebaseResolved = true;
                  if (token) resolve(new FakeFirebase(token));
                });
              }),
          },
        });

        const { createRuntime: createChildRuntime } = configureRuntime({
          token: "",
          locale: "en",
        })({
          onError: emptyFunction,
          apiFactory: {
            eventEmitter: async () =>
              new Promise<FakeEventEmitter>((resolve) => {
                setTimeout(() => {
                  isChildEventEmitterResolved = true;
                  resolve(new FakeEventEmitter());
                }, 1);
              }),
            firebase: () =>
              new Promise<FakeFirebase>((resolve) => {
                isChildFirebaseResolved = true;
                resolve(new FakeFirebase("token"));
              }),
          },
        });

        const parentRuntime = createParentRuntime();
        const childRuntime = createChildRuntime({ runtime: parentRuntime });

        // reading apis from child runtime to boot these apis
        childRuntime.api.firebase;
        childRuntime.api.eventEmitter;

        const isBooted = await childRuntime.booted();

        expect(isBooted).toBe(true);
        expect(isParentFirebaseResolved).toBe(true);
        expect(isChildFirebaseResolved).toBe(false);
        expect(isChildEventEmitterResolved).toBe(true);
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

        const parentRuntime = createParentRuntime();
        const childRuntime = createChildRuntime({ runtime: parentRuntime });

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

        const parentRuntime = createParentRuntime();
        const childRuntime = createChildRuntime({ runtime: parentRuntime });

        let errorMessage;

        try {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          childRuntime.getState("invalid_prop");
        } catch (error: any) {
          errorMessage = error.message;
        }

        expect(errorMessage).toBe(`"invalid_prop" is not a valid state prop.
Did you forget to set "invalid_prop" to a value in your defaultState (including null or undefined) when calling configureState function?
Current valid props are: token, locale`);
      });

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

        const parentRuntime = createParentRuntime();
        const childRuntime = createChildRuntime({ runtime: parentRuntime });

        const childRandomToken = Math.random().toString();
        childRuntime.setState("token", childRandomToken);

        expect(parentRuntime.getState("token")).toBe(childRandomToken);
      });

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
          initialState: { token: parentRandomToken },
        });
        const childRuntime = createChildRuntime({ runtime: parentRuntime });

        expect(childRuntime.getState("token")).toBe(parentRandomToken);
      });
    });

    describe("on", () => {
      it("throws an error when using 'on' if there is no api", () => {
        const { createRuntime: createParentRuntime } = configureRuntime(
          defaultState
        )({
          onError: emptyFunction,
          apiFactory: {},
        });

        const { createRuntime: createChildRuntime } = configureRuntime(
          defaultState
        )({
          onError: emptyFunction,
          apiFactory: {},
        });

        const childRuntime = createChildRuntime({
          runtime: createParentRuntime(),
        });

        expect(() => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          childRuntime.on("this-prop-does-not-exist", () => emptyFunction);
        }).toThrow(`No api found in runtime for prop this-prop-does-not-exist`);
      });

      it("throws an error when using 'on' if there is api but it doesn't have the given api prop", () => {
        const { createRuntime: createParentRuntime } = configureRuntime(
          defaultState
        )({
          onError: emptyFunction,
          apiFactory: { eventEmitter: () => new FakeEventEmitter() },
        });

        const { createRuntime: createChildRuntime } = configureRuntime(
          defaultState
        )({
          onError: emptyFunction,
          apiFactory: { eventEmitter: () => new FakeEventEmitter() },
        });

        const childRuntime = createChildRuntime({
          runtime: createParentRuntime(),
        });

        expect(() => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          childRuntime.on("this-prop-does-not-exist", () => emptyFunction);
        }).toThrow(`No api found in runtime for prop this-prop-does-not-exist`);
      });

      it("adds events to update state from the parent runtime if the given state exists in the parent runtime", async () => {
        const parentEventEmitter = new FakeEventEmitter();
        const childEventEmitter = new FakeEventEmitter();
        const defaultToken = Math.random().toString();

        const { createRuntime: createParentRuntime } = configureRuntime({
          token: defaultToken,
        })({
          onError: emptyFunction,
          apiFactory: {
            eventEmitter: () => parentEventEmitter,
          },
        });

        const { createRuntime: createChildRuntime } = configureRuntime({
          token: "",
          locale: "en",
        })({
          onError: emptyFunction,
          apiFactory: { eventEmitter: () => childEventEmitter },
        });

        const parentRuntime = createParentRuntime();
        const childRuntime = createChildRuntime({
          runtime: parentRuntime,
        });

        childRuntime.on("eventEmitter", (eventEmitter, { setState }) =>
          eventEmitter?.on((value) => {
            setState("token", value);
          })
        );

        await childRuntime.booted();

        childEventEmitter.emit(Math.random().toString());
        expect(childRuntime.getState("token")).toBe(defaultToken);

        const random = Math.random().toString();
        parentEventEmitter.emit(random);

        expect(childRuntime.getState("token")).toBe(random);
        expect(parentRuntime.getState("token")).toBe(random);
      });

      it("returns an 'off' function to remove handlers of events from the parent runtime if the parent runtime has the given api", async () => {
        const { createRuntime: createParentRuntime } = configureRuntime(
          defaultState
        )({
          onError: emptyFunction,
          apiFactory: {
            eventEmitter: () => new FakeEventEmitter(),
          },
        });

        const { createRuntime: createChildRuntime } = configureRuntime(
          defaultState
        )({
          onError: emptyFunction,
          apiFactory: { eventEmitter: () => new FakeEventEmitter() },
        });

        const parentRuntime = createParentRuntime();
        const childRuntime = createChildRuntime({
          runtime: parentRuntime,
        });

        const offSpy = jest.fn();
        const off = childRuntime.on("eventEmitter", () => offSpy);

        off();

        await waitForExpect(() => {
          expect(offSpy).toHaveBeenCalledTimes(1);
        });
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

        const parentRuntime = createParentRuntime();
        const childRuntime = createChildRuntime({ runtime: parentRuntime });

        expect(parentRuntime.loader.locale.loading).toBe(false);

        childRuntime.load(
          "locale",
          () => new Promise((resolve) => setTimeout(resolve, 0))
        );

        expect(parentRuntime.loader.locale.loading).toBe(true);
        expect(childRuntime.loader.locale.loading).toBe(true);
        await waitForExpect(() => {
          expect(parentRuntime.loader.locale.loading).toBe(false);
          expect(childRuntime.loader.locale.loading).toBe(false);
        });

        parentRuntime.load(
          "token",
          () => new Promise((resolve) => setTimeout(resolve, 0))
        );

        expect(parentRuntime.loader.token.loading).toBe(true);
        expect(childRuntime.loader.token.loading).toBe(true);
        await waitForExpect(() => {
          expect(parentRuntime.loader.token.loading).toBe(false);
          expect(childRuntime.loader.token.loading).toBe(false);
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

        const parentRuntime = createParentRuntime();
        const childRuntime = createChildRuntime({ runtime: parentRuntime });
        const errorMssg = Math.random().toString();

        expect(parentRuntime.loader.locale.loading).toBe(false);
        expect(childRuntime.loader.locale.loading).toBe(false);

        childRuntime
          .load(
            "locale",
            () =>
              new Promise((_resolve, reject) =>
                setTimeout(() => reject(errorMssg), 10)
              )
          )
          .catch(emptyFunction);

        expect(childRuntime.loader.locale.loading).toBe(true);
        expect(parentRuntime.loader.locale.loading).toBe(true);

        await waitForExpect(() => {
          expect(childRuntime.loader.locale.error).toBe(errorMssg);
          expect(childRuntime.loader.locale.loading).toBe(false);
          expect(parentRuntime.loader.locale.error).toBe(errorMssg);
          expect(parentRuntime.loader.locale.loading).toBe(false);
        });
      });

      it("throws an Error from either the parent runtime or the child runtime if an invalid state prop is used", async () => {
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

        const parentRuntime = createParentRuntime();
        const childRuntime = createChildRuntime({ runtime: parentRuntime });
        let errorMessage;

        try {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          childRuntime.loader.invalid_prop.loading;
        } catch (error: any) {
          errorMessage = error.message;
        }

        expect(errorMessage).toBe(`"invalid_prop" is not a valid state prop.
Did you forget to set "invalid_prop" to a value in your defaultState (including null or undefined) when calling configureState function?
Current valid props are: locale, token, user`);
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

        const parentRuntime = createParentRuntime();
        const childRuntime = createChildRuntime({ runtime: parentRuntime });

        const childPromise = childRuntime.load("locale", () => "title");
        const parentPromise = parentRuntime.load("locale", () => "title");

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

        const parentRuntime = createParentRuntime();
        const childRuntime = createChildRuntime({ runtime: parentRuntime });
        const random = Math.random().toString();
        const childLoader = jest.fn(() => Promise.resolve(random));
        const parentLoader = jest.fn(() => Promise.resolve(random));

        const childValue = await childRuntime.load("locale", childLoader);
        const parentValue = await parentRuntime.load("locale", parentLoader);

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

        const parentRuntime = createParentRuntime();
        const childRuntime = createChildRuntime({ runtime: parentRuntime });

        const randomLocale = Math.random().toString();
        await childRuntime.load("locale", () => Promise.reject(randomLocale));

        expect(childRuntime.loader.locale.error).toBe(randomLocale);
        expect(childRuntime.loader.locale.loading).toBe(false);
        expect(parentRuntime.loader.locale.error).toBe(randomLocale);
        expect(parentRuntime.loader.locale.loading).toBe(false);

        const randomToken = Math.random().toString();
        await parentRuntime.load("token", () => Promise.reject(randomToken));

        expect(parentRuntime.loader.token.error).toBe(randomToken);
        expect(parentRuntime.loader.token.loading).toBe(false);
        expect(parentRuntime.loader.token.error).toBe(randomToken);
        expect(parentRuntime.loader.token.loading).toBe(false);
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

        const parentRuntime = createParentRuntime();
        const childRuntime = createChildRuntime({ runtime: parentRuntime });

        const random = Math.random().toString();
        const childValue = await childRuntime.load("locale", () =>
          Promise.resolve(random)
        );
        const parentValue = await childRuntime.load("locale", () =>
          Promise.resolve(random)
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

        const parentRuntime = createParentRuntime();
        const childRuntime = createChildRuntime({ runtime: parentRuntime });

        const random = Math.random().toString();
        const loader = jest.fn(() => Promise.resolve(random));

        childRuntime.load("locale", loader);
        childRuntime.load("locale", loader);
        parentRuntime.load("locale", loader);
        childRuntime.load("locale", loader);
        parentRuntime.load("locale", loader);
        await childRuntime.load("locale", loader);
        await parentRuntime.load("locale", loader);

        expect(childRuntime.getState("locale")).toBe(random);
        expect(parentRuntime.getState("locale")).toBe(random);

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

        const parentRuntime = createParentRuntime();
        const childRuntime = createChildRuntime({ runtime: parentRuntime });

        let errorMessage;

        try {
          await childRuntime
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

        const parentRuntime = createParentRuntime();
        const childRuntime = createChildRuntime({ runtime: parentRuntime });

        const randomLocale = Math.random().toString();
        expect(childRuntime.getState("locale")).toBe("en");
        expect(parentRuntime.getState("locale")).toBe("en");

        childRuntime.load("locale", () => Promise.resolve(randomLocale));

        expect(childRuntime.getState("locale")).toBe("en");
        expect(parentRuntime.getState("locale")).toBe("en");
        expect(await parentRuntime.loaded("locale")).toBe(randomLocale);
        expect(await childRuntime.loaded("locale")).toBe(randomLocale);

        const randomToken = Math.random().toString();
        expect(childRuntime.getState("token")).toBe(undefined);
        expect(parentRuntime.getState("token")).toBe(undefined);

        parentRuntime.load("token", () => Promise.resolve(randomToken));

        expect(childRuntime.getState("token")).toBe(undefined);
        expect(parentRuntime.getState("token")).toBe(undefined);
        expect(await parentRuntime.loaded("token")).toBe(randomToken);
        expect(await childRuntime.loaded("token")).toBe(randomToken);
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

        const parentRuntime = createParentRuntime();
        const childRuntime = createChildRuntime({ runtime: parentRuntime });

        expect(childRuntime.getState("locale")).toBe("en");
        expect(await childRuntime.loaded("locale")).toBe("en");
        expect(parentRuntime.getState("locale")).toBe("en");
        expect(await parentRuntime.loaded("locale")).toBe("en");
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

        const parentRuntime = createParentRuntime();
        const childRuntime = createChildRuntime({ runtime: parentRuntime });
        const randomLocale = Math.random().toString();
        const randomUser = { username: Math.random().toString() };

        expect(parentRuntime.getState("locale")).toBe("en");
        expect(parentRuntime.getState("user")).toBe(undefined);

        parentRuntime.load("locale", () => Promise.resolve(randomLocale));
        parentRuntime.load("user", () => Promise.resolve(randomUser));

        const result = await childRuntime.loaded();

        expect(result).toEqual({ locale: randomLocale, user: randomUser });
        expect(childRuntime.getState("locale")).toBe(randomLocale);
        expect(childRuntime.getState("user")).toBe(randomUser);
        expect(parentRuntime.getState("locale")).toBe(randomLocale);
        expect(parentRuntime.getState("user")).toBe(randomUser);
      });
    });
  });
});

describe("booted", () => {
  it(`resolves after all the read lazy async api is ready`, async () => {
    let isFirebaseResolved = false;
    const runtime = configureRuntime<SharedState>(defaultState)({
      onError: emptyFunction,
      apiFactory: {
        firebase: ({ load }) =>
          new Promise<FakeFirebase>((resolve) => {
            load("token", fetchToken).then((token) => {
              isFirebaseResolved = true;
              if (token) resolve(new FakeFirebase(token));
            });
          }),
      },
    }).createRuntime();

    // reading this api to boot firebase api
    runtime.api.firebase;

    await runtime.booted();

    expect(isFirebaseResolved).toBe(true);
  });

  it(`resolves before all the lazy async api if the lazy api is not read`, async () => {
    let isFirebaseResolved = false;
    const runtime = configureRuntime<SharedState>(defaultState)({
      onError: emptyFunction,
      apiFactory: {
        firebase: ({ load }) =>
          new Promise<FakeFirebase>((resolve) => {
            load("token", fetchToken).then((token) => {
              isFirebaseResolved = true;
              if (token) resolve(new FakeFirebase(token));
            });
          }),
      },
    }).createRuntime();

    // we don't read firebase from api before calling booted
    await runtime.booted();

    expect(isFirebaseResolved).toBe(false);
  });

  it(`returns false if it can't resolve any of the async apis`, async () => {
    const runtime = configureRuntime(defaultState)({
      onError: emptyFunction,
      apiFactory: {
        a: () => Promise.resolve(1),
        b: () => Promise.resolve(2),
        c: () => Promise.reject(3),
      },
    }).createRuntime();

    // reading this api to boot c api
    runtime.api.c;

    const isBooted = await runtime.booted();

    expect(isBooted).toBe(false);
  });

  it(`returns true if it can resolve all the async api`, async () => {
    const runtime = configureRuntime(defaultState)({
      onError: emptyFunction,
      apiFactory: {
        a: () => Promise.resolve(1),
        b: () => Promise.resolve(2),
        c: () => Promise.resolve(3),
      },
    }).createRuntime();

    const isBooted = await runtime.booted();

    expect(isBooted).toBe(true);
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

  it("throws an Error if an invalid state prop is used", () => {
    let errorMessage;

    try {
      const runtime = createRuntime();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      runtime.getState("invalid_prop");
    } catch (error: any) {
      errorMessage = error.message;
    }

    expect(errorMessage).toBe(`"invalid_prop" is not a valid state prop.
Did you forget to set "invalid_prop" to a value in your defaultState (including null or undefined) when calling configureState function?
Current valid props are: locale, token, user`);
  });

  it("can return state given a state prop", () => {
    const runtime = createRuntime();
    expect(runtime.getState("locale")).toBe("en");
  });

  it("can set new state given a state prop", () => {
    const runtime = createRuntime();
    const random = Math.random().toString();

    runtime.setState("locale", "pt");
    expect(runtime.getState("locale")).toBe("pt");

    runtime.setState("locale", random);
    expect(runtime.getState("locale")).toBe(random);
  });
});

describe("subscribe", () => {
  it("throws an Error if an invalid state prop is used", async () => {
    let errorMessage;

    const runtime = createRuntime();
    try {
      await runtime
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .subscribe("invalid_prop", emptyFunction);
    } catch (error: any) {
      errorMessage = error.message;
    }

    expect(errorMessage).toBe(`"invalid_prop" is not a valid state prop.
Did you forget to set "invalid_prop" to a value in your defaultState (including null or undefined) when calling configureState function?
Current valid props are: locale, token, user`);
  });

  it("calls subscribers of a state prop when its value changes", () => {
    const runtime = createRuntime();
    const subscriber = jest.fn();
    const random = Math.random().toString();

    runtime.subscribe("locale", subscriber);
    runtime.setState("locale", random);

    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber).toHaveBeenCalledWith(random, false, undefined);
  });

  it("it won't call any subscribers of a prop if the current value is shallowly equal to the new value", () => {
    const runtime = createRuntime();
    const subscriber = jest.fn();

    runtime.subscribe("locale", subscriber);
    runtime.setState("locale", runtime.getState("locale"));

    expect(subscriber).not.toHaveBeenCalled();
  });

  it("only adds the same subscriber once given the same state prop", () => {
    const runtime = createRuntime();
    const subscriber = jest.fn();
    const random = Math.random().toString();

    runtime.subscribe("locale", subscriber);
    runtime.subscribe("locale", subscriber);

    runtime.setState("locale", random);

    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber).toHaveBeenCalledWith(random, false, undefined);
  });

  it("can unsubscribe and stops calling the subscriber", () => {
    const runtime = createRuntime();
    const subscriberA = jest.fn();
    const subscriberB = jest.fn();
    const unsubscribeA = runtime.subscribe("locale", subscriberA);
    const unsubscribeB = runtime.subscribe("locale", subscriberB);
    const random = Math.random().toString();

    runtime.setState("locale", random);

    expect(subscriberA).toHaveBeenCalledTimes(1);
    expect(subscriberA).toHaveBeenCalledWith(random, false, undefined);
    expect(subscriberB).toHaveBeenCalledTimes(1);
    expect(subscriberB).toHaveBeenCalledWith(random, false, undefined);

    subscriberA.mockReset();
    subscriberB.mockReset();

    unsubscribeB();

    runtime.setState("locale", Math.random().toString());
    expect(subscriberB).toHaveBeenCalledTimes(0);
    expect(subscriberA).toHaveBeenCalledTimes(1);

    unsubscribeA();

    subscriberA.mockReset();
    runtime.setState("locale", Math.random().toString());
    expect(subscriberA).toHaveBeenCalledTimes(0);
  });

  it("can use the same subscriber for different state props", () => {
    const runtime = createRuntime();
    const randomA = Math.random().toString();
    const randomB = { username: randomA };
    const subscriber = jest.fn();

    runtime.subscribe("locale", subscriber);
    runtime.subscribe("user", subscriber);
    runtime.setState("locale", randomA);
    runtime.setState("user", randomB);

    expect(subscriber).toHaveBeenCalledTimes(2);
    expect(subscriber).toHaveBeenCalledWith(randomA, false, undefined);
    expect(subscriber).toHaveBeenCalledWith(randomB, false, undefined);
  });
});

describe("api", () => {
  it(`returns a value from the api given an api prop`, async () => {
    const runtime = createRuntime();
    const firebase = await runtime.api.firebase;

    expect(firebase.toString()).toBe("FakeFirebase");
    expect(runtime.api.eventEmitter).toBe(eventEmitter);
  });

  it(`lazy initializes a value from the api when it's read`, async () => {
    const runtime = createRuntime();

    expect(Object.keys(runtime.api).length).toEqual(0);

    await runtime.api.firebase;
    expect(Object.keys(runtime.api).length).toEqual(1);

    runtime.api.eventEmitter;
    expect(Object.keys(runtime.api).length).toEqual(2);
  });

  it(`throws an error if an api prop is set with a new value`, async () => {
    const runtime = createRuntime();

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
    const runtime = configureRuntime<SharedState>(defaultState)({
      onError: emptyFunction,
      apiFactory: {
        firebase: ({ load }) =>
          new Promise<FakeFirebase>((resolve) => {
            load("token", fetchToken).then((token) => {
              firebaseResolvedCounter++;
              if (token) resolve(new FakeFirebase(token));
            });
          }),
      },
    }).createRuntime();

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
    }).createRuntime();

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
    }).createRuntime();

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
        eventEmitter1: async ({ onCleanup, load }) => {
          await load("token", fetchToken);
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
    }).createRuntime();

    // reading these apis to invoke their factory functions
    runtime.api.eventEmitter1;
    runtime.api.eventEmitter2;

    expect(cleanup1).not.toHaveBeenCalled();
    expect(initialised1).toHaveBeenCalledTimes(1);
    expect(cleanup2).not.toHaveBeenCalled();
    expect(initialised2).toHaveBeenCalledTimes(1);

    runtime.cleanup();
    expect(cleanup1).toHaveBeenCalled();
    expect(cleanup2).toHaveBeenCalled();

    // reading these apis to invoke factory their functions
    runtime.api.eventEmitter1;
    runtime.api.eventEmitter2;
    expect(initialised1).toHaveBeenCalledTimes(2);
    expect(initialised2).toHaveBeenCalledTimes(2);

    // these should not invoke any factory function because runtime.cleanup() didn't run again
    runtime.api.eventEmitter1;
    runtime.api.eventEmitter2;
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
    }).createRuntime();

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
    const cleanup1 = jest.fn();
    const cleanup2 = jest.fn();
    const runtime = configureRuntime<SharedState>(defaultState)({
      onError: emptyFunction,
      apiFactory: {
        eventEmitter1: ({ onCleanup, cleanup }) => {
          onCleanup(cleanup1);
          cleanup();

          return new FakeEventEmitter();
        },
        eventEmitter2: ({ onCleanup }) => {
          onCleanup(cleanup2);
          return new FakeEventEmitter();
        },
      },
    }).createRuntime();

    // reading this api to invoke eventEmitter1 factory function
    await runtime.api.eventEmitter1;

    expect(cleanup1).toHaveBeenCalled();
    expect(cleanup2).not.toHaveBeenCalled();
  });

  it(`calls the cleanup function of the parent runtime if a prop is passed and there is a parent runtime`, async () => {
    const cleanupParent1 = jest.fn();
    const cleanupParent2 = jest.fn();
    const cleanupChild1 = jest.fn();
    const cleanupChild2 = jest.fn();
    const { createRuntime: createParentRuntime } =
      configureRuntime<SharedState>(defaultState)({
        onError: emptyFunction,
        apiFactory: {
          eventEmitter1: ({ onCleanup, cleanup }) => {
            onCleanup(cleanupParent1);
            cleanup();

            return new FakeEventEmitter();
          },
          eventEmitter2: ({ onCleanup }) => {
            onCleanup(cleanupParent2);
            return new FakeEventEmitter();
          },
        },
      });

    const { createRuntime: createChildRuntime } = configureRuntime(
      defaultState
    )({
      onError: emptyFunction,
      apiFactory: {
        eventEmitter1: ({ onCleanup, cleanup }) => {
          onCleanup(cleanupChild1);
          cleanup();

          return new FakeEventEmitter();
        },
        eventEmitter2: ({ onCleanup }) => {
          onCleanup(cleanupChild2);
          return new FakeEventEmitter();
        },
      },
    });

    const parentRuntime = createParentRuntime();
    const childRuntime = createChildRuntime({ runtime: parentRuntime });

    childRuntime.api.eventEmitter1;
    childRuntime.cleanup("eventEmitter1");

    expect(cleanupParent1).toHaveBeenCalled();
    expect(cleanupParent2).not.toHaveBeenCalled();
    expect(cleanupChild1).not.toHaveBeenCalled();
    expect(cleanupChild2).not.toHaveBeenCalled();
  });

  it(`calls all the cleanup function of the parent runtime if there is a parent runtime`, async () => {
    const cleanupParent1 = jest.fn();
    const cleanupParent2 = jest.fn();
    const cleanupChild1 = jest.fn();
    const cleanupChild2 = jest.fn();
    const { createRuntime: createParentRuntime } =
      configureRuntime<SharedState>(defaultState)({
        onError: emptyFunction,
        apiFactory: {
          eventEmitter1: ({ onCleanup, cleanup }) => {
            onCleanup(cleanupParent1);
            cleanup();

            return new FakeEventEmitter();
          },
          eventEmitter2: ({ onCleanup }) => {
            onCleanup(cleanupParent2);
            return new FakeEventEmitter();
          },
        },
      });

    const { createRuntime: createChildRuntime } = configureRuntime(
      defaultState
    )({
      onError: emptyFunction,
      apiFactory: {
        eventEmitter1: ({ onCleanup, cleanup }) => {
          onCleanup(cleanupChild1);
          cleanup();

          return new FakeEventEmitter();
        },
        eventEmitter2: ({ onCleanup }) => {
          onCleanup(cleanupChild2);
          return new FakeEventEmitter();
        },
      },
    });

    const parentRuntime = createParentRuntime();
    const childRuntime = createChildRuntime({ runtime: parentRuntime });

    childRuntime.api.eventEmitter1;
    childRuntime.api.eventEmitter2;
    childRuntime.cleanup();

    expect(cleanupParent1).toHaveBeenCalled();
    expect(cleanupParent2).toHaveBeenCalled();
    expect(cleanupChild1).not.toHaveBeenCalled();
    expect(cleanupChild2).not.toHaveBeenCalled();
  });
});

describe("on", () => {
  it("throws an error when using 'on' if there is no api", () => {
    const onError = jest.fn();
    const runtime = configureRuntime(defaultState)({
      onError,
    }).createRuntime();
    expect(() => {
      runtime.on("this-prop-does-not-exist", () => emptyFunction);
    }).toThrow(`No api found in runtime for prop this-prop-does-not-exist`);
  });

  it("throws an error when using 'on' if there is api but it doesn't have the given api prop", () => {
    const onError = jest.fn();
    const runtime = configureRuntime(defaultState)({
      onError,
      apiFactory: {
        counter: () => 0,
      },
    }).createRuntime();
    expect(() => {
      runtime.on(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        "this-prop-does-not-exist",
        () => emptyFunction
      );
    }).toThrow(`No api found in runtime for prop this-prop-does-not-exist`);
  });

  it("adds events to update local state", async () => {
    const runtime = createRuntime();
    runtime.on("eventEmitter", (eventEmitter, { setState }) =>
      eventEmitter?.on((value) => {
        setState("locale", value);
      })
    );

    await runtime.booted();

    const random = Math.random().toString();
    eventEmitter.emit(random);

    expect(runtime.getState("locale")).toBe(random);
  });

  it("passes a resolved api value to the callback even if the api prop is async", async () => {
    const localEventEmitter = new FakeEventEmitter();
    const { createRuntime } = configureRuntime<SharedState>(defaultState)({
      onError: emptyFunction,
      apiFactory: {
        eventEmitter: async () =>
          new Promise<FakeEventEmitter>((resolve) => {
            setTimeout(() => resolve(localEventEmitter), 10);
          }),
      },
    });
    const runtime = createRuntime();

    expect(isPromise(runtime.api.eventEmitter)).toBe(true);

    runtime.on("eventEmitter", (eventEmitter, { setState }) =>
      eventEmitter.on((value) => {
        setState("locale", value);
      })
    );

    await runtime.booted();

    const random = Math.random().toString();
    localEventEmitter.emit(random);

    expect(runtime.getState("locale")).toBe(random);
  });

  it("returns an 'off' function to remove event handlers", async () => {
    const runtime = createRuntime();
    const offSpy = jest.fn();
    const off = runtime.on("eventEmitter", (eventEmitter, state) => {
      return offSpy;
    });

    off();

    await waitForExpect(() => {
      expect(offSpy).toHaveBeenCalledTimes(1);
    });
  });
});

describe("loader", () => {
  it("is loading true for a given state prop while the associated load function is working and it is false before and after", async () => {
    const runtime = createRuntime();
    expect(runtime.loader.locale.loading).toBe(false);

    runtime.load(
      "locale",
      () => new Promise((resolve) => setTimeout(resolve, 0))
    );

    expect(runtime.loader.locale.loading).toBe(true);
    await waitForExpect(() => {
      expect(runtime.loader.locale.loading).toBe(false);
    });
  });

  it("has an error if the load function of a given state prop fails", async () => {
    const runtime = createRuntime();

    expect(runtime.loader.locale.loading).toBe(false);

    const errorMssg = Math.random().toString();
    runtime
      .load(
        "locale",
        () =>
          new Promise((_resolve, reject) =>
            setTimeout(() => reject(errorMssg), 10)
          )
      )
      .catch(() => null);

    expect(runtime.loader.locale.loading).toBe(true);

    await waitForExpect(() => {
      expect(runtime.loader.locale.error).toBe(errorMssg);
      expect(runtime.loader.locale.loading).toBe(false);
    });
  });

  it("throws an Error if an invalid state prop is used", async () => {
    let errorMessage;

    const runtime = createRuntime();
    try {
      await runtime;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      runtime.loader.invalid_prop.loading;
    } catch (error: any) {
      errorMessage = error.message;
    }

    expect(errorMessage).toBe(`"invalid_prop" is not a valid state prop.
Did you forget to set "invalid_prop" to a value in your defaultState (including null or undefined) when calling configureState function?
Current valid props are: locale, token, user`);
  });
});

describe("load", () => {
  it("always returns a promise given a valid state prop", () => {
    const runtime = createRuntime();
    const value = runtime.load("locale", () => "title");

    expect(isPromise(value)).toBe(true);
  });

  it("can load a value asynchronously", async () => {
    const runtime = createRuntime();
    const random = Math.random().toString();
    const value = await runtime.load(
      "locale",
      () => new Promise((resolve) => setTimeout(() => resolve(random), 10))
    );

    expect(value).toBe(random);
  });

  it("sets an error message if it fails", async () => {
    const runtime = createRuntime();
    const random = Math.random().toString();
    const value = await runtime.load("locale", () => Promise.reject(random));

    expect(runtime.loader.locale.error).toBe(random);
    expect(runtime.loader.locale.loading).toBe(false);
  });

  it("doesn't run on the server", async () => {
    const { window } = global;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete global.window;
    const runtime = createRuntime();
    const random = Math.random().toString();
    const value = await runtime.load(
      "locale",
      () => new Promise((resolve) => setTimeout(() => resolve(random), 10))
    );

    global.window = window;
    expect(value).toBe("en");
  });

  it("it only loads a value once even if `load` is called many times for the same state prop ", async () => {
    const random = Math.random().toString();
    const runtime = createRuntime();
    const loader = jest.fn(
      () =>
        new Promise<string>((resolve) => setTimeout(() => resolve(random), 2))
    );

    await runtime.load("locale", loader);
    runtime.load("locale", loader);
    runtime.load("locale", loader);
    runtime.load("locale", loader);
    await runtime.load("locale", loader);

    expect(runtime.getState("locale")).toBe(random);

    expect(loader).toHaveBeenCalledTimes(1);
  });

  it("throws an Error if an invalid state prop is used", async () => {
    let errorMessage;

    const runtime = createRuntime();
    try {
      await runtime
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
    const runtime = createRuntime();
    const random = Math.random().toString();

    expect(runtime.getState("locale")).toBe("en");

    runtime.load(
      "locale",
      () => new Promise((resolve) => setTimeout(() => resolve(random), 5))
    );

    expect(runtime.getState("locale")).toBe("en");
    expect(await runtime.loaded("locale")).toBe(random);
  });

  it("returns a promise that resolves to the default value of a given state prop if that prop wasn't updated", async () => {
    const runtime = createRuntime();

    expect(runtime.getState("locale")).toBe("en");
    expect(await runtime.loaded("locale")).toBe("en");
  });

  it("returns a promise that resolves to the entire state after all the loaders have resolved if no state prop is given", async () => {
    const runtime = createRuntime();
    const randomA = Math.random().toString();
    const randomB = { username: Math.random().toString() };

    expect(runtime.getState("locale")).toBe("en");

    runtime.load(
      "locale",
      () => new Promise((resolve) => setTimeout(() => resolve(randomA), 2))
    );
    runtime.load(
      "user",
      () => new Promise((resolve) => setTimeout(() => resolve(randomB), 3))
    );

    const result = await runtime.loaded();

    expect(result).toEqual({ locale: randomA, user: randomB });
    expect(runtime.getState("locale")).toBe(randomA);
    expect(runtime.getState("user")).toBe(randomB);
  });

  it("throws an Error if an invalid state prop is used", async () => {
    let errorMessage;

    const runtime = createRuntime();
    try {
      await runtime
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
