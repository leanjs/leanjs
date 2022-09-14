import type {
  BaseShape,
  KeyOf,
  Key,
  Subscriber,
  InternalLoaderState,
  LoaderState,
  BaseApiFactory,
  ConfigureRuntimeOptions,
  Runtime,
  ValuesFromApiFactory,
  OnCallback,
  ValueFromApiFactorySync,
  CreateRuntimeArgs,
  Unsubscribe,
  Request,
  OnErrorOptions,
} from "./types";

import { isPromise } from "../utils";
import { Cleanup } from "..";

const runCreateRuntime =
  <
    State extends BaseShape = BaseShape,
    Prop extends KeyOf<State> = KeyOf<State>
  >(
    initialState: State
  ) =>
  <
    ApiFactory extends BaseApiFactory<State, Prop>,
    ApiProp extends KeyOf<ApiFactory>
  >({
    apiFactory,
    onError,
    request,
    parent,
  }: {
    request?: Request;
    parent?: Runtime<any, any, any>;
  } & ConfigureRuntimeOptions<State, Prop, ApiFactory>): Runtime<
    State,
    Prop,
    ApiFactory,
    ApiProp
  > => {
    function logError(error: any, options?: OnErrorOptions) {
      onError(
        error && error.stack && error.message
          ? (error as Error)
          : new Error(typeof error === "string" ? error : "Unknown error"),
        options
      );
    }

    const isBrowser = typeof window !== "undefined";
    const url = request?.url
      ? request.url
      : isBrowser
      ? window.location.href
      : undefined;
    const currentState =
      typeof structuredClone === "undefined"
        ? { ...initialState }
        : structuredClone(initialState);
    const subscribers = new Map<Prop, Set<Subscriber<State[Prop]>>>();
    const loaders = new Map<Key | undefined, InternalLoaderState>();
    const apiPromises = new Map<ApiProp, Promise<any>>();
    const cleanups = new Set<Cleanup>();

    const callSubscribers = <P extends Prop>(prop: P) => {
      subscribers
        .get(prop)
        ?.forEach((subscriber) =>
          subscriber(getState(prop), loader[prop].loading, loader[prop].error)
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
    const runOrThrow = (callback?: (...args: any[]) => any, ...args: any[]) => {
      if (callback) {
        return callback(...args);
      } else {
        throw 1;
      }
    };

    const getState = <P extends Prop>(prop: P) => {
      try {
        return runOrThrow(parent?.getState, prop);
      } catch {
        validateProp(prop);

        return currentState[prop];
      }
    };

    const setState = <P extends Prop>(prop: P, value: State[P]): void => {
      try {
        runOrThrow(parent?.setState, prop, value);
      } catch (error) {
        validateProp(prop);
        if (currentState[prop] !== value) {
          currentState[prop] = value;

          callSubscribers(prop);
        }
      }
    };

    const loaded = async <P extends Prop>(prop?: P): Promise<any> => {
      try {
        return runOrThrow(parent?.loaded, prop);
      } catch {
        if (prop) {
          validateProp(prop);
          await loaders.get(prop)?.promise;

          return currentState[prop];
        } else {
          await Promise.all(
            Array.from(loaders.values()).map(({ promise }) => promise)
          );

          return currentState;
        }
      }
    };

    const loader = new Proxy({} as Record<Prop, LoaderState>, {
      get: (_, prop: Prop) => {
        try {
          const loaderItem = parent?.loader[prop];
          if (loaderItem) {
            return loaderItem;
          } else {
            throw 1;
          }
        } catch {
          validateProp(prop);
          const value = loaders.get(prop);

          return {
            error: value?.error,
            loading: !!value?.loading,
          };
        }
      },
    });

    const subscribe = <P extends Prop>(
      prop: P,
      subscriber: Subscriber<State[P]>
    ): Unsubscribe => {
      try {
        return runOrThrow(parent?.subscribe, prop, subscriber);
      } catch {
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
      }
    };

    const load = async <P extends Prop>(
      prop: P,
      loader: () => Promise<State[P]> | State[P]
    ) => {
      try {
        return runOrThrow(parent?.load, prop, loader);
      } catch {
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
              setState(prop, newValue);
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
            logError(error);
          }
        }

        return getState(prop);
      }
    };

    const onCleanup = (cleanup: Cleanup) => {
      cleanups.add(cleanup);
    };

    const apiFactoryArguments = {
      isBrowser,
      request: {
        ...request,
        url,
      },
      load,
      loaded,
      loader,
      setState,
      getState,
      onCleanup,
    };

    const api = new Proxy({} as ValuesFromApiFactory<ApiFactory>, {
      get(target, prop: ApiProp) {
        const parentItem = parent?.api?.[prop];
        if (parentItem) {
          return parentItem;
        } else if (target[prop] === undefined) {
          let item = apiFactory?.[prop];
          if (typeof item === "function") {
            try {
              item = item(apiFactoryArguments);
            } catch (error) {
              logError(error);
            }
          }

          if (isPromise(item)) {
            apiPromises.set(prop, item);
            item.catch(logError);
          }
          target[prop] = item as any;
        }

        return target[prop];
      },
      set(_, prop) {
        throw new Error(
          `Cannot assign to read only api property '${prop.toString()}'`
        );
      },
    });

    const booted = async () => {
      try {
        await Promise.all(apiPromises.values());

        return parent?.booted() ?? true;
      } catch (error) {
        return false;
      }
    };

    const on = <P extends ApiProp>(
      prop: P,
      callback: OnCallback<ApiFactory, P, State, Prop>
    ) => {
      const apiItem = api[prop];
      if (!apiItem) {
        throw new Error(`No api found in runtime for prop ${String(prop)}.`);
      }
      const offPromise = Promise.resolve(apiItem)
        .then((apiValue) =>
          callback(apiValue as ValueFromApiFactorySync<ApiFactory, P>, {
            getState,
            setState,
          })
        )
        .catch(logError);

      return () => {
        offPromise.then((off) => off?.()).catch(logError);
      };
    };

    const cleanup = () => {
      cleanups.forEach((cleanup) => cleanup());
      cleanups.clear();
    };

    return {
      api,
      loader,
      getState,
      setState,
      booted,
      on,
      subscribe,
      loaded,
      load,
      logError,
      cleanup,
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

  return <ApiFactory extends BaseApiFactory<State, Prop>>({
    apiFactory,
    onError,
  }: ConfigureRuntimeOptions<State, Prop, ApiFactory>) => ({
    createRuntime: ({
      initialState,
      request,
      runtime,
    }: CreateRuntimeArgs<State, Prop, ApiFactory> = {}) =>
      runCreateRuntime<State, Prop>(initialState ?? defaultState)({
        apiFactory,
        onError,
        request,
        parent: runtime,
      }),
  });
};
