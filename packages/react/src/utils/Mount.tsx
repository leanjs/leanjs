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
}: MountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const initialPathname = useRef(pathname).current;

  useLayoutEffect(() => {
    const { unmount, onHostNavigate } = mount(ref.current, {
      onRemoteNavigate: (nextPathname, { hash, search } = {}) => {
        const { pathname } = window.location;
        if (pathname !== nextPathname) {
          navigate?.({
            action: "PUSH",
            location: { pathname: nextPathname, search, hash },
          });
        }
      },
      basename,
      pathname: initialPathname,
      runtime,
    });

    const removeListener = onHostNavigate
      ? listen?.(({ location: { pathname: nextPathname, ...rest } }) => {
          onHostNavigate(nextPathname, rest);
        })
      : null;

    return () => {
      unmount();
      removeListener?.();
    };
  }, [mount, runtime, basename, listen, navigate, initialPathname]);

  return <div className={className} ref={ref} />;
});
