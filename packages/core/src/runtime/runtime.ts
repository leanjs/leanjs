import type {
  BaseShape,
  KeyOf,
  Key,
  StateListener,
  InternalLoaderState,
  LoaderState,
  BaseApiFactory,
  ConfigureRuntimeOptions,
  Runtime,
  ValuesFromApiFactory,
  CreateRuntimeArgs,
  Unsubscribe,
  Request,
  RuntimeContext,
} from "./types";

import { createAppError, isPromise } from "../utils";
import { Cleanup } from "..";

const runCreateRuntime =
  <State extends BaseShape, Prop extends KeyOf<State>>(initialState: State) =>
  <
    ApiFactory extends BaseApiFactory<State, Prop>,
    ApiProp extends KeyOf<ApiFactory>
  >({
    apiFactory,
    onError,
    request,
    parent,
    context,
  }: {
    request?: Request;
    parent?: Runtime<any, any, any>;
    context: RuntimeContext;
  } & ConfigureRuntimeOptions<State, Prop, ApiFactory>): Runtime<
    State,
    Prop,
    ApiFactory,
    ApiProp
  > => {
    function logError(error: any, context: RuntimeContext) {
      onError(createAppError({ error, ...context }), { ...context, state });
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
    const subscribers = new Map<Prop, Set<StateListener<State[Prop]>>>();
    const loaders = new Map<Key | undefined, InternalLoaderState>();
    const apiPromises = new Map<ApiProp, Promise<any>>();
    const cleanups = new Map<ApiProp, Cleanup>();

    const callListeners = <P extends Prop>(prop: P) => {
      subscribers
        .get(prop)
        ?.forEach((listener) =>
          listener(getState(prop), loader[prop].loading, loader[prop].error)
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
        return runOrThrow(parent?.state.get, prop);
      } catch {
        validateProp(prop);

        return currentState[prop];
      }
    };

    const setState = <P extends Prop>(prop: P, value: State[P]): void => {
      try {
        runOrThrow(parent?.state.set, prop, value);
      } catch (error) {
        validateProp(prop);
        if (currentState[prop] !== value) {
          currentState[prop] = value;

          callListeners(prop);
        }
      }
    };

    const loaded = async <P extends Prop>(prop?: P): Promise<any> => {
      try {
        return runOrThrow(parent?.state.loaded, prop);
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
          const loaderItem = parent?.state.loader[prop];
          if (loaderItem) {
            return loaderItem;
          } else {
            throw 1;
          }
        } catch {
          const value = loaders.get(prop);

          return {
            error: value?.error,
            loading: !!value?.loading,
          };
        }
      },
    });

    const listen = <P extends Prop>(
      prop: P,
      listener: StateListener<State[P]>
    ): Unsubscribe => {
      try {
        return runOrThrow(parent?.state.listen, prop, listener);
      } catch {
        validateProp(prop);
        const propSubscribers =
          subscribers.get(prop) ?? new Set<StateListener<State[P]>>();
        propSubscribers.add(listener);
        subscribers.set(
          prop,
          propSubscribers as unknown as Set<StateListener<State[Prop]>>
        );

        return () => {
          propSubscribers.delete(listener);
        };
      }
    };

    const load = async <P extends Prop>(
      prop: P,
      loader: () => Promise<State[P]> | State[P],
      context: RuntimeContext
    ) => {
      try {
        return runOrThrow(parent?.state.load, prop, loader);
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
              callListeners(prop);
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
            callListeners(prop);
            logError(error, context);
          }
        }

        return getState(prop);
      }
    };

    const _proxiedApi: Record<
      Key,
      ValuesFromApiFactory<ApiFactory> | undefined
    > = {};
    const api = new Proxy(_proxiedApi as ValuesFromApiFactory<ApiFactory>, {
      get(target, prop: ApiProp) {
        const parentItem = parent?.api?.[prop];
        if (parentItem) {
          return parentItem;
        } else if (target[prop] === undefined) {
          let item = apiFactory?.[prop];
          if (typeof item === "function") {
            item = item({
              isBrowser,
              request: {
                ...request,
                url,
              },
              state: {
                load,
                loaded,
                loader,
                set: setState,
                get: getState,
              },
              onCleanup: (cleanup: Cleanup) => {
                cleanups.set(prop, cleanup);
              },
            });
          }

          if (isPromise(item)) {
            apiPromises.set(prop, item);
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

    const cleanup = <P extends ApiProp>(prop?: P) => {
      if (prop) {
        parent?.cleanup(prop as P);
        cleanups.get(prop)?.();
        _proxiedApi[prop] = undefined;
      } else {
        parent?.cleanup();
        cleanups.forEach((cleanup) => cleanup());
        for (const [key, cleanup] of cleanups) {
          cleanup();
          _proxiedApi[key] = undefined;
        }
      }
    };

    const state = {
      get: getState,
      set: setState,
      listen,
      loaded,
      load,
      loader,
    };

    return {
      api,
      state,
      logError,
      cleanup,
      context,
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

  return <
    ApiFactory extends BaseApiFactory<State, Prop> = BaseApiFactory<State, Prop>
  >({
    apiFactory,
    onError,
  }: ConfigureRuntimeOptions<State, Prop, ApiFactory>) => ({
    createRuntime: ({
      initialState,
      request,
      runtime,
      context,
    }: CreateRuntimeArgs<State, Prop, ApiFactory>) =>
      runCreateRuntime<State, Prop>(initialState ?? defaultState)({
        apiFactory,
        onError,
        request,
        parent: runtime,
        context,
      }),
  });
};
