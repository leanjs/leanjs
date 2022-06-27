import type { ConfigureMount, Cleanup } from "../types";

const appInitialState = new Map<string, any>();
const initializedInitialState = new Set<string>();

export const getDefaultPathname = (isSelfHosted: boolean) =>
  isSelfHosted && typeof window !== "undefined"
    ? window.location.pathname
    : "/";

export const configureMount: ConfigureMount = ({
  el,
  appName,
  unmount,
  runtime,
  render,
  isSelfHosted,
  onBeforeMount,
  initialState,
  cleanups = [],
  log,
}) => {
  function updateInitialState(newInitialState: any) {
    appInitialState.set(appName, newInitialState);
  }
  if (el) {
    try {
      const onBeforeUnmountCallbacks: Cleanup[] = [];
      const onUnmountedCallbacks: Cleanup[] = [];

      // initialize appInitialState if it's the first time this app runs
      if (!initializedInitialState.has(appName)) {
        updateInitialState(initialState);
        initializedInitialState.add(appName);
      }

      // call beforeMount hooks
      const appProps = onBeforeMount?.({
        runtime,
        isSelfHosted,
        initialState: appInitialState.get(appName),
        updateInitialState,
        onBeforeUnmount: (callback: Cleanup) => {
          onBeforeUnmountCallbacks.push(callback);
        },
        onUnmounted: (callback: Cleanup) => {
          onUnmountedCallbacks.push(callback);
        },
      });

      render({ appProps });

      // add beforeUnmount hooks
      cleanups = cleanups.concat(onBeforeUnmountCallbacks);
      // add unmount function with UI library unmount logic, e.g. ReactDOM.unmountComponentAtNode(el)
      cleanups.push(unmount);
      // add unmounted hooks
      cleanups = cleanups.concat(onUnmountedCallbacks);
    } catch (error: any) {
      log?.(error as Error);
      el.innerText = `Error: ${error.message ?? error}`;
    }
  }

  return {
    // run all the cleanup functions when the app unmounts
    unmount: () => cleanups.forEach((cleanup) => cleanup()),
  };
};
