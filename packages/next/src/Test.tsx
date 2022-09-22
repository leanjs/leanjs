import React, { useCallback } from "react";
import { _ as ReactUtils } from "@leanjs/react";
import type { AsyncHostProps, CreateHostProps } from "@leanjs/react";
import type { Listener, Location } from "@leanjs/core";
import { _ as CoreUtils } from "@leanjs/core";
import { useRouter } from "next/router";
import Head from "next/head";

const { createHost, Mount } = ReactUtils;
const { dedupeSlash } = CoreUtils;

interface BaseNextHostProps {
  pathname?: string;
}

interface NextHostProps extends BaseNextHostProps, AsyncHostProps {}
interface CreateNextHostProps extends BaseNextHostProps, CreateHostProps {}

export default function NextHost({
  // pathname,
  // className,
  // mount,
  // runtime,
  url,
  ...rest
}: CreateNextHostProps) {
  return <>aaaaa</>;
  const router = useRouter();
  const basename = dedupeSlash(`${router.basePath}/${router.pathname}`);

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
        // mount={mount}
        // className={className}
        // pathname={pathname}
        // runtime={runtime}
      />
    </>
  );
}
