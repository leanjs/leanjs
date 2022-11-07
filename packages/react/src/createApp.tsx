import type { CreateComposableApp, AppProps, MountFunc } from "@leanjs/core";
import { _ as CoreUtils } from "@leanjs/core";
import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import { CreateAppConfig, RootComponent } from "./types";

import { ErrorBoundary } from "./components";
import { RuntimeProvider } from "./runtime";
const { createMount, createAppError, setRuntimeContext } = CoreUtils;

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
        appName: appName ?? App.name,
        onError,
        unmount: () => {
          if (el) ReactDOM.unmountComponentAtNode(el);
        },
        render: ({ appProps }) => {
          if (el) {
            const context = { version, appName };
            ReactDOM.render(
              <React.StrictMode>
                <Root>
                  <ErrorBoundary
                    onError={(error) =>
                      onError(
                        createAppError({ appName, error, version }),
                        context
                      )
                    }
                  >
                    <RuntimeProvider
                      runtime={setRuntimeContext(context, runtime)}
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
