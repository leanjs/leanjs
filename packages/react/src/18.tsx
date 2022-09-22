import type {
  CreateAppConfig,
  CreateComposableApp,
  AppProps,
  MountFunc,
} from "@leanjs/core";
import { _ as CoreUtils } from "@leanjs/core";
import React, { ReactElement } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { createRoot } from "react-dom/client";

import { ErrorBoundary } from "./utils";
import { RuntimeProvider } from "./runtime";
const { createMount } = CoreUtils;

export const createApp = <MyAppProps extends AppProps = AppProps>(
  App: (props: MyAppProps) => ReactElement,
  { packageName }: CreateAppConfig
) => {
  const createComposableApp: CreateComposableApp = ({ isSelfHosted } = {}) => {
    const mount: MountFunc = (el, { runtime, initialState } = {}) => {
      const root = el ? createRoot(el) : null;
      return createMount({
        el,
        isSelfHosted,
        initialState,
        packageName,
        onError: runtime?.logError,
        unmount: () => {
          root?.unmount();
        },
        render: ({ appProps, logScopedError }) => {
          if (el) {
            root.render(
              <ErrorBoundary onError={logScopedError}>
                <RuntimeProvider runtime={runtime}>
                  <App {...(appProps as MyAppProps)} />
                </RuntimeProvider>
              </ErrorBoundary>
            );
          }
        },
      });
    };

    return { mount, packageName };
  };

  createComposableApp.packageName = packageName;

  return createComposableApp;
};
