import type { ConfigureMount, Cleanup } from "../types";

let inMemoryInitialState: any | undefined = undefined;
let initializeInMemoryInitialState = true;

function updateInitialState(state: any) {
  inMemoryInitialState = state;
}

export const configureMount: ConfigureMount = ({
  el,
  unmount,
  runtime,
  basename,
  pathname,
  pushInitialPath,
  render,
  isSelfHosted,
  onBeforeMount,
  initialState,
  cleanups = [],
}) => {
  if (el) {
    const onBeforeUnmountCallbacks: Cleanup[] = [];
    const onUnmountedCallbacks: Cleanup[] = [];
    const initialPath = [basename, pathname].join("/").replace(/\/{2,}/g, "/");

    if (initializeInMemoryInitialState) {
      updateInitialState(initialState);
      initializeInMemoryInitialState = false;
    }

    pushInitialPath(initialPath);

    const appProps = onBeforeMount?.({
      runtime,
      isSelfHosted,
      initialState: inMemoryInitialState,
      updateInitialState,
      onBeforeUnmount: (callback: Cleanup) => {
        onBeforeUnmountCallbacks.push(() => updateInitialState(callback()));
      },
      onUnmounted: (callback: Cleanup) => {
        onUnmountedCallbacks.push(callback);
      },
    });

    render({ appProps });

    cleanups = cleanups.concat(onBeforeUnmountCallbacks);
    cleanups.push(unmount);
    cleanups = cleanups.concat(onUnmountedCallbacks);
  }

  return {
    unmount: () => cleanups.forEach((cleanup) => cleanup()),
  };
};
