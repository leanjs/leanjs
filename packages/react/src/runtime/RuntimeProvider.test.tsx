import { configureRuntime } from "@leanjs/core";
import { render } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import React, { ReactElement } from "react";

import { RuntimeProvider, useRuntime } from "./RuntimeProvider";

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
  (runtime = createRuntime({ context: { appName: "TestApp" } })) =>
  // eslint-disable-next-line react/display-name
  ({ children }: WrapperProps) =>
    <RuntimeProvider runtime={runtime}>{children}</RuntimeProvider>;

describe("useRuntime", () => {
  it("returns a Runtime if there is a Runtime in the context", () => {
    const { result } = renderHook(() => useRuntime(), {
      wrapper: createWrapper(),
    });
    const runtime = result.current;

    expect(typeof runtime.state.load).toBe("function");
    expect(typeof runtime.state.loaded).toBe("function");
    expect(typeof runtime.state.loader).toBe("object");
    expect(typeof runtime.state.get).toBe("function");
    expect(typeof runtime.state.set).toBe("function");
    expect(typeof runtime.state.listen).toBe("function");
  });

  it("throws an error if it can't find a runtime in the context", () => {
    const EmptyComp = () => {
      useRuntime();
      return null;
    };

    expect(() => {
      render(<EmptyComp />);
    }).toThrowError();
  });

  it(`doesn't throw an error if it can't find a runtime in the context`, () => {
    const EmptyComp = () => {
      useRuntime();
      return null;
    };

    expect(() => {
      const runtime = createRuntime({ context: { appName: "TestApp" } });

      render(
        <RuntimeProvider runtime={runtime}>
          <EmptyComp />
        </RuntimeProvider>
      );
    }).not.toThrowError();
  });
});
