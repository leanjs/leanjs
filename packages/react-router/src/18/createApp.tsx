import {
  ErrorBoundary,
  getErrorBoundaryProps,
  _ as ReactUtils,
} from "@leanjs/react/18";
import type { CreateAppConfig, RootComponent, ReactRoot } from "@leanjs/react";
import type { CreateComposableApp, AppProps, MountFunc } from "@leanjs/core";
import { _ as CoreUtils } from "@leanjs/core";
import React, { ReactElement, useEffect } from "react";
import { createBrowserHistory, createMemoryHistory } from "history";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { createRoot } from "react-dom/client";

import { Router } from "../components/Router";

const { mountApp, getDefaultPathname, setRuntimeContext } = CoreUtils;
const { RuntimeProvider } = ReactUtils;

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
    let root: ReactRoot | null;

    const Root: RootComponent = ({ children, onRendered }) => {
      useEffect(onRendered, []);
      return children;
    };
    Root.displayName = `${appName}Root`;

    const mount: MountFunc = (
      el,
      {
        runtime,
        onRemoteNavigate,
        basename,
        pathname = getDefaultPathname(isSelfHosted),
        onError,
        ...rest
      }
    ) => {
      const initialPath = [basename, pathname]
        .join("/")
        .replace(/\/{2,}/g, "/");
      history.replace(initialPath);

      return {
        unmount: mountApp({
          ...rest,
          el,
          isSelfHosted,
          appName,
          onError,
          unmount: () => {
            root?.unmount();
            root = null;
          },
          cleanups: onRemoteNavigate
            ? [history.listen((e) => onRemoteNavigate(e.location))]
            : [],
          render: ({ appProps, rendered }) => {
            root = root ?? createRoot(el);
            root?.render(
              <React.StrictMode>
                <Root onRendered={rendered}>
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
                        runtime={setRuntimeContext(
                          { version, appName },
                          runtime
                        )}
                      >
                        <App {...(appProps as MyAppProps)} />
                      </RuntimeProvider>
                    </Router>
                  </ErrorBoundary>
                </Root>
              </React.StrictMode>
            );
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
