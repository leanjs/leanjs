import waitForExpect from "wait-for-expect";

import { configureStore, isPromise } from "./store";

const defaultState = {
  locale: "en",
  token: undefined,
  user: undefined,
};

interface State {
  locale: string;
  token?: string;
  user?: {
    username: string;
  };
}

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

const { createStore } = configureStore<State>(defaultState)({
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

describe("configureStore", () => {
  it(`calls onError if it can't create any async context`, async () => {
    const onError = jest.fn();
    const randomError = new Error(Math.random().toString());
    const store = configureStore(defaultState)({
      onError,
      context: {
        eventEmitter: Promise.reject(randomError),
      },
    }).createStore();

    await store.booted();

    expect(onError).toHaveBeenCalledWith(randomError);
  });

  it(`calls onError if it can't create any sync context`, async () => {
    const onError = jest.fn();
    const randomError = new Error(Math.random().toString());
    const store = configureStore(defaultState)({
      onError,
      context: {
        eventEmitter: () => {
          throw randomError;
        },
      },
    }).createStore();

    await store.booted();

    expect(onError).toHaveBeenCalledWith(randomError);
  });

  it(`doesn't call onError if it can create the context`, async () => {
    const onError = jest.fn();
    const randomError = new Error(Math.random().toString());
    const store = configureStore(defaultState)({
      onError: () => {},
      context: {
        eventEmitter: Promise.resolve(randomError),
      },
    }).createStore();

    await store.booted();

    expect(onError).not.toHaveBeenCalled();
  });
});

describe("createStore", () => {
  it(`returns a store when it's invoked`, async () => {
    const context = { a: Promise.resolve(1) };
    const defaultLoader = {
      loading: false,
      error: undefined,
    };
    const { createStore } = configureStore(defaultState)({
      onError: () => {},
      context,
    });

    const store = createStore();

    expect(store.state.locale).toEqual(defaultState.locale);
    expect(store.state.user).toEqual(defaultState.user);
    expect(store.state.token).toEqual(defaultState.token);
    expect(store.context).toEqual(context);
    expect(store.loader.locale).toEqual(defaultLoader);
    expect(store.loader.user).toEqual(defaultLoader);
    expect(store.loader.token).toEqual(defaultLoader);
    expect(typeof store.booted).toBe("function");
    expect(typeof store.load).toBe("function");
    expect(typeof store.loaded).toBe("function");
    expect(typeof store.on).toBe("function");
    expect(typeof store.subscribe).toBe("function");
  });

  it(`can receive some initial state that overrides the default state`, async () => {
    const { createStore } = configureStore<State>(defaultState)({
      onError: () => {},
    });
    const username = Math.random().toString();

    const store = createStore({
      initialState: { ...defaultState, user: { username } },
    });

    expect(store.state.user?.username).toBe(username);
  });
});

describe("booted", () => {
  it(`resolves when all the async context is ready`, async () => {
    let isGqlResolved = false;
    let isFirebaseResolved = false;
    const store = configureStore<State>(defaultState)({
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
    }).createStore();

    await store.booted();

    expect(isFirebaseResolved).toBe(true);
    expect(isGqlResolved).toBe(true);
  });

  it(`returns false if it can't resolve all the async context`, async () => {
    const store = configureStore(defaultState)({
      onError: () => {},
      context: {
        a: Promise.resolve(1),
        b: Promise.resolve(2),
        c: Promise.reject(3),
      },
    }).createStore();

    const isBooted = await store.booted();

    expect(isBooted).toBe(false);
  });

  it(`returns true if it can resolve all the async context`, async () => {
    const store = configureStore(defaultState)({
      onError: () => {},
      context: {
        a: Promise.resolve(1),
        b: Promise.resolve(2),
        c: Promise.resolve(3),
      },
    }).createStore();

    const isBooted = await store.booted();

    expect(isBooted).toBe(true);
  });
});

describe("state", () => {
  it("throws an error if no default state is passed when configuring a store", () => {
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      configureStore()();
    }).toThrow("default state is required to configure a store");
  });

  it("throws an Error if an invalid state prop is used", () => {
    let errorMessage;

    try {
      const store = createStore();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      store.state.invalid_prop;
    } catch (error: any) {
      errorMessage = error.message;
    }

    expect(errorMessage).toBe(`"invalid_prop" is not a valid state prop.
Did you forget to set "invalid_prop" to a value in your defaultState (including null or undefined) when calling configureState function?
Current valid props are: locale, token, user`);
  });

  it("can return state given a state prop", () => {
    const store = createStore();
    expect(store.state.locale).toBe("en");
  });

  it("can set new state given a state prop", () => {
    const store = createStore();
    const random = Math.random().toString();

    store.state.locale = "pt";
    expect(store.state.locale).toBe("pt");

    store.state.locale = random;
    expect(store.state.locale).toBe(random);
  });
});

