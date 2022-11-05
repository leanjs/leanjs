import React, { ReactElement, useEffect, useContext, useState } from "react";
import {
  _ as CoreUtils,
  GetComposableApp,
  GetComposableAppAsync,
  RemoteComposableApp,
} from "@leanjs/core";

import type { OuterHostProps, InnerHostProps } from "../types";
import { HostContext } from "../private/HostProvider";

import { getMount } from "../private/getMount";
import { useRuntime } from "../runtime";

const { isPromise, createAppError } = CoreUtils;

export function isRemoteApp(
  app: GetComposableApp | GetComposableAppAsync
): app is RemoteComposableApp {
  return typeof app === "object" && !!(app as RemoteComposableApp).packageName;
}

export function createHost<Props extends OuterHostProps = OuterHostProps>(
  Component: <ComponentProps extends InnerHostProps>(
    props: ComponentProps
  ) => ReactElement
) {
  const lazyMap = new Map<OuterHostProps["app"] | string, any>();

  return function Host({ app, remote, ...rest }: Props) {
    const context = useContext(HostContext);
    const runtime = useRuntime();
    const [error, setError] = useState<Error>();
    const [showChild, setShowChild] = useState(false);
    const version = remote?.version;
    const appKey = isRemoteApp(app) ? `${app.packageName}${version}` : app;

    if (error) {
      throw error;
    }

    useEffect(() => {
      setShowChild(true);
    }, []);

    if (!showChild) {
      return null;
    }

    if (!lazyMap.has(appKey)) {
      lazyMap.set(
        appKey,
        React.lazy(() => {
          return new Promise<{ default: () => ReactElement }>(
            (resolve, reject) => {
              function handleError(error: Error, appName?: string) {
                reject(createAppError({ error, appName, version }));
              }

              async function run() {
                const appName = isRemoteApp(app)
                  ? app.packageName
                  : app.appName;

                try {
                  const maybeAsyncApp =
                    typeof app === "function"
                      ? app({ isSelfHosted: false })
                      : app;

                  const syncApp = isPromise(maybeAsyncApp)
                    ? (await maybeAsyncApp).default
                    : maybeAsyncApp;

                  const { mount, url, name } = await getMount({
                    app: syncApp,
                    remote,
                    context,
                  });

                  if (!mount) {
                    handleError(
                      new Error(
                        `mount is undefined ${url ? ", URL: " + url : ""}`
                      ),
                      name
                    );
                  } else {
                    resolve({
                      default: function HostWrapper() {
                        return (
                          <Component
                            {...rest}
                            url={url}
                            setError={setError}
                            mount={mount}
                            runtime={runtime}
                          />
                        );
                      },
                    });
                  }
                } catch (error: any) {
                  handleError(error, appName);
                }

                return undefined;
              }

              run();
            }
          );
        })
      );
    }
    const HostApp = lazyMap.get(appKey);

    return <HostApp />;
  };
}
