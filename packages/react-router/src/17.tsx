import {
  ErrorBoundary,
  getErrorBoundaryProps,
  _ as ReactUtils,
} from "@leanjs/react/17";
import type { CreateAppConfig } from "@leanjs/react";
import type { CreateComposableApp, AppProps, MountFunc } from "@leanjs/core";
import { _ as CoreUtils } from "@leanjs/core";
import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory, createMemoryHistory } from "history";

import { Router } from "./components/Router";
import { OuterReactRouterHostProps, ReactRouterHost } from "./components/Host";

export * from "./types";
export * from "./components/Host";

const { createMount, getDefaultPathname, setRuntimeContext } = CoreUtils;
const { createHost, RuntimeProvider } = ReactUtils;

export const Host = createHost<OuterReactRouterHostProps>(ReactRouterHost);

export const createApp = <MyAppProps extends AppProps = AppProps>(
  App: (props: MyAppProps) => ReactElement,
  { appName = App.name }: CreateAppConfig = {}
) => {
  const createComposableApp: CreateComposableApp = ({
    isSelfHosted,
    version,
  } = {}) => {
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
              const context = { version, appName };
              ReactDOM.render(
                <React.StrictMode>
                  <ErrorBoundary
                    {...getErrorBoundaryProps({
                      isSelfHosted,
                      onError,
                      appName,
                      version,
                    })}
                  >
                    <Router history={history} basename={basename}>
                      <RuntimeProvider
                        isSelfHosted={!!isSelfHosted}
                        runtime={setRuntimeContext(context, runtime)}
                      >
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

    return { mount, appName, version };
  };

  createComposableApp.appName = appName;

  return createComposableApp;
};
