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

import { RootComponent } from "./types";
import { ErrorBoundary, getErrorBoundaryProps } from "./components";
import { RuntimeProvider, createRuntimeBindings } from "./runtime";

const { createMount, setRuntimeContext } = CoreUtils;

export { createRuntimeBindings };

interface ReactRoot {
  unmount: UnmountFunc;
  render: (element: ReactElement) => void;
}

export const createApp = <MyAppProps extends AppProps = AppProps>(
  App: (props: MyAppProps) => ReactElement,
  { appName = App.name }: CreateAppConfig = {}
) => {
  const createComposableApp: CreateComposableApp = ({
    isSelfHosted,
    version,
  } = {}) => {
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
    Root.displayName = `${appName}Root`;

    const mount: MountFunc = (el, { runtime, initialState, onError }) => {
      return createMount({
        el,
        isSelfHosted,
        initialState,
        appName,
        onError,
        unmount: () => {
          if (rendering) {
            unmountCallback = unmountRoot;
          } else {
            setTimeout(unmountRoot);
          }
        },
        render: ({ appProps }) => {
          unmountCallback = null;
          if (el && !rendering) {
            rendering = true;
            root = root ?? createRoot(el);
            const context = { version, appName };
            root?.render(
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
                      runtime={setRuntimeContext(context, runtime)}
                    >
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

    return { mount, appName, version };
  };

  createComposableApp.appName = appName;

  return createComposableApp;
};
