import type {
  CreateAppConfig,
  CreateComposableApp,
  AppProps,
  MountFunc,
} from "@leanjs/core";
import { _ as CoreUtils } from "@leanjs/core";
import React, { ReactElement } from "react";
import ReactDOM from "react-dom";

import { ErrorBoundary } from "./utils";
import { RuntimeProvider } from "./runtime";
const { createMount } = CoreUtils;

export const createApp = <MyAppProps extends AppProps = AppProps>(
  App: (props: MyAppProps) => ReactElement,
  { packageName }: CreateAppConfig
) => {
  const createComposableApp: CreateComposableApp = ({ isSelfHosted } = {}) => {
    const mount: MountFunc = (el, { runtime, initialState } = {}) =>
      createMount({
        el,
        isSelfHosted,
        initialState,
        packageName,
        onError: runtime?.logError,
        unmount: () => {
          if (el) ReactDOM.unmountComponentAtNode(el);
        },
        render: ({ appProps, logScopedError }) => {
          if (el) {
            ReactDOM.render(
              <ErrorBoundary onError={logScopedError}>
                <RuntimeProvider runtime={runtime}>
                  <App {...(appProps as MyAppProps)} />
                </RuntimeProvider>
              </ErrorBoundary>,
              el
            );
          }
        },
      });

    return { mount, packageName };
  };

  createComposableApp.packageName = packageName;

  return createComposableApp;
};
