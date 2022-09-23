import React, { useContext } from "react";
import type { ReactElement } from "react";
import { ComposableApp, _ as CoreUtils } from "@leanjs/core";

import type { AsyncHostProps, CreateHostProps, ErrorComponent } from "../types";
import { HostContext } from "../private/HostProvider";

import { ErrorBoundary } from "./ErrorBoundary";
import { getMount } from "./getMount";
import { useRuntime } from "../runtime";

const { isPromise } = CoreUtils;

export const DefaultError: ErrorComponent = ({ error }) => (
  <>Error: {error?.message}</>
);

export function createHost<HostProps extends AsyncHostProps = AsyncHostProps>(
  Component: (props: CreateHostProps) => ReactElement
) {
  return function Host({
    app,
    errorComponent: ErrorComponent = DefaultError,
  }: HostProps) {
    const context = useContext(HostContext);
    const runtime = useRuntime();
    const LazyApp = React.lazy(
      () =>
        new Promise<any>((resolve, reject) => {
          if (typeof window === "undefined") {
            return resolve({ default: () => <>...</> });
          }

          async function execute() {
            let resolvedApp: ComposableApp | undefined;

            console.log(`🔥🔥🔥🔥🔥🔥🔥🔥🔥`);
            try {
              const maybeAsyncApp =
                typeof app === "function" ? app({ isSelfHosted: false }) : app;
              resolvedApp = isPromise(maybeAsyncApp)
                ? (await maybeAsyncApp).default
                : maybeAsyncApp;
              const { mount, url, name } = await getMount({
                app: resolvedApp,
                context,
              });
              if (!mount) {
                throw new Error(`mount is undefined for ${name} ${url}`);
              }
              resolve({
                default: () => (
                  <ErrorBoundary
                    onError={(error) =>
                      runtime.logError(error, {
                        scope: resolvedApp?.packageName,
                      })
                    }
                  >
                    <Component mount={mount} url={url} runtime={runtime} />
                  </ErrorBoundary>
                ),
              });
            } catch (error) {
              reject(error);
            }
          }

          execute();
        })
    );

    return (
      <ErrorBoundary onError={(error) => runtime.logError(error)}>
        <LazyApp />
      </ErrorBoundary>
    );
  };
}
