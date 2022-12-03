import type { MountApp } from "../types";
import { createAppError } from "./index";

const appInitialState = new Map<string, any>();
const initializedInitialState = new Set<string>();

export const getDefaultPathname = (isSelfHosted?: boolean) =>
  isSelfHosted && typeof window !== "undefined"
    ? window.location.pathname
    : "/";

export const mountApp: MountApp = ({
  el,
  appName,
  version,
  unmount,
  render,
  isSelfHosted = false,
  initialState,
  cleanups = [],
  onError,
  mountState,
}) => {
  const appKey = appName + version;
  const context = { appName, version };

  function updateInitialState(newInitialState: any) {
    appInitialState.set(appKey, newInitialState);
  }

  if (el) {
    try {
      // initialize appInitialState if it's the first time this app runs
      if (!initializedInitialState.has(appKey)) {
        updateInitialState(initialState);
        initializedInitialState.add(appKey);
      }

      // canceling unmountCallback because mountApp was invoked
      mountState.unmountCallback = undefined;

      if (!mountState.rendering) {
        mountState.rendering = true;
        render({
          rendered: () => {
            mountState.rendering = false;
            const callback = mountState.unmountCallback;
            if (callback) {
              callback();
              mountState.unmountCallback = undefined;
            }
          },
          appProps: {
            initialState: appInitialState.get(appKey),
            updateInitialState,
            isSelfHosted,
          },
        });

        // add unmount function with UI library unmount logic, e.g. ReactDOM.unmountComponentAtNode(el)
        cleanups.push(() => {
          if (mountState.rendering) {
            mountState.unmountCallback = unmount;
          } else {
            unmount();
          }
        });
      }
    } catch (error: any) {
      onError(createAppError({ appName, version, error }), context);
    }
  }

  // run all the cleanup functions when the app unmounts
  return () => {
    try {
      cleanups.forEach((cleanup) => cleanup());
    } catch (error) {
      onError(createAppError({ appName, version, error }), context);
    }
  };
};
