import { RuntimeProvider, _ as ReactUtils } from "@leanjs/react";
import type {
  CreateRemoteConfig,
  RunRemoteOptions,
  MountOptions,
  CreateRuntime,
  GetRuntime,
  AppProps,
} from "@leanjs/core";
import { _ as CoreUtils } from "@leanjs/core";
import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory, createMemoryHistory } from "history";

import { UniversalRouter } from "./components/UniversalRouter";

const { ErrorBoundary } = ReactUtils;
const { configureMount } = CoreUtils;

export const createRemote =
  <
    MyCreateRuntime extends CreateRuntime = CreateRuntime,
    MyAppProps extends AppProps = AppProps
  >(
    App: (props: MyAppProps) => ReactElement,
    config?: CreateRemoteConfig<MyCreateRuntime, MyAppProps>
  ) =>
  (options: RunRemoteOptions) => {
    const { isSelfHosted, initialState, appName } = options;
    const { createRuntime, onBeforeMount } = config || {};
    const history = isSelfHosted
      ? createBrowserHistory()
      : createMemoryHistory();

    function mount(
      el: HTMLElement,
      {
        runtime = createRuntime?.() as GetRuntime<MyCreateRuntime>,
        onRemoteNavigate,
        basename,
        pathname,
      }: MountOptions<GetRuntime<MyCreateRuntime>> = {}
    ) {
      return {
        ...configureMount<MyAppProps>({
          el,
          appName,
          runtime,
          basename,
          pathname,
          isSelfHosted,
          initialState,
          onBeforeMount,
          setInitialPath: history.replace,
          unmount: () => {
            ReactDOM.unmountComponentAtNode(el);
          },
          cleanups: onRemoteNavigate
            ? [history.listen((e) => onRemoteNavigate(e.location.pathname))]
            : [],
          render: ({ appProps }) => {
            ReactDOM.render(
              <ErrorBoundary onError={createRuntime?.log}>
                <UniversalRouter history={history} basename={basename}>
                  <RuntimeProvider runtime={runtime}>
                    <App isSelfHosted={isSelfHosted} {...appProps} />
                  </RuntimeProvider>
                </UniversalRouter>
              </ErrorBoundary>,
              el
            );
          },
        }),
        onHostNavigate: (nextPathname: string) => {
          const { pathname: currentPathname } = history.location;
          if (nextPathname !== currentPathname) history.push(nextPathname);
        },
      };
    }

    return { mount, createRuntime };
  };
