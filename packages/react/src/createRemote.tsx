import type {
  CreateRemoteConfig,
  RunRemoteOptions,
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

export const createRemote =
  <
    MyCreateRuntime extends CreateRuntime = CreateRuntime,
    MyAppProps extends AppProps = AppProps
  >(
    App: (props: MyAppProps) => ReactElement,
    config?: CreateRemoteConfig<MyCreateRuntime, MyAppProps>
  ) =>
  (options: RunRemoteOptions) => {
    const { isSelfHosted } = options;
    const { createRuntime, onBeforeMount } = config || {};
    const mount: MountFunc<GetRuntime<MyCreateRuntime>> = (
      el,
      { runtime = createRuntime?.() as GetRuntime<MyCreateRuntime> } = {}
    ) =>
      configureMount({
        el,
        ...options,
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

    return { mount, createRuntime };
  };
