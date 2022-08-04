import React, { useCallback } from "react";
import { _ as ReactUtils } from "@leanjs/react";
import type { HostProps } from "@leanjs/react";
import type { Listener, Location } from "@leanjs/core";
import { _ as CoreUtils } from "@leanjs/core";
import { useRouter } from "next/router";
import Head from "next/head";

const { useHost, Mount, DefaultError } = ReactUtils;
const { dedupeSlash } = CoreUtils;

interface NextHostProps extends HostProps {
  pathname?: string;
}

export function Host({
  remote,
  pathname,
  className,
  loadingComponent: LoadingComponent = () => <>...</>,
  errorComponent: ErrorComponent = DefaultError,
}: NextHostProps) {
  const router = useRouter();
  const basename = dedupeSlash(`${router.basePath}/${router.pathname}`);
  const { mount, error, url, runtime } = useHost({ remote });

  const navigate = useCallback(({ pathname, hash, search }: Location) => {
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
  }, []);

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
      {process.env.NODE_ENV === "development" ? null : (
        <Head>
          <link rel="preload" as="script" href={url} />
        </Head>
      )}
      {children}
    </>
  );
}
