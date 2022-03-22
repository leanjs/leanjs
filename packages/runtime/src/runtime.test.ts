import waitForExpect from "wait-for-expect";

import { configureRuntime, isPromise } from "./runtime";

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
  constructor(token: string) {}
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
  onError: () => {},
  context: {
    eventEmitter,
    gql: new Promise((resolve) => resolve(new FakeGQLClient())),
    firebase: ({ load }) =>
      new Promise<FakeFirebase>((resolve) => {
        load("token", fetchToken).then((token) => {
          if (token) resolve(new FakeFirebase(token));
        });
      }),
  },
});

describe("configureRuntime", () => {
  it(`calls onError if it can't create any async context`, async () => {
    const onError = jest.fn();
    const randomError = new Error(Math.random().toString());
    const runtime = configureRuntime(defaultState)({
      onError,
      context: {
        eventEmitter: Promise.reject(randomError),
      },
    }).createRuntime();

    await runtime.booted();

    expect(onError).toHaveBeenCalledWith(randomError);
  });

  it(`calls onError if it can't create any sync context`, async () => {
    const onError = jest.fn();
    const randomError = new Error(Math.random().toString());
    const runtime = configureRuntime(defaultState)({
      onError,
      context: {
        eventEmitter: () => {
          throw randomError;
        },
      },
    }).createRuntime();

    await runtime.booted();

    expect(onError).toHaveBeenCalledWith(randomError);
  });

  it(`doesn't call onError if it can create the context`, async () => {
    const onError = jest.fn();
    const randomError = new Error(Math.random().toString());
    const runtime = configureRuntime(defaultState)({
      onError: () => {},
      context: {
        eventEmitter: Promise.resolve(randomError),
      },
    }).createRuntime();

    await runtime.booted();

    expect(onError).not.toHaveBeenCalled();
  });
});

describe("createRuntime", () => {
  it(`returns a runtime when it's invoked`, async () => {
    const context = { a: Promise.resolve(1) };
    const defaultLoader = {
      loading: false,
      error: undefined,
    };
    const { createRuntime } = configureRuntime(defaultState)({
      onError: () => {},
      context,
    });

    const runtime = createRuntime();

    expect(runtime.state.locale).toEqual(defaultState.locale);
    expect(runtime.state.user).toEqual(defaultState.user);
    expect(runtime.state.token).toEqual(defaultState.token);
    expect(runtime.context).toEqual(context);
    expect(runtime.loader.locale).toEqual(defaultLoader);
    expect(runtime.loader.user).toEqual(defaultLoader);
    expect(runtime.loader.token).toEqual(defaultLoader);
    expect(typeof runtime.booted).toBe("function");
    expect(typeof runtime.load).toBe("function");
    expect(typeof runtime.loaded).toBe("function");
    expect(typeof runtime.on).toBe("function");
    expect(typeof runtime.subscribe).toBe("function");
  });

  it(`can receive some initial state that overrides the default state`, async () => {
    const { createRuntime } = configureRuntime<SharedState>(defaultState)({
      onError: () => {},
    });
    const username = Math.random().toString();

    const runtime = createRuntime({
      initialState: { ...defaultState, user: { username } },
    });

    expect(runtime.state.user?.username).toBe(username);
  });
});

