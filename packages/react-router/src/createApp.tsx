import { RuntimeProvider, _ as ReactUtils } from "@leanjs/react";
import type {
  CreateRemoteConfig,
  CreateRuntime,
  GetRuntime,
  AppProps,
  MountFunc,
  CreateComposableApp,
} from "@leanjs/core";
import { _ as CoreUtils } from "@leanjs/core";
import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory, createMemoryHistory } from "history";

import { UniversalRouter } from "./components/UniversalRouter";

const { ErrorBoundary } = ReactUtils;
const { configureMount, getDefaultPathname } = CoreUtils;

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
    const history = isSelfHosted
      ? createBrowserHistory()
      : createMemoryHistory();

    const mount: MountFunc<GetRuntime<MyCreateRuntime>> = (
      el,
      {
        runtime = createRuntime?.() as GetRuntime<MyCreateRuntime>,
        onRemoteNavigate,
        basename,
        pathname = getDefaultPathname(isSelfHosted),
      } = {}
    ) => {
      const initialPath = [basename, pathname]
        .join("/")
        .replace(/\/{2,}/g, "/");
      history.replace(initialPath);

      return {
        ...configureMount({
          el,
          ...options,
          packageName,
          log: createRuntime?.log,
          runtime,
          onBeforeMount,
          unmount: () => {
            if (el) ReactDOM.unmountComponentAtNode(el);
          },
          cleanups: onRemoteNavigate
            ? [history.listen((e) => onRemoteNavigate(e.location))]
            : [],
          render: ({ appProps }) => {
            if (el) {
              ReactDOM.render(
                <ErrorBoundary onError={createRuntime?.log}>
                  <UniversalRouter history={history} basename={basename}>
                    <RuntimeProvider runtime={runtime}>
                      <App
                        isSelfHosted={isSelfHosted}
                        {...(appProps as MyAppProps)}
                      />
                    </RuntimeProvider>
                  </UniversalRouter>
                </ErrorBoundary>,
                el
              );
            }
          },
        }),
        onHostNavigate: ({ pathname: nextPathname }) => {
          if (nextPathname !== history.location.pathname) {
            history.push(nextPathname);
          }
        },
      };
    };

    return {
      mount,
      packageName,
      createRuntime,
    };
  };

  bootstrap.packageName = packageName;

  return bootstrap;
};
