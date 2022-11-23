import React, { useCallback } from "react";
import { _ as ReactUtils } from "@leanjs/react/18";
import type { InnerHostProps } from "@leanjs/react";
import type { NavigationListener, Location } from "@leanjs/core";
import { _ as CoreUtils } from "@leanjs/core";
import { useRouter } from "next/router";
import Head from "next/head";

const { createHost } = ReactUtils;
const { dedupeSlash } = CoreUtils;

export const Host = createHost(NextHost);

function NextHost({ Mount, url, ...rest }: InnerHostProps) {
  const router = useRouter();
  const basename = dedupeSlash(`${router.basePath}/${router.pathname}`);
  const pathname = router.asPath.replace(router.pathname, "");
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
  const listen = useCallback((listener: NavigationListener) => {
    function onRouteChange(newHostPathname: string) {
      const {
        location: { hash, search },
      } = window;
      listener({
        action: "PUSH",
        location: { pathname: newHostPathname, hash, search },
      });
    }
    router.events.on("routeChangeStart", onRouteChange);

    return () => router.events.off("routeChangeStart", onRouteChange);
  }, []);

  return (
    <>
      {url ? (
        <Head>
          <link rel="preload" as="script" href={url} />
        </Head>
      ) : null}
      <Mount
        {...rest}
        navigate={navigate}
        listen={listen}
        basename={basename}
        pathname={pathname}
      />
    </>
  );
}
