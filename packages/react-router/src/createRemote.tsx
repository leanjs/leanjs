import { RuntimeProvider, RemoteApp, _ as ReactUtils } from "@leanjs/react";
import type {
  CreateRemoteConfig,
  RunRemoteOptions,
  MountOptions,
  Cleanup,
} from "@leanjs/core";
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory, createMemoryHistory } from "history";

import { UniversalRouter } from "./components/UniversalRouter";

const { ErrorBoundary } = ReactUtils;

let inMemoryInitialState: any | undefined = undefined;

function saveInitialState(state: any) {
  inMemoryInitialState = state;
}

export const createRemote =
  (App: RemoteApp, config?: CreateRemoteConfig) =>
  (
    options: RunRemoteOptions = {
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
        onRemoteNavigate,
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

        if (onRemoteNavigate) {
          cleanups.push(
            history.listen((e) => onRemoteNavigate(e.location.pathname))
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
              <RuntimeProvider runtime={runtime}>
                <App isSelfHosted={isSelfHosted} {...appProps} />
              </RuntimeProvider>
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
