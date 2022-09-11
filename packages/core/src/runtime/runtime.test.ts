import waitForExpect from "wait-for-expect";

import { configureRuntime } from "./runtime";
import { isPromise } from "../utils";

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
  onError: () => {
    // empty
  },
  api: {
    eventEmitter,
    gql: new Promise((resolve) => resolve(new FakeGQLClient())),
    firebase: ({ load, loaded }) =>
      new Promise<FakeFirebase>((resolve) => {
        load("token", fetchToken);
        loaded("token").then((token) => {
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
      api: {
        eventEmitter: Promise.reject(randomError),
      },
    }).createRuntime();

    await runtime.booted();

    expect(onError).toHaveBeenCalledWith(randomError, undefined);
  });

  it(`calls onError if it can't create any sync api`, async () => {
    const onError = jest.fn();
    const randomError = new Error(Math.random().toString());
    const runtime = configureRuntime(defaultState)({
      onError,
      api: {
        eventEmitter: Promise.reject(randomError),
        firebase: () => Promise.reject(randomError),
      },
    }).createRuntime();

    // firebase is lazy loaded when we read it
    runtime.api.firebase;

    await runtime.booted();

    expect(onError).toHaveBeenCalledWith(randomError, undefined);
    expect(onError).toHaveBeenCalledTimes(2);
  });

  it(`doesn't call onError if it can create the api`, async () => {
    const onError = jest.fn();
    const randomError = new Error(Math.random().toString());
    const runtime = configureRuntime(defaultState)({
      onError,
      api: {
        eventEmitter: Promise.resolve(randomError),
      },
    }).createRuntime();

    await runtime.booted();

    expect(onError).not.toHaveBeenCalled();
  });
});