describe("booted", () => {
  it(`resolves when all the async context is ready`, async () => {
    let isGqlResolved = false;
    let isFirebaseResolved = false;
    const runtime = configureRuntime<SharedState>(defaultState)({
      onError: () => {},
      context: {
        gql: new Promise<FakeGQLClient>((resolve) => {
          isGqlResolved = true;
          resolve(new FakeGQLClient());
        }),
        firebase: ({ load }) =>
          new Promise<FakeFirebase>((resolve) => {
            load("token", fetchToken).then((token) => {
              isFirebaseResolved = true;
              if (token) resolve(new FakeFirebase(token));
            });
          }),
      },
    }).createRuntime();

    await runtime.booted();

    expect(isFirebaseResolved).toBe(true);
    expect(isGqlResolved).toBe(true);
  });

  it(`returns false if it can't resolve all the async context`, async () => {
    const runtime = configureRuntime(defaultState)({
      onError: () => {},
      context: {
        a: Promise.resolve(1),
        b: Promise.resolve(2),
        c: Promise.reject(3),
      },
    }).createRuntime();

    const isBooted = await runtime.booted();

    expect(isBooted).toBe(false);
  });

  it(`returns true if it can resolve all the async context`, async () => {
    const runtime = configureRuntime(defaultState)({
      onError: () => {},
      context: {
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
      //@ts-ignore
      runtime.state.invalid_prop;
    } catch (error: any) {
      errorMessage = error.message;
    }

    expect(errorMessage).toBe(`"invalid_prop" is not a valid state prop.
Did you forget to set "invalid_prop" to a value in your defaultState (including null or undefined) when calling configureState function?
Current valid props are: locale, token, user`);
  });

  it("can return state given a state prop", () => {
    const runtime = createRuntime();
    expect(runtime.state.locale).toBe("en");
  });

  it("can set new state given a state prop", () => {
    const runtime = createRuntime();
    const random = Math.random().toString();

    runtime.state.locale = "pt";
    expect(runtime.state.locale).toBe("pt");

    runtime.state.locale = random;
    expect(runtime.state.locale).toBe(random);
  });
});

describe("subscribe", () => {
  it("throws an Error if an invalid state prop is used", async () => {
    let errorMessage;

    const runtime = createRuntime();
    try {
      await runtime
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        .subscribe("invalid_prop", () => {});
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
    runtime.state.locale = random;

    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber).toHaveBeenCalledWith(random, false, undefined);
  });

  it("it won't call any subscribers of a prop if the current value is shallowly equal to the new value", () => {
    const runtime = createRuntime();
    const subscriber = jest.fn();

    runtime.subscribe("locale", subscriber);
    runtime.state.locale = runtime.state.locale;

    expect(subscriber).not.toHaveBeenCalled();
  });

  it("only adds the same subscriber once given the same state prop", () => {
    const runtime = createRuntime();
    const subscriber = jest.fn();
    const random = Math.random().toString();

    runtime.subscribe("locale", subscriber);
    runtime.subscribe("locale", subscriber);

    runtime.state.locale = random;

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

    runtime.state.locale = random;

    expect(subscriberA).toHaveBeenCalledTimes(1);
    expect(subscriberA).toHaveBeenCalledWith(random, false, undefined);
    expect(subscriberB).toHaveBeenCalledTimes(1);
    expect(subscriberB).toHaveBeenCalledWith(random, false, undefined);

    subscriberA.mockReset();
    subscriberB.mockReset();

    unsubscribeB();

    runtime.state.locale = Math.random().toString();
    expect(subscriberB).toHaveBeenCalledTimes(0);
    expect(subscriberA).toHaveBeenCalledTimes(1);

    unsubscribeA();

    subscriberA.mockReset();
    runtime.state.locale = Math.random().toString();
    expect(subscriberA).toHaveBeenCalledTimes(0);
  });

  it("can use the same subscriber for different state props", () => {
    const runtime = createRuntime();
    const randomA = Math.random().toString();
    const randomB = { username: randomA };
    const subscriber = jest.fn();

    runtime.subscribe("locale", subscriber);
    runtime.subscribe("user", subscriber);
    runtime.state.locale = randomA;
    runtime.state.user = randomB;

    expect(subscriber).toHaveBeenCalledTimes(2);
    expect(subscriber).toHaveBeenCalledWith(randomA, false, undefined);
    expect(subscriber).toHaveBeenCalledWith(randomB, false, undefined);
  });
});

describe("context", () => {
  it(`returns a value from the context given a context prop`, async () => {
    const runtime = createRuntime();
    const firebase = await runtime.context.firebase;

    expect(firebase.toString()).toBe("FakeFirebase");
    expect(runtime.context.eventEmitter).toBe(eventEmitter);
  });

  it(`throws an error if a context prop is set with a new value`, async () => {
    const runtime = createRuntime();

    let errorMessage;
    try {
      runtime.context.eventEmitter = eventEmitter;
    } catch (error: any) {
      errorMessage = error.message;
    }

    expect(errorMessage).toBe(
      `Cannot assign to read only property 'eventEmitter' of object '#<Object>'`
    );
  });
});

describe("on", () => {
  it("throws an error when using 'on' if there is no context", () => {
    const onError = jest.fn();
    const runtime = configureRuntime(defaultState)({
      onError,
    }).createRuntime();
    expect(() => {
      runtime.on("this-prop-does-not-exist", () => () => {});
    }).toThrow(`No context found in runtime for prop this-prop-does-not-exist`);
  });

  it("throws an error when using 'on' if there is context but it doesn't have the given context prop", () => {
    const onError = jest.fn();
    const runtime = configureRuntime(defaultState)({
      onError,
      context: {
        counter: () => 0,
      },
    }).createRuntime();
    expect(() => {
      runtime.on(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        "this-prop-does-not-exist",
        () => () => {}
      );
    }).toThrow(`No context found in runtime for prop this-prop-does-not-exist`);
  });

  it("adds remote events to update local state", async () => {
    const runtime = createRuntime();
    runtime.on("eventEmitter", (eventEmitter, state) => {
      eventEmitter?.on((value) => {
        state.locale = value;
      });

      return () => {};
    });

    await runtime.booted();

    const random = Math.random().toString();
    eventEmitter.emit(random);

    expect(runtime.state.locale).toBe(random);
  });

  it("passes a resolved context value to the callback even if the context prop is async", async () => {
    const localEventEmitter = new FakeEventEmitter();
    const { createRuntime } = configureRuntime<SharedState>(defaultState)({
      onError: () => {},
      context: {
        eventEmitter: async () =>
          new Promise<FakeEventEmitter>((resolve) => {
            setTimeout(() => resolve(localEventEmitter), 10);
          }),
      },
    });
    const runtime = createRuntime();

    expect(isPromise(runtime.context.eventEmitter)).toBe(true);

    runtime.on("eventEmitter", (eventEmitter, state) => {
      eventEmitter.on((value) => {
        state.locale = value;
      });

      return () => {};
    });

    await runtime.booted();

    const random = Math.random().toString();
    localEventEmitter.emit(random);

    expect(runtime.state.locale).toBe(random);
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
      //@ts-ignore
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

  it("it only loads a value once even if `load` is called many times for the same state prop ", async () => {
    const random = Math.random().toString();
    const runtime = createRuntime();
    const loader = jest.fn(
      () =>
        new Promise<string>((resolve) => setTimeout(() => resolve(random), 2))
    );

    await runtime.load("locale", loader);
    Promise.all([
      runtime.load("locale", loader),
      runtime.load("locale", loader),
      runtime.load("locale", loader),
    ]);
    await runtime.load("locale", loader);

    expect(runtime.state.locale).toBe(random);

    expect(loader).toHaveBeenCalledTimes(1);
  });

  it("throws an Error if an invalid state prop is used", async () => {
    let errorMessage;

    const runtime = createRuntime();
    try {
      await runtime
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        .load("invalid_prop", () => {});
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

    expect(runtime.state.locale).toBe("en");

    runtime.load(
      "locale",
      () => new Promise((resolve) => setTimeout(() => resolve(random), 5))
    );

    expect(runtime.state.locale).toBe("en");
    expect(await runtime.loaded("locale")).toBe(random);
  });

  it("returns a promise that resolves to the default value of a given state prop if that prop didn't run a load function", async () => {
    const runtime = createRuntime();

    expect(runtime.state.locale).toBe("en");
    expect(await runtime.loaded("locale")).toBe("en");
  });

  it("returns a promise that resolves to undefined after all the loaders have resolved if no state prop is given", async () => {
    const runtime = createRuntime();
    const randomA = Math.random().toString();
    const randomB = { username: Math.random().toString() };

    expect(runtime.state.locale).toBe("en");

    runtime.load(
      "locale",
      () => new Promise((resolve) => setTimeout(() => resolve(randomA), 2))
    );
    runtime.load(
      "user",
      () => new Promise((resolve) => setTimeout(() => resolve(randomB), 3))
    );

    const result = await runtime.loaded();

    expect(result).toBe(undefined);
    expect(runtime.state.locale).toBe(randomA);
    expect(runtime.state.user).toBe(randomB);
  });

  it("throws an Error if an invalid state prop is used", async () => {
    let errorMessage;

    const runtime = createRuntime();
    try {
      await runtime
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        .loaded("invalid_prop", () => {});
    } catch (error: any) {
      errorMessage = error.message;
    }

    expect(errorMessage).toBe(`"invalid_prop" is not a valid state prop.
Did you forget to set "invalid_prop" to a value in your defaultState (including null or undefined) when calling configureState function?
Current valid props are: locale, token, user`);
  });
});
