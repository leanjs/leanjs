import { RuntimeProvider, AppProps, _ as ReactUtils } from "@leanjs/react";
import type {
  CreateRemoteConfig,
  RunRemoteOptions,
  MountOptions,
  Cleanup,
  CreateRuntime,
  GetRuntime,
} from "@leanjs/core";
import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory, createMemoryHistory } from "history";

import { UniversalRouter } from "./components/UniversalRouter";

const { ErrorBoundary } = ReactUtils;

let inMemoryInitialState: any | undefined = undefined;

function saveInitialState(state: any) {
  inMemoryInitialState = state;
}

export const createRemote =
  <
    MyCreateRuntime extends CreateRuntime = CreateRuntime,
    MyAppProps extends AppProps = AppProps
  >(
    App: (props: MyAppProps) => ReactElement,
    config?: CreateRemoteConfig<MyCreateRuntime, MyAppProps>
  ) =>
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
        runtime = createRuntime?.() as GetRuntime<MyCreateRuntime>,
        onRemoteNavigate,
        basename,
        pathname,
      }: MountOptions<GetRuntime<MyCreateRuntime>> = {}
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
        }) as MyAppProps;

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
