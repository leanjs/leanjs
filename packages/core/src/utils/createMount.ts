import type { CreateMount } from "../types";

// TODO, SHOULD THIS BE INJECTED FROM "PROVIDER"?
const appInitialState = new Map<string, any>();
const initializedInitialState = new Set<string>();

export const getDefaultPathname = (isSelfHosted?: boolean) =>
  isSelfHosted && typeof window !== "undefined"
    ? window.location.pathname
    : "/";

export const createMount: CreateMount = ({
  el,
  appName,
  unmount,
  render,
  isSelfHosted = false,
  initialState,
  cleanups = [],
  onError,
}) => {
  function updateInitialState(newInitialState: any) {
    appInitialState.set(appName, newInitialState);
  }

  const logScopedError = (error: any) => {
    if (onError) {
      onError(error, { appName });
    } else {
      throw Error;
    }
  };

  if (el) {
    try {
      // initialize appInitialState if it's the first time this app runs
      if (!initializedInitialState.has(appName)) {
        updateInitialState(initialState);
        initializedInitialState.add(appName);
      }

      render({
        appProps: {
          initialState: appInitialState.get(appName),
          updateInitialState,
          isSelfHosted,
        },
        logScopedError,
      });

      // add unmount function with UI library unmount logic, e.g. ReactDOM.unmountComponentAtNode(el)
      cleanups.push(unmount);
    } catch (error: any) {
      logScopedError(error);
    }
  }

  return {
    // run all the cleanup functions when the app unmounts
    unmount: () => {
      try {
        cleanups.forEach((cleanup) => cleanup());
      } catch (error) {
        logScopedError(error);
      }
    },
  };
};
