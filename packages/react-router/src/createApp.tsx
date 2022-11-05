import { RuntimeProvider, CreateAppConfig, ErrorBoundary } from "@leanjs/react";
import type { CreateComposableApp, AppProps, MountFunc } from "@leanjs/core";
import { _ as CoreUtils } from "@leanjs/core";
import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory, createMemoryHistory } from "history";

import { Router } from "./components/Router";

const { createMount, getDefaultPathname, createAppError } = CoreUtils;

export const createApp = <MyAppProps extends AppProps = AppProps>(
  App: (props: MyAppProps) => ReactElement,
  { appName = App.name }: CreateAppConfig = {}
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
        onError,
      }
    ) => {
      const initialPath = [basename, pathname]
        .join("/")
        .replace(/\/{2,}/g, "/");
      history.replace(initialPath);

      return {
        ...createMount({
          el,
          appName,
          isSelfHosted,
          initialState,
          onError,
          unmount: () => {
            if (el) ReactDOM.unmountComponentAtNode(el);
          },
          cleanups: onRemoteNavigate
            ? [history.listen((e) => onRemoteNavigate(e.location))]
            : [],
          render: ({ appProps }) => {
            if (el) {
              ReactDOM.render(
                <React.StrictMode>
                  <ErrorBoundary
                    onError={(error) =>
                      onError(createAppError({ appName, error }))
                    }
                  >
                    <Router history={history} basename={basename}>
                      <RuntimeProvider runtime={runtime}>
                        <App {...(appProps as MyAppProps)} />
                      </RuntimeProvider>
                    </Router>
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
      appName,
    };
  };

  createComposableApp.appName = appName;

  return createComposableApp;
};
