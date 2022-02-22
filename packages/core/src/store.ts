import type {
  BaseShape,
  KeyOf,
  Key,
  Subscriber,
  InternalLoaderState,
  LoaderState,
  BaseCtxFactory,
  ConfigureStoreOptions,
  Store,
  ValuesFromCtxFactory,
  OnCallback,
  ValueFromCtxFactorySync,
  CreateStore,
  Unsubscribe,
} from "./types";

export const isPromise = (arg?: any): arg is Promise<any> =>
  typeof arg?.then === "function";

const createStore =
  <
    State extends BaseShape = BaseShape,
    Prop extends KeyOf<State> = KeyOf<State>
  >(
    defaultState: State
  ) =>
  <
    CtxFactory extends BaseCtxFactory<State, Prop>,
    CtxProp extends KeyOf<CtxFactory>
  >({
    context: ctxFactory,
    onError,
    request,
  }: ConfigureStoreOptions<State, Prop, CtxFactory>): Store<
    State,
    Prop,
    CtxFactory,
    CtxProp
  > => {
    const isBrowser = typeof window !== "undefined";
    const url = request?.url
      ? request.url
      : isBrowser
      ? window.location.href
      : undefined;
    const currentState = { ...defaultState };
    const subscribers = new Map<Prop, Set<Subscriber<State[Prop]>>>();
    const loaders = new Map<Key | undefined, InternalLoaderState>();
    const ctxPromises = new Map<CtxProp, Promise<any>>();

    function validateProp(prop: Prop) {
      if (!(prop in currentState)) {
        throw new Error(`"${String(prop)}" is not a valid state prop.
Did you forget to set "${String(
          prop
        )}" to a value in your defaultState (including null or undefined) when calling configureState function?
Current valid props are: ${Object.keys(currentState).join(", ")}`);
      }
    }

    const state = new Proxy<State>(currentState, {
      get: (target, prop: Prop) => {
        validateProp(prop);

        return target[prop];
      },
      set: (target, prop: Prop, value) => {
        validateProp(prop);
        if (target[prop] !== value) {
          target[prop] = value;
          subscribers.get(prop)?.forEach((subscriber) => subscriber(value));
        }

        return true;
      },
    });

    const loaded = async <P extends Prop>(prop?: P): Promise<any> => {
      if (prop) {
        validateProp(prop);
        await loaders.get(prop)?.promise;

        return currentState[prop];
      } else {
        await Promise.all(
          [...loaders.values()].map((loader) => loader.promise)
        );

        return;
      }
    };

    const loader = new Proxy({} as Record<Prop, LoaderState>, {
      get: (_, prop: Prop) => {
        validateProp(prop);
        const value = loaders.get(prop);

        return {
          error: value?.error,
          loading: !!value?.loading,
        };
      },
    });

    const subscribe = (
      prop: Prop,
      subscriber: Subscriber<State[Prop]>
    ): Unsubscribe => {
      validateProp(prop);
      const propSubscribers =
        subscribers.get(prop) ?? new Set<Subscriber<State[Prop]>>();
      propSubscribers.add(subscriber);
      subscribers.set(prop, propSubscribers);

      return () => {
        propSubscribers.delete(subscriber);
      };
    };

    const load = async <P extends Prop>(
      prop: P,
      loader: () => Promise<State[P]> | State[P]
    ) => {
      validateProp(prop);

      const loaderState = loaders.get(prop);
      if (loaderState?.done) {
        // do nothing
      } else if (loaderState?.promise) {
        await loaderState.promise;
      } else {
        try {
          const promiseOrValue = loader();
          if (isPromise(promiseOrValue)) {
            loaders.set(prop, {
              loading: true,
              promise: promiseOrValue,
            });
            currentState[prop] = await promiseOrValue;
          } else {
            currentState[prop] = promiseOrValue;
          }
          loaders.set(prop, {
            loading: false,
            done: true,
          });
        } catch (error) {
          loaders.set(prop, {
            loading: false,
            done: true,
            error: (error as Error)?.message ?? error,
          });
          onError(error);
        }
      }

      return currentState[prop];
    };

    const runtime = {
      isBrowser,
      request: {
        ...request,
        url,
      },
      load,
      loaded,
      loader,
      state,
    };

    const emptyCtx = {} as ValuesFromCtxFactory<CtxFactory, CtxProp>;
    const context = Object.freeze(
      ctxFactory
        ? (Object.keys(ctxFactory || {}) as Array<CtxProp>).reduce(
            (acc, key) => {
              let item = ctxFactory[key];
              if (typeof item === "function") {
                try {
                  item = item(runtime);
                } catch (error) {
                  onError(error);
                }
              }
              if (isPromise(item)) {
                ctxPromises.set(key, item);
                item.catch(onError);
              }
              acc[key] = item as any;

              return acc;
            },
            emptyCtx
          )
        : emptyCtx
    );

    const booted = async () => {
      try {
        await Promise.all(ctxPromises.values());
        return true;
      } catch (error) {
        return false;
      }
    };

    const on = <P extends CtxProp>(
      prop: P,
      callback: OnCallback<CtxFactory, P, State>
    ) => {
      if (!context) {
        throw new Error(`No context found in store, "on" is not allowed`);
      }
      if (!context[prop]) {
        throw new Error(`No context found in store for prop ${prop}.`);
      }
      const offPromise = Promise.resolve(context[prop])
        .then((ctxValue) =>
          callback(ctxValue as ValueFromCtxFactorySync<CtxFactory, P>, state)
        )
        .catch(onError);

      return () => {
        offPromise.then((off) => off?.()).catch(onError);
      };
    };

    return {
      state,
      context,
      loader,
      booted,
      on,
      subscribe,
      loaded,
      load,
    };
  };

export const configureStore = <
  State extends BaseShape = BaseShape,
  Prop extends KeyOf<State> = KeyOf<State>
>(
  defaultState: State
) => {
  if (!defaultState)
    throw new Error(`default state is required to configure a store`);

  return <CtxFactory extends BaseCtxFactory<State, Prop>>({
    context,
    onError,
  }: ConfigureStoreOptions<State, Prop, CtxFactory>) => ({
    createStore: ({ initialState, request }: CreateStore<State> = {}) =>
      createStore<State>(initialState ?? defaultState)({
        context,
        onError,
        request,
      }),
  });
};
