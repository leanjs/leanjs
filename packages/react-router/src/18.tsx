import {
  ErrorBoundary,
  getErrorBoundaryProps,
  _ as ReactUtils,
} from "@leanjs/react/18";
import type { CreateAppConfig, RootComponent, ReactRoot } from "@leanjs/react";
import type {
  CreateComposableApp,
  AppProps,
  MountFunc,
  UnmountFunc,
} from "@leanjs/core";
import { _ as CoreUtils } from "@leanjs/core";
import React, { ReactElement, useEffect } from "react";
import { createBrowserHistory, createMemoryHistory } from "history";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { createRoot } from "react-dom/client";

import { Router } from "./components/Router";
import { OuterReactRouterHostProps, ReactRouterHost } from "./components/Host";

export * from "./types";

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
    let unmountCallback: UnmountFunc | null;
    let rendering = false;
    let root: ReactRoot | null;

    const unmountRoot = () => {
      root?.unmount();
      root = null;
    };

    const Root: RootComponent = ({ children }) => {
      useEffect(() => {
        unmountCallback?.();
        unmountCallback = null;
        rendering = false;
      }, []);

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
          isSelfHosted,
          initialState,
          appName,
          onError,
          unmount: () => {
            if (rendering) {
              unmountCallback = unmountRoot;
            } else {
              setTimeout(unmountRoot);
            }
          },
          cleanups: onRemoteNavigate
            ? [history.listen((e) => onRemoteNavigate(e.location))]
            : [],
          render: ({ appProps }) => {
            unmountCallback = null;
            if (el && !rendering) {
              rendering = true;
              root = root ?? createRoot(el);
              const context = { version, appName };
              root?.render(
                <React.StrictMode>
                  <Root>
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
                  </Root>
                </React.StrictMode>
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
