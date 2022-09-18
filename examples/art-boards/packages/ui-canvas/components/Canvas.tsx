import React, { useRef, useLayoutEffect, CSSProperties } from "react";

type Unmount = () => void;

interface CanvasProps {
  mount: (element: HTMLDivElement | null) => Unmount;
  style?: CSSProperties;
}

export function Canvas({ mount, style }: CanvasProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => mount(ref.current), [mount]);

  return <div style={style} ref={ref} />;
}
