import type { CreateComposableApp, AppProps, MountFunc } from "@leanjs/core";
import { _ as CoreUtils } from "@leanjs/core";
import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import { CreateAppConfig, RootComponent } from "./types";

import { ErrorBoundary, getErrorBoundaryProps } from "./components";
import { RuntimeProvider } from "./runtime";

export * as _ from "./core";
export * from "./types";
export * from "./runtime";
export * from "./components";

const { createMount, setRuntimeContext } = CoreUtils;

export const createApp = <MyAppProps extends AppProps = AppProps>(
  App: (props: MyAppProps) => ReactElement,
  { appName = App.name }: CreateAppConfig = {}
) => {
  const createComposableApp: CreateComposableApp = ({
    isSelfHosted,
    version,
  } = {}) => {
    const Root: RootComponent = ({ children }) => children;
    Root.displayName = `${appName}Root`;
    const mount: MountFunc = (el, { runtime, initialState, onError }) =>
      createMount({
        el,
        isSelfHosted,
        initialState,
        appName,
        onError,
        unmount: () => {
          if (el) ReactDOM.unmountComponentAtNode(el);
        },
        render: ({ appProps }) => {
          if (el) {
            ReactDOM.render(
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
                    <RuntimeProvider
                      isSelfHosted={!!isSelfHosted}
                      runtime={setRuntimeContext({ version, appName }, runtime)}
                    >
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

    return { mount, appName, version };
  };

  createComposableApp.appName = appName;

  return createComposableApp;
};
