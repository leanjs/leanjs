import type {
  CreateRemoteConfig,
  CreateComposableApp,
  CreateRuntime,
  GetRuntime,
  AppProps,
  MountFunc,
} from "@leanjs/core";
import { _ as CoreUtils } from "@leanjs/core";
import React, { ReactElement } from "react";
import ReactDOM from "react-dom";

import { ErrorBoundary } from "./utils";
import { RuntimeProvider } from "./runtime";
const { configureMount } = CoreUtils;

export const createApp = <
  MyCreateRuntime extends CreateRuntime = CreateRuntime,
  MyAppProps extends AppProps = AppProps
>(
  App: (props: MyAppProps) => ReactElement,
  {
    createRuntime,
    onBeforeMount,
    packageName,
  }: CreateRemoteConfig<MyCreateRuntime, MyAppProps>
) => {
  const bootstrap: CreateComposableApp<MyCreateRuntime> = (options = {}) => {
    const { isSelfHosted } = options;
    const mount: MountFunc<GetRuntime<MyCreateRuntime>> = (
      el,
      { runtime = createRuntime?.() as GetRuntime<MyCreateRuntime> } = {}
    ) =>
      configureMount({
        el,
        ...options,
        packageName,
        log: createRuntime?.log,
        runtime,
        onBeforeMount,
        unmount: () => {
          if (el) ReactDOM.unmountComponentAtNode(el);
        },
        render: ({ appProps }) => {
          if (el) {
            ReactDOM.render(
              <ErrorBoundary onError={createRuntime?.log}>
                <RuntimeProvider runtime={runtime}>
                  <App
                    isSelfHosted={isSelfHosted}
                    {...(appProps as MyAppProps)}
                  />
                </RuntimeProvider>
              </ErrorBoundary>,
              el
            );
          }
        },
      });

    return { mount, packageName, createRuntime };
  };

  bootstrap.packageName = packageName;

  return bootstrap;
};
