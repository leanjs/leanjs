import type {
  BaseShape,
  KeyOf,
  Key,
  Subscriber,
  InternalLoaderState,
  LoaderState,
  BaseCtxFactory,
  ConfigureRuntimeOptions,
  Runtime,
  ValuesFromCtxFactory,
  OnCallback,
  ValueFromCtxFactorySync,
  CreateRuntimeArgs,
  Unsubscribe,
} from "./types";

export const isPromise = (arg?: any): arg is Promise<any> =>
  typeof arg?.then === "function";

const createRuntime =
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
  }: ConfigureRuntimeOptions<State, Prop, CtxFactory>): Runtime<
    State,
    Prop,
    CtxFactory,
    CtxProp
  > => {
    function log(error: any) {
      onError(
        error && error.stack && error.message
          ? (error as Error)
          : new Error(typeof error === "string" ? error : "Unknown error")
      );
    }

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
    const callSubscribers = <P extends Prop>(prop: P) => {
      subscribers
        .get(prop)
        ?.forEach((subscriber) =>
          subscriber(state[prop], loader[prop].loading, loader[prop].error)
        );
    };

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

          callSubscribers(prop);
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
          Array.from(loaders.values()).map((loader) => loader.promise)
        );

        return undefined;
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

    const subscribe = <P extends Prop>(
      prop: P,
      subscriber: Subscriber<State[P]>
    ): Unsubscribe => {
      validateProp(prop);
      const propSubscribers =
        subscribers.get(prop) ?? new Set<Subscriber<State[P]>>();
      propSubscribers.add(subscriber);
      subscribers.set(
        prop,
        propSubscribers as unknown as Set<Subscriber<State[Prop]>>
      );

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

      if (!isBrowser) {
        loaders.set(prop, {
          loading: true,
        });
      } else if (loaderState?.done || loaderState?.loading) {
        // do nothing
      } else {
        try {
          const promiseOrValue = loader();
          const doneLoading = (newValue: State[P]) => {
            loaders.set(prop, {
              loading: false,
              done: true,
            });
            state[prop] = newValue;
          };
          if (isPromise(promiseOrValue)) {
            loaders.set(prop, {
              loading: true,
              promise: promiseOrValue,
            });
            callSubscribers(prop);
            doneLoading(await promiseOrValue);
          } else {
            doneLoading(promiseOrValue);
          }
        } catch (error) {
          loaders.set(prop, {
            loading: false,
            done: true,
            error: (error as Error)?.message ?? error,
          });
          callSubscribers(prop);
          log(error);
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
                  log(error);
                }
              }
              if (isPromise(item)) {
                ctxPromises.set(key, item);
                item.catch(log);
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
        throw new Error(`No context found in runtime, "on" is not allowed`);
      }
      if (!context[prop]) {
        throw new Error(`No context found in runtime for prop ${prop}.`);
      }
      const offPromise = Promise.resolve(context[prop])
        .then((ctxValue) =>
          callback(ctxValue as ValueFromCtxFactorySync<CtxFactory, P>, state)
        )
        .catch(log);

      return () => {
        offPromise.then((off) => off?.()).catch(log);
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

export const configureRuntime = <
  State extends BaseShape = BaseShape,
  Prop extends KeyOf<State> = KeyOf<State>
>(
  defaultState: State
) => {
  if (!defaultState)
    throw new Error(`default state is required to configure a runtime`);

  return <CtxFactory extends BaseCtxFactory<State, Prop>>({
    context,
    onError,
  }: ConfigureRuntimeOptions<State, Prop, CtxFactory>) => {
    const internalCreateRuntime = ({
      initialState,
      request,
    }: CreateRuntimeArgs<State> = {}) =>
      createRuntime<State>(initialState ?? defaultState)({
        context,
        onError,
        request,
      });

    internalCreateRuntime.log = onError;

    return { createRuntime: internalCreateRuntime };
  };
};
