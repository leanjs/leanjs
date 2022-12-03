import type {
  CreateAppConfig,
  CreateComposableApp,
  AppProps,
  MountFunc,
} from "@leanjs/core";
import { _ as CoreUtils } from "@leanjs/core";
import React, { ReactElement, useEffect } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { createRoot } from "react-dom/client";

import { RootComponent, ReactRoot } from "../types";
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
    let root: ReactRoot | null;
    const Root: RootComponent = ({ children, onRendered }) => {
      useEffect(onRendered, []);
      return children;
    };
    Root.displayName = `${appName}Root`;

    const mount: MountFunc = (el, { runtime, onError, ...rest }) => ({
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
                  <RuntimeProvider
                    isSelfHosted={!!isSelfHosted}
                    runtime={setRuntimeContext({ version, appName }, runtime)}
                  >
                    <App {...(appProps as MyAppProps)} />
                  </RuntimeProvider>
                </ErrorBoundary>
              </Root>
            </React.StrictMode>
          );
        },
      }),
    });

    return { mount, appName, version };
  };
  createComposableApp.appName = appName;

  return createComposableApp;
};
