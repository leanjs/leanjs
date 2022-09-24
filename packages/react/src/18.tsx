import type {
  CreateAppConfig,
  CreateComposableApp,
  AppProps,
  MountFunc,
  UnmountFunc,
} from "@leanjs/core";
import { _ as CoreUtils } from "@leanjs/core";
import React, { ReactElement, useEffect } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { createRoot } from "react-dom/client";

import { ErrorBoundary } from "./utils";
import { RuntimeProvider } from "./runtime";
const { createMount } = CoreUtils;

interface ReactRoot {
  unmount: UnmountFunc;
  render: (element: ReactElement) => void;
}

interface RootComponent {
  (props: { children: ReactElement }): ReactElement;
  displayName?: string;
}

export const createApp = <MyAppProps extends AppProps = AppProps>(
  App: (props: MyAppProps) => ReactElement,
  { packageName }: CreateAppConfig
) => {
  const createComposableApp: CreateComposableApp = ({ isSelfHosted } = {}) => {
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
    Root.displayName = `${App.name}Root`;

    const mount: MountFunc = (el, { runtime, initialState } = {}) => {
      return createMount({
        el,
        isSelfHosted,
        initialState,
        packageName,
        onError: runtime?.logError,
        unmount: () => {
          if (rendering) {
            unmountCallback = unmountRoot;
          } else {
            setTimeout(unmountRoot);
          }
        },
        render: ({ appProps, logScopedError }) => {
          unmountCallback = null;
          if (el && !rendering) {
            rendering = true;
            root = root ?? createRoot(el);
            root?.render(
              <React.StrictMode>
                <Root>
                  <ErrorBoundary onError={logScopedError}>
                    <RuntimeProvider runtime={runtime}>
                      <App {...(appProps as MyAppProps)} />
                    </RuntimeProvider>
                  </ErrorBoundary>
                </Root>
              </React.StrictMode>
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