describe("subscribe", () => {
  it("throws an Error if an invalid state prop is used", async () => {
    let errorMessage;

    const store = createStore();
    try {
      await store
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
    const store = createStore();
    const subscriber = jest.fn();
    const random = Math.random().toString();

    store.subscribe("locale", subscriber);
    store.state.locale = random;

    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber).toHaveBeenCalledWith(random);
  });

  it("it won't call any subscribers of a prop if the current value is shallowly equal to the new value", () => {
    const store = createStore();
    const subscriber = jest.fn();

    store.subscribe("locale", subscriber);
    store.state.locale = store.state.locale;

    expect(subscriber).not.toHaveBeenCalled();
  });

  it("only adds the same subscriber once given the same state prop", () => {
    const store = createStore();
    const subscriber = jest.fn();
    const random = Math.random().toString();

    store.subscribe("locale", subscriber);
    store.subscribe("locale", subscriber);

    store.state.locale = random;

    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber).toHaveBeenCalledWith(random);
  });

  it("can unsubscribe and stops calling the subscriber", () => {
    const store = createStore();
    const subscriberA = jest.fn();
    const subscriberB = jest.fn();
    const unsubscribeA = store.subscribe("locale", subscriberA);
    const unsubscribeB = store.subscribe("locale", subscriberB);
    const random = Math.random().toString();

    store.state.locale = random;

    expect(subscriberA).toHaveBeenCalledTimes(1);
    expect(subscriberA).toHaveBeenCalledWith(random);
    expect(subscriberB).toHaveBeenCalledTimes(1);
    expect(subscriberB).toHaveBeenCalledWith(random);

    subscriberA.mockReset();
    subscriberB.mockReset();

    unsubscribeB();

    store.state.locale = Math.random().toString();
    expect(subscriberB).toHaveBeenCalledTimes(0);
    expect(subscriberA).toHaveBeenCalledTimes(1);

    unsubscribeA();

    subscriberA.mockReset();
    store.state.locale = Math.random().toString();
    expect(subscriberA).toHaveBeenCalledTimes(0);
  });

  it("can use the same subscriber for different state props", () => {
    const store = createStore();
    const randomA = Math.random().toString();
    const randomB = { username: randomA };
    const subscriber = jest.fn();

    store.subscribe("locale", subscriber);
    store.subscribe("user", subscriber);
    store.state.locale = randomA;
    store.state.user = randomB;

    expect(subscriber).toHaveBeenCalledTimes(2);
    expect(subscriber).toHaveBeenCalledWith(randomA);
    expect(subscriber).toHaveBeenCalledWith(randomB);
  });
});

