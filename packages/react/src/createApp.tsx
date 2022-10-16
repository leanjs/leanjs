import type { CreateComposableApp, AppProps, MountFunc } from "@leanjs/core";
import { _ as CoreUtils } from "@leanjs/core";
import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import { CreateAppConfig, RootComponent } from "./types";

import { ErrorBoundary } from "./utils";
import { RuntimeProvider } from "./runtime";
const { createMount, createAppError } = CoreUtils;

export const createApp = <MyAppProps extends AppProps = AppProps>(
  App: (props: MyAppProps) => ReactElement,
  { appName = App.name }: CreateAppConfig = {}
) => {
  const createComposableApp: CreateComposableApp = ({ isSelfHosted } = {}) => {
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
            ReactDOM.render(
              <React.StrictMode>
                <Root>
                  <ErrorBoundary
                    onError={(error) =>
                      onError(createAppError({ appName, error }))
                    }
                    errorComponent={null}
                  >
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
