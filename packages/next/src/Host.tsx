import React, { useCallback } from "react";
import { _ as ReactUtils } from "@leanjs/react";
import type { HostProps } from "@leanjs/react";
import type { Listener, NavigationUpdate } from "@leanjs/core";
import { useRouter } from "next/router";
import Head from "next/head";

const { useHost, Mount, DefaultLoading, DefaultError } = ReactUtils;

export function Host({
  remote,
  pathname,
  basename,
  className,
  loadingComponent: LoadingComponent = DefaultLoading,
  errorComponent: ErrorComponent = DefaultError,
}: HostProps) {
  const router = useRouter();
  const { mount, error, url, runtime } = useHost({ remote });

  const navigate = useCallback(
    ({ location: { pathname, hash, search } }: NavigationUpdate) => {
      router.push(
        {
          pathname,
          hash,
          search,
        },
        undefined,
        {
          shallow: true,
        }
      );
    },
    []
  );

  const listen = useCallback((listener: Listener) => {
    function onRouteChangeComplete(newHostPathname: string) {
      const {
        location: { hash, search },
      } = window;
      listener({
        action: "PUSH",
        location: { pathname: newHostPathname, hash, search },
      });
    }
    router.events.on("routeChangeComplete", onRouteChangeComplete);

    return () =>
      router.events.off("routeChangeComplete", onRouteChangeComplete);
  }, []);

  const children = mount ? (
    <Mount
      mount={mount}
      navigate={navigate}
      listen={listen}
      basename={basename}
      className={className}
      pathname={pathname}
      runtime={runtime}
    />
  ) : error ? (
    <ErrorComponent error={error} />
  ) : (
    <LoadingComponent />
  );

  return (
    <>
      <Head>
        <link rel="preload" as="script" href={url} />
      </Head>
      {children}
    </>
  );
}
