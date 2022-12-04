import type { CreateComposableApp, AppProps, MountFunc } from "@leanjs/core";
import { _ as CoreUtils } from "@leanjs/core";
import React, { ReactElement, useEffect } from "react";
import ReactDOM from "react-dom";
import { CreateAppConfig, RootComponent } from "../types";

import { ErrorBoundary, getErrorBoundaryProps } from "../components";
import { RuntimeProvider } from "../core";

const { mountApp, setRuntimeContext } = CoreUtils;

export const createApp = <MyAppProps extends AppProps = AppProps>(
  App: (props: MyAppProps) => ReactElement,
  { appName = App.name }: CreateAppConfig = {}
) => {
  const createComposableApp: CreateComposableApp = ({
    isSelfHosted,
    version,
  } = {}) => {
    const Root: RootComponent = ({ children, onRendered }) => {
      useEffect(onRendered, []);
      return children;
    };
    const mount: MountFunc = (el, { runtime, onError, ...rest }) => ({
      unmount: mountApp({
        ...rest,
        el,
        isSelfHosted,
        appName,
        onError,
        unmount: () => {
          if (el) ReactDOM.unmountComponentAtNode(el);
        },
        render: ({ appProps, rendered }) => {
          if (el) {
            ReactDOM.render(
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
      }),
    });

    return { mount, appName, version };
  };

  createComposableApp.appName = appName;

  return createComposableApp;
};
