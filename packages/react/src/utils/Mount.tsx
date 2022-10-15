import React, { memo, useLayoutEffect, useRef } from "react";

import type { MountProps } from "../types";

export const Mount = memo(function Mount({
  navigate,
  listen,
  mount,
  pathname,
  basename,
  runtime,
  className,
  setError,
}: MountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const initialPathname = useRef(pathname).current;

  useLayoutEffect(() => {
    const { unmount, onHostNavigate } = mount(ref.current, {
      onRemoteNavigate: (location) => {
        const { pathname } = window.location;
        if (pathname !== location.pathname) {
          navigate?.(location);
        }
      },
      basename,
      pathname: initialPathname,
      runtime,
      onError: setError,
    });

    const removeListener = onHostNavigate
      ? listen?.((navigationUpdate) => {
          onHostNavigate(navigationUpdate.location);
        })
      : null;

    return () => {
      unmount();
      removeListener?.();
    };
  }, [mount, runtime, basename, listen, navigate, initialPathname]);

  return <div className={className} ref={ref} />;
});