describe("context", () => {
  it(`returns a value from the context given a context prop`, async () => {
    const store = createStore();
    const firebase = await store.context.firebase;

    expect(firebase.toString()).toBe("FakeFirebase");
    expect(store.context.eventEmitter).toBe(eventEmitter);
  });

  it(`throws an error if a context prop is set with a new value`, async () => {
    const store = createStore();

    let errorMessage;
    try {
      store.context.eventEmitter = eventEmitter;
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
    const store = configureStore(defaultState)({
      onError,
    }).createStore();
    expect(() => {
      store.on("this-prop-does-not-exist", () => () => {});
    }).toThrow(`No context found in store for prop this-prop-does-not-exist`);
  });

  it("throws an error when using 'on' if there is context but it doesn't have the given context prop", () => {
    const onError = jest.fn();
    const store = configureStore(defaultState)({
      onError,
      context: {
        counter: () => 0,
      },
    }).createStore();
    expect(() => {
      store.on(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        "this-prop-does-not-exist",
        () => () => {}
      );
    }).toThrow(`No context found in store for prop this-prop-does-not-exist`);
  });

  it("adds remote events to update local state", async () => {
    const store = createStore();
    store.on("eventEmitter", (eventEmitter, state) => {
      eventEmitter?.on((value) => {
        state.locale = value;
      });

      return () => {};
    });

    await store.booted();

    const random = Math.random().toString();
    eventEmitter.emit(random);

    expect(store.state.locale).toBe(random);
  });

  it("passes a resolved context value to the callback even if the context prop is async", async () => {
    const localEventEmitter = new FakeEventEmitter();
    const { createStore } = configureStore<State>(defaultState)({
      onError: () => {},
      context: {
        eventEmitter: async () =>
          new Promise<FakeEventEmitter>((resolve) => {
            setTimeout(() => resolve(localEventEmitter), 10);
          }),
      },
    });
    const store = createStore();

    expect(isPromise(store.context.eventEmitter)).toBe(true);

    store.on("eventEmitter", (eventEmitter, state) => {
      eventEmitter.on((value) => {
        state.locale = value;
      });

      return () => {};
    });

    await store.booted();

    const random = Math.random().toString();
    localEventEmitter.emit(random);

    expect(store.state.locale).toBe(random);
  });

  it("returns an 'off' function to remove handlers of remote events", async () => {
    const store = createStore();
    const offSpy = jest.fn();
    const off = store.on("eventEmitter", (eventEmitter, state) => {
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
    const store = createStore();
    expect(store.loader.locale.loading).toBe(false);

    store.load(
      "locale",
      () => new Promise((resolve) => setTimeout(resolve, 0))
    );

    expect(store.loader.locale.loading).toBe(true);
    await waitForExpect(() => {
      expect(store.loader.locale.loading).toBe(false);
    });
  });

  it("has an error if the load function of a given state prop fails", async () => {
    const store = createStore();

    expect(store.loader.locale.loading).toBe(false);

    const errorMssg = Math.random().toString();
    store
      .load(
        "locale",
        () =>
          new Promise((_resolve, reject) =>
            setTimeout(() => reject(errorMssg), 10)
          )
      )
      .catch(() => null);

    expect(store.loader.locale.loading).toBe(true);

    await waitForExpect(() => {
      expect(store.loader.locale.error).toBe(errorMssg);
      expect(store.loader.locale.loading).toBe(false);
    });
  });

  it("throws an Error if an invalid state prop is used", async () => {
    let errorMessage;

    const store = createStore();
    try {
      await store;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      store.loader.invalid_prop.loading;
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
    const store = createStore();
    const value = store.load("locale", () => Promise.resolve("title"));

    expect(isPromise(value)).toBe(true);
  });

  it("can load a value asynchronously", async () => {
    const store = createStore();
    const random = Math.random().toString();
    const value = await store.load(
      "locale",
      () => new Promise((resolve) => setTimeout(() => resolve(random), 10))
    );

    expect(value).toBe(random);
  });

  it("it only loads a value once even if `load` is called many times for the same state prop ", async () => {
    const random = Math.random().toString();
    const store = createStore();
    const loader = jest.fn(
      () =>
        new Promise<string>((resolve) => setTimeout(() => resolve(random), 2))
    );

    await store.load("locale", loader);
    Promise.all([
      store.load("locale", loader),
      store.load("locale", loader),
      store.load("locale", loader),
    ]);
    await store.load("locale", loader);

    expect(store.state.locale).toBe(random);

    expect(loader).toHaveBeenCalledTimes(1);
  });

  it("throws an Error if an invalid state prop is used", async () => {
    let errorMessage;

    const store = createStore();
    try {
      await store
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
    const store = createStore();
    const random = Math.random().toString();

    expect(store.state.locale).toBe("en");

    store.load(
      "locale",
      () => new Promise((resolve) => setTimeout(() => resolve(random), 5))
    );

    expect(store.state.locale).toBe("en");
    expect(await store.loaded("locale")).toBe(random);
  });

  it("returns a promise that resolves to the default value of a given state prop if that prop didn't run a load function", async () => {
    const store = createStore();

    expect(store.state.locale).toBe("en");
    expect(await store.loaded("locale")).toBe("en");
  });

  it("returns a promise that resolves to undefined after all the loaders have resolved if no state prop is given", async () => {
    const store = createStore();
    const randomA = Math.random().toString();
    const randomB = { username: Math.random().toString() };

    expect(store.state.locale).toBe("en");

    store.load(
      "locale",
      () => new Promise((resolve) => setTimeout(() => resolve(randomA), 2))
    );
    store.load(
      "user",
      () => new Promise((resolve) => setTimeout(() => resolve(randomB), 3))
    );

    const result = await store.loaded();

    expect(result).toBe(undefined);
    expect(store.state.locale).toBe(randomA);
    expect(store.state.user).toBe(randomB);
  });

  it("throws an Error if an invalid state prop is used", async () => {
    let errorMessage;

    const store = createStore();
    try {
      await store
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
