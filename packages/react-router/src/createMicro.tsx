import {
  BaseRuntimeProvider,
  ErrorBoundary,
  CreateMicroConfig,
  RunMicroOptions,
  MountOptions,
  Cleanup,
  MicroApp,
} from "@leanjs/react";
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory, createMemoryHistory } from "history";

import { UniversalRouter } from "./components/UniversalRouter";

let inMemoryInitialState: any | undefined = undefined;

function saveInitialState(state: any) {
  inMemoryInitialState = state;
}

export const createMicro =
  (App: MicroApp, config?: CreateMicroConfig) =>
  (
    options: RunMicroOptions = {
      isSelfHosted: false,
    }
  ) => {
    const { isSelfHosted, initialState } = options;
    const { createRuntime, onBeforeMount } = config || {};
    const log = createRuntime?.log;
    const history = isSelfHosted
      ? createBrowserHistory()
      : createMemoryHistory();

    if (!inMemoryInitialState) saveInitialState(initialState || {});

    function mount(
      el: HTMLElement,
      {
        runtime = createRuntime?.(),
        onMicroNavigate,
        basename,
        pathname,
      }: MountOptions = {}
    ) {
      let cleanups: Cleanup[] = [];

      if (el) {
        const initialPath = [basename, pathname]
          .join("/")
          .replace(/\/{2,}/g, "/");

        history.push(initialPath);

        if (onMicroNavigate) {
          cleanups.push(
            history.listen((e) => onMicroNavigate(e.location.pathname))
          );
        }

        const onBeforeUnmountCallbacks: Cleanup[] = [];
        const onUnmountedCallbacks: Cleanup[] = [];
        const appProps = onBeforeMount?.({
          runtime,
          isSelfHosted,
          initialState: inMemoryInitialState,
          saveInitialState,
          onBeforeUnmount: (callback: Cleanup) => {
            onBeforeUnmountCallbacks.push(callback);
          },
          onUnmounted: (callback: Cleanup) => {
            onUnmountedCallbacks.push(callback);
          },
        });

        ReactDOM.render(
          <ErrorBoundary onError={log}>
            <UniversalRouter history={history} basename={basename}>
              <BaseRuntimeProvider runtime={runtime}>
                <App isSelfHosted={isSelfHosted} {...appProps} />
              </BaseRuntimeProvider>
            </UniversalRouter>
          </ErrorBoundary>,
          el
        );

        cleanups = cleanups.concat(onBeforeUnmountCallbacks);
        cleanups.push(() => ReactDOM.unmountComponentAtNode(el));
        cleanups = cleanups.concat(onUnmountedCallbacks);
      }

      return {
        unmount: () => {
          cleanups.forEach((cleanup) => cleanup());
        },
        onHostNavigate: (newPathname: string) => {
          const { pathname } = history.location;
          if (newPathname !== pathname) history.push(newPathname);
        },
      };
    }

    return { mount, createRuntime };
  };
