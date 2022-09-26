import {
  RuntimeProvider,
  CreateAppConfig,
  _ as ReactUtils,
} from "@leanjs/react";
import type { CreateComposableApp, AppProps, MountFunc } from "@leanjs/core";
import { _ as CoreUtils } from "@leanjs/core";
import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory, createMemoryHistory } from "history";

import { UniversalRouter } from "./components/UniversalRouter";

const { ErrorBoundary } = ReactUtils;
const { createMount, getDefaultPathname } = CoreUtils;

export const createApp = <MyAppProps extends AppProps = AppProps>(
  App: (props: MyAppProps) => ReactElement,
  { packageName }: CreateAppConfig
) => {
  const createComposableApp: CreateComposableApp = ({ isSelfHosted } = {}) => {
    const history = isSelfHosted
      ? createBrowserHistory()
      : createMemoryHistory();

    const mount: MountFunc = (
      el,
      {
        runtime,
        onRemoteNavigate,
        basename,
        pathname = getDefaultPathname(isSelfHosted),
        initialState,
      } = {}
    ) => {
      const initialPath = [basename, pathname]
        .join("/")
        .replace(/\/{2,}/g, "/");
      history.replace(initialPath);

      return {
        ...createMount({
          el,
          packageName,
          isSelfHosted,
          initialState,
          onError: runtime?.logError,
          unmount: () => {
            if (el) ReactDOM.unmountComponentAtNode(el);
          },
          cleanups: onRemoteNavigate
            ? [history.listen((e) => onRemoteNavigate(e.location))]
            : [],

          render: ({ appProps, logScopedError }) => {
            if (el) {
              ReactDOM.render(
                <React.StrictMode>
                  <ErrorBoundary onError={logScopedError}>
                    <UniversalRouter history={history} basename={basename}>
                      <RuntimeProvider runtime={runtime}>
                        <App {...(appProps as MyAppProps)} />
                      </RuntimeProvider>
                    </UniversalRouter>
                  </ErrorBoundary>
                </React.StrictMode>,
                el
              );
            }
          },
        }),
        onHostNavigate: ({ pathname: nextPathname }) => {
          if (nextPathname !== history.location.pathname) {
            history.push(nextPathname);
          }
        },
      };
    };

    return {
      mount,
      packageName,
    };
  };

  createComposableApp.packageName = packageName;

  return createComposableApp;
};