describe("createRuntime", () => {
  it(`returns a runtime when it's invoked`, async () => {
    const api = { a: Promise.resolve(1) };
    const defaultLoader = {
      loading: false,
      error: undefined,
    };
    const { createRuntime } = configureRuntime(defaultState)({
      onError: () => {
        // empty
      },
      api,
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
      onError: () => {
        // empty
      },
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
});

describe("booted", () => {
  it(`resolves when all the eager async api is ready`, async () => {
    let isGqlResolved = false;
    let isFirebaseResolved = false;
    const runtime = configureRuntime<SharedState>(defaultState)({
      onError: () => {
        // empty
      },
      api: {
        gql: new Promise<FakeGQLClient>((resolve) => {
          isGqlResolved = true;
          resolve(new FakeGQLClient());
        }),
        firebase: ({ load, loaded }) =>
          new Promise<FakeFirebase>((resolve) => {
            load("token", fetchToken);
            loaded("token").then((token) => {
              isFirebaseResolved = true;
              if (token) resolve(new FakeFirebase(token));
            });
          }),
      },
    }).createRuntime();

    await runtime.booted();

    expect(isGqlResolved).toBe(true);
    expect(isFirebaseResolved).toBe(false);
  });

  it(`resolves after all the read lazy async api is ready`, async () => {
    let isFirebaseResolved = false;
    const runtime = configureRuntime<SharedState>(defaultState)({
      onError: () => {
        // empty
      },
      api: {
        firebase: ({ load, loaded }) =>
          new Promise<FakeFirebase>((resolve) => {
            load("token", fetchToken);
            loaded("token").then((token) => {
              isFirebaseResolved = true;
              if (token) resolve(new FakeFirebase(token));
            });
          }),
      },
    }).createRuntime();

    // reading firebase from api which triggers firebase initialization
    runtime.api.firebase;

    await runtime.booted();

    expect(isFirebaseResolved).toBe(true);
  });

  it(`resolves before all the lazy async api if the lazy api is not read`, async () => {
    let isFirebaseResolved = false;
    const runtime = configureRuntime<SharedState>(defaultState)({
      onError: () => {
        // empty
      },
      api: {
        firebase: ({ load, loaded }) =>
          new Promise<FakeFirebase>((resolve) => {
            load("token", fetchToken);
            loaded("token").then((token) => {
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

  it(`returns false if it can't resolve all the async api`, async () => {
    const runtime = configureRuntime(defaultState)({
      onError: () => {
        // empty
      },
      api: {
        a: Promise.resolve(1),
        b: Promise.resolve(2),
        c: Promise.reject(3),
      },
    }).createRuntime();

    const isBooted = await runtime.booted();

    expect(isBooted).toBe(false);
  });

  it(`returns true if it can resolve all the async api`, async () => {
    const runtime = configureRuntime(defaultState)({
      onError: () => {
        // empty
      },
      api: {
        a: Promise.resolve(1),
        b: Promise.resolve(2),
        c: Promise.resolve(3),
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
        .subscribe("invalid_prop", () => {
          // empty
        });
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
      onError: () => {
        // empty
      },
      api: {
        firebase: ({ load, loaded }) =>
          new Promise<FakeFirebase>((resolve) => {
            load("token", fetchToken);
            loaded("token").then((token) => {
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

describe("on", () => {
  it("throws an error when using 'on' if there is no api", () => {
    const onError = jest.fn();
    const runtime = configureRuntime(defaultState)({
      onError,
    }).createRuntime();
    expect(() => {
      runtime.on("this-prop-does-not-exist", () => () => {
        // empty
      });
    }).toThrow(`No api found in runtime for prop this-prop-does-not-exist`);
  });

  it("throws an error when using 'on' if there is api but it doesn't have the given api prop", () => {
    const onError = jest.fn();
    const runtime = configureRuntime(defaultState)({
      onError,
      api: {
        counter: () => 0,
      },
    }).createRuntime();
    expect(() => {
      runtime.on(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        "this-prop-does-not-exist",
        () => () => {
          // empty
        }
      );
    }).toThrow(`No api found in runtime for prop this-prop-does-not-exist`);
  });

  it("adds remote events to update local state", async () => {
    const runtime = createRuntime();
    runtime.on("eventEmitter", (eventEmitter, { setState }) => {
      eventEmitter?.on((value) => {
        setState("locale", value);
      });

      return () => {
        // empty
      };
    });

    await runtime.booted();

    const random = Math.random().toString();
    eventEmitter.emit(random);

    expect(runtime.getState("locale")).toBe(random);
  });

  it("passes a resolved api value to the callback even if the api prop is async", async () => {
    const localEventEmitter = new FakeEventEmitter();
    const { createRuntime } = configureRuntime<SharedState>(defaultState)({
      onError: () => {
        // empty
      },
      api: {
        eventEmitter: async () =>
          new Promise<FakeEventEmitter>((resolve) => {
            setTimeout(() => resolve(localEventEmitter), 10);
          }),
      },
    });
    const runtime = createRuntime();

    expect(isPromise(runtime.api.eventEmitter)).toBe(true);

    runtime.on("eventEmitter", (eventEmitter, { setState }) => {
      eventEmitter.on((value) => {
        setState("locale", value);
      });

      return () => {
        // empty
      };
    });

    await runtime.booted();

    const random = Math.random().toString();
    localEventEmitter.emit(random);

    expect(runtime.getState("locale")).toBe(random);
  });

  it("returns an 'off' function to remove handlers of remote events", async () => {
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
        .load("invalid_prop", () => {
          // empty
        });
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

  it("returns a promise that resolves to the default value of a given state prop if that prop didn't run a load function", async () => {
    const runtime = createRuntime();

    expect(runtime.getState("locale")).toBe("en");
    expect(await runtime.loaded("locale")).toBe("en");
  });

  it("returns a promise that resolves to undefined after all the loaders have resolved if no state prop is given", async () => {
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
        .loaded("invalid_prop", () => {
          // empty
        });
    } catch (error: any) {
      errorMessage = error.message;
    }

    expect(errorMessage).toBe(`"invalid_prop" is not a valid state prop.
Did you forget to set "invalid_prop" to a value in your defaultState (including null or undefined) when calling configureState function?
Current valid props are: locale, token, user`);
  });
});
