import React, { ReactElement, useCallback } from "react";
import { _ as ReactUtils } from "@leanjs/react";
import type { HostProps } from "@leanjs/react";
import type { Listener, Location } from "@leanjs/core";
import { _ as CoreUtils } from "@leanjs/core";
import { useRouter } from "next/router";
import Head from "next/head";

const { useMount, Mount, DefaultError, useApp } = ReactUtils;
const { dedupeSlash } = CoreUtils;

interface NextHostProps extends HostProps {
  pathname?: string;
}

export const Host = (props: NextHostProps) => useApp(NextHost, props);

function NextHost({
  app,
  pathname,
  className,
  fallback = <>...</>,
  errorComponent: ErrorComponent = DefaultError,
}: NextHostProps) {
  const router = useRouter();
  const basename = dedupeSlash(`${router.basePath}/${router.pathname}`);
  const { mount, url, runtime, error, setError } = useMount({ app });
  const throwErrors = ErrorComponent === null;

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

  let children: ReactElement;
  if (error) {
    if (throwErrors) {
      throw error;
    }
    children = <ErrorComponent error={error} />;
  } else if (mount) {
    children = (
      <Mount
        mount={mount}
        navigate={navigate}
        listen={listen}
        basename={basename}
        className={className}
        pathname={pathname}
        runtime={runtime}
        setError={setError}
      />
    );
  } else {
    children = fallback;
  }

  return (
    <>
      {url ? (
        <Head>
          <link rel="preload" as="script" href={url} />
        </Head>
      ) : null}
      {children}
    </>
  );
}
