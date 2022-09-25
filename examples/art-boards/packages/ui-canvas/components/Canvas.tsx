import React, { useRef, useLayoutEffect, CSSProperties } from "react";

type Unmount = () => void;

interface CanvasProps {
  mount: (element: HTMLDivElement | null) => Unmount;
  style?: CSSProperties;
  className?: string;
}

export function Canvas({ mount, ...rest }: CanvasProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => mount(ref.current), [mount]);

  return <div {...rest} ref={ref} />;
}
