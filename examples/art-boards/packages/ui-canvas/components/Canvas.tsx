import React, { useRef, useLayoutEffect } from "react";

type Unmount = () => void;

interface CanvasProps {
  mount: (element: HTMLDivElement | null) => Unmount;
}

export function Canvas({ mount }: CanvasProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => mount(ref.current), [mount]);

  return <div ref={ref} />;
}
