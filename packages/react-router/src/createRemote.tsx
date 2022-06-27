import { RuntimeProvider, _ as ReactUtils } from "@leanjs/react";
import type {
  CreateRemoteConfig,
  RunRemoteOptions,
  CreateRuntime,
  GetRuntime,
  AppProps,
  MountFunc,
} from "@leanjs/core";
import { _ as CoreUtils } from "@leanjs/core";
import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory, createMemoryHistory } from "history";

import { UniversalRouter } from "./components/UniversalRouter";

const { ErrorBoundary } = ReactUtils;
const { configureMount, getDefaultPathname } = CoreUtils;

export const createRemote =
  <
    MyCreateRuntime extends CreateRuntime = CreateRuntime,
    MyAppProps extends AppProps = AppProps
  >(
    App: (props: MyAppProps) => ReactElement,
    config?: CreateRemoteConfig<MyCreateRuntime, MyAppProps>
  ) =>
  (options: RunRemoteOptions) => {
    const { isSelfHosted } = options;
    const { createRuntime, onBeforeMount } = config || {};
    const history = isSelfHosted
      ? createBrowserHistory()
      : createMemoryHistory();

    const mount: MountFunc<GetRuntime<MyCreateRuntime>> = (
      el,
      {
        runtime = createRuntime?.() as GetRuntime<MyCreateRuntime>,
        onRemoteNavigate,
        basename,
        pathname = getDefaultPathname(isSelfHosted),
      } = {}
    ) => {
      const initialPath = [basename, pathname]
        .join("/")
        .replace(/\/{2,}/g, "/");
      history.replace(initialPath);

      return {
        ...configureMount({
          el,
          ...options,
          log: createRuntime?.log,
          runtime,
          onBeforeMount,
          unmount: () => {
            if (el) ReactDOM.unmountComponentAtNode(el);
          },
          cleanups: onRemoteNavigate
            ? [history.listen((e) => onRemoteNavigate(e.location))]
            : [],
          render: ({ appProps }) => {
            if (el) {
              ReactDOM.render(
                <ErrorBoundary onError={createRuntime?.log}>
                  <UniversalRouter history={history} basename={basename}>
                    <RuntimeProvider runtime={runtime}>
                      <App
                        isSelfHosted={isSelfHosted}
                        {...(appProps as MyAppProps)}
                      />
                    </RuntimeProvider>
                  </UniversalRouter>
                </ErrorBoundary>,
                el
              );
            }
          },
        }),
        onHostNavigate: ({ pathname: nextPathname }) => {
          const currentPathname = document.location.pathname;
          if (nextPathname !== currentPathname) history.push(nextPathname);
        },
      };
    };

    return { mount, createRuntime };
  };
