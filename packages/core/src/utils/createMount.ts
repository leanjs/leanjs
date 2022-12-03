import type { CreateMount, UnmountFunc } from "../types";
import { createAppError } from "./index";

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
  version,
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

  const context = { appName, version };
  let rendering = false;
  let unmountCallback: UnmountFunc | null;
  const status = {
    get rendering() {
      return rendering;
    },
    set rendering(value) {
      if (!value) {
        unmountCallback?.();
        unmountCallback = null;
      }
      rendering = value;
    },
  };
  if (el) {
    try {
      // initialize appInitialState if it's the first time this app runs
      if (!initializedInitialState.has(appName)) {
        updateInitialState(initialState);
        initializedInitialState.add(appName);
      }
      if (!rendering) {
        // rendering = true;
        // unmountCallback = null;
        render({
          // rendered: () => {
          //   unmountCallback?.();
          //   unmountCallback = null;
          //   rendering = false;
          // },
          status,
          appProps: {
            initialState: appInitialState.get(appName),
            updateInitialState,
            isSelfHosted,
          },
        });

        // add unmount function with UI library unmount logic, e.g. ReactDOM.unmountComponentAtNode(el)
        cleanups.push(() => {
          if (rendering) {
            unmountCallback = unmount;
          } else {
            // should settimeout be in createApp?
            setTimeout(unmount);
          }
        });
      }
    } catch (error: any) {
      onError(createAppError({ appName, version, error }), context);
    }
  }

  return {
    // run all the cleanup functions when the app unmounts
    unmount: () => {
      try {
        cleanups.forEach((cleanup) => cleanup());
      } catch (error) {
        onError(createAppError({ appName, version, error }), context);
      }
    },
  };
};
