declare const UNDEFINED_VOID_ONLY: unique symbol;
declare module "react" {
  export function startTransition(scope: TransitionFunction): void;
  export type TransitionFunction = () => VoidOrUndefinedOnly;
  type VoidOrUndefinedOnly = void | { [UNDEFINED_VOID_ONLY]: never };
}

import type {
  CreateAppConfig,
  CreateComposableApp,
  AppProps,
  MountFunc,
  UnmountFunc,
} from "@leanjs/core";
import { _ as CoreUtils } from "@leanjs/core";
import React, { ReactElement, useEffect, startTransition } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { createRoot } from "react-dom/client";

import { RootComponent, ReactRoot } from "../types";
import { ErrorBoundary, getErrorBoundaryProps } from "../components";
import { RuntimeProvider } from "../core";

const { createMount, setRuntimeContext } = CoreUtils;

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

    const mount: MountFunc = (el, { runtime, initialState, onError }) => {
      return createMount({
        el,
        isSelfHosted,
        initialState,
        appName,
        onError,
        unmount: () => {
          root?.unmount();
          root = null;
        },
        render: ({ appProps, status }) => {
          startTransition(() => {
            status.rendering = true;
            root = root ?? createRoot(el);
            root?.render(
              <React.StrictMode>
                <Root
                  onRendered={() => {
                    status.rendering = false;
                  }}
                >
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
          });
        },
      });
    };

    return { mount, appName, version };
  };

  createComposableApp.appName = appName;

  return createComposableApp;
};
