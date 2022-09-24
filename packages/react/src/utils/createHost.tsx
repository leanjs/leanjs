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

const cache = new Map<any, any>();

// const TestImport = import("./DELETEME");

// @ts-ignore
const LazyApp = React.lazy(() => import("./DELETEME.js"));

export function createHost<HostProps extends AsyncHostProps = AsyncHostProps>(
  Component: (props: CreateHostProps) => ReactElement
) {

  
  return function Host({
    app,
    errorComponent: ErrorComponent = DefaultError,
  }: HostProps) {
    const context = useContext(HostContext);
    const runtime = useRuntime();
    // @ts-ignore

    const A = lazy(
      () =>
        new Promise((resolve) => {
          resolve({ default: () => <h1>hello</h1> });
        })
    );

    return <A />;
    // const LazyApp = React.lazy(() => {
    //   console.log(`🔥🔥🔥🔥🔥🔥🔥🔥🔥 error`);
    //   return cache.has(app)
    //     ? Promise.resolve({ default: cache.get(app) })
    //     : new Promise<any>((resolve, reject) => {
    //         if (typeof window === "undefined") {
    //           return resolve({ default: () => <>...</> });
    //         }

    //         const maybeAsyncApp =
    //           typeof app === "function" ? app({ isSelfHosted: false }) : app;
    //         const isPromiseApp = isPromise(maybeAsyncApp);
    //         if (isPromiseApp) {
    //           maybeAsyncApp.then((resolved) => {
    //             getMount({
    //               app: resolved.default,
    //               context,
    //             }).then(({ mount, url, name }) => {
    //               if (!mount) {
    //                 throw new Error(`mount is undefined for ${name} ${url}`);
    //               }

    //               cache.set(app, () => ({
    //                 default: () => (
    //                   // <Component mount={mount} url={url} runtime={runtime} />
    //                   <h1>Hello</h1>
    //                 ),
    //               }));
    //               resolve(cache.get(app));
    //             });
    //           });
    //         }
    //         // ? (await maybeAsyncApp).default
    //         // : maybeAsyncApp;

    //         // const { mount, url, name } = await getMount({
    //         //   app: resolvedApp,
    //         //   context,
    //         // });

    //         // async function execute() {
    //         //   let resolvedApp: ComposableApp | undefined;

    //         //   try {
    //         //     const maybeAsyncApp =
    //         //       typeof app === "function" ? app({ isSelfHosted: false }) : app;
    //         //     resolvedApp = isPromise(maybeAsyncApp)
    //         //       ? (await maybeAsyncApp).default
    //         //       : maybeAsyncApp;
    //         //     // const { mount, url, name } = await getMount({
    //         //     //   app: resolvedApp,
    //         //     //   context,
    //         //     // });
    //         //     // if (!mount) {
    //         //     //   throw new Error(`mount is undefined for ${name} ${url}`);
    //         //     // }
    //         //     // resolve({
    //         //     //   default: () => (
    //         //     //     <ErrorBoundary
    //         //     //       onError={(error) =>
    //         //     //         runtime.logError(error, {
    //         //     //           scope: resolvedApp?.packageName,
    //         //     //         })
    //         //     //       }
    //         //     //     >
    //         //     //       <Component mount={mount} url={url} runtime={runtime} />
    //         //     //     </ErrorBoundary>
    //         //     //   ),
    //         //     // });
    //         //   } catch (error) {
    //         //     console.log(`🔥🔥🔥🔥🔥🔥🔥🔥🔥 error`, error);
    //         //     //resolve(error);
    //         //     resolve({
    //         //       default: () => <ErrorComponent error={error as Error} />,
    //         //     });
    //         //   }
    //         // }

    //         // execute();
    //       });
    // });

    return <LazyApp />;
  };
}
