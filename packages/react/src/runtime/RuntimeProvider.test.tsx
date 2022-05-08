import { configureRuntime } from "@leanjs/core";
import { render } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import React, { ReactElement } from "react";

import { BaseRuntimeProvider, useBaseRuntime } from "./RuntimeProvider";

const defaultState = {
  locale: "en",
  theme: "dark",
};

const { createRuntime } = configureRuntime(defaultState)({
  onError: console.log,
});

interface WrapperProps {
  children: ReactElement;
}
const createWrapper =
  (runtime = createRuntime()) =>
  // eslint-disable-next-line react/display-name
  ({ children }: WrapperProps) =>
    <BaseRuntimeProvider runtime={runtime}>{children}</BaseRuntimeProvider>;

describe("useRuntime", () => {
  it("returns a Runtime if there is a Runtime in the context", () => {
    const { result } = renderHook(() => useBaseRuntime(), {
      wrapper: createWrapper(),
    });
    const runtime = result.current;

    expect(typeof runtime.load).toBe("function");
    expect(typeof runtime.loaded).toBe("function");
    expect(typeof runtime.loader).toBe("object");
    expect(typeof runtime.state).toBe("object");
    expect(typeof runtime.on).toBe("function");
    expect(typeof runtime.subscribe).toBe("function");
    expect(typeof runtime.booted).toBe("function");
  });

  it("throws an error if it can't find a runtime in the context", () => {
    const EmptyComp = () => {
      useBaseRuntime();
      return null;
    };

    expect(() => {
      render(<EmptyComp />);
    }).toThrowError();
  });

  it(`doesn't throw an error if it can't find a runtime in the context`, () => {
    const EmptyComp = () => {
      useBaseRuntime();
      return null;
    };

    expect(() => {
      const runtime = createRuntime();

      render(
        <BaseRuntimeProvider runtime={runtime}>
          <EmptyComp />
        </BaseRuntimeProvider>
      );
    }).not.toThrowError();
  });
});
