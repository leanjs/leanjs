import type { CreateComposableApp, AppProps, MountFunc } from "@leanjs/core";
import { _ as CoreUtils } from "@leanjs/core";
import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import { CreateAppConfig, RootComponent } from "./types";

import { ErrorBoundary } from "./utils";
import { RuntimeProvider } from "./runtime";
const { createMount } = CoreUtils;

export const createApp = <MyAppProps extends AppProps = AppProps>(
  App: (props: MyAppProps) => ReactElement,
  { appName = App.name }: CreateAppConfig = {}
) => {
  const createComposableApp: CreateComposableApp = ({ isSelfHosted } = {}) => {
    const Root: RootComponent = ({ children }) => children;
    Root.displayName = `${appName}Root`;
    const mount: MountFunc = (el, { runtime, initialState } = {}) =>
      createMount({
        el,
        isSelfHosted,
        initialState,
        appName: appName ?? App.name,
        onError: runtime?.logError,
        unmount: () => {
          if (el) ReactDOM.unmountComponentAtNode(el);
        },
        render: ({ appProps, logScopedError }) => {
          if (el) {
            ReactDOM.render(
              <React.StrictMode>
                <Root>
                  <ErrorBoundary onError={logScopedError}>
                    <RuntimeProvider runtime={runtime}>
                      <App {...(appProps as MyAppProps)} />
                    </RuntimeProvider>
                  </ErrorBoundary>
                </Root>
              </React.StrictMode>,
              el
            );
          }
        },
      });

    return { mount, appName };
  };

  return createComposableApp;
};
