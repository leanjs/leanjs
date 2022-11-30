import { configureRuntime, _ } from "@leanjs/core";
import { render, renderHook, act } from "@testing-library/react";
import React, { ReactElement } from "react";
import waitForExpect from "wait-for-expect";
import { createRuntimeBindings, _ as ReactCore } from "@leanjs/react/18";

const { RuntimeProvider } = ReactCore;

const defaultState = {
  locale: "en",
  theme: "dark",
};

const { createRuntime } = configureRuntime(defaultState)({
  onError: () => {
    // empty
  },
});

const { useGetter, useSetter, useLoading, useError, useRuntime } =
  createRuntimeBindings(createRuntime);
interface WrapperProps {
  children: ReactElement;
}
const createWrapper =
  (runtime = createRuntime({ context: { appName: "TestApp" } })) =>
  ({ children }: WrapperProps) =>
    (
      <RuntimeProvider isSelfHosted={true} runtime={runtime}>
        {children}
      </RuntimeProvider>
    );
describe("createRuntimeBindings", () => {
  it("returns a HostProvider", () => {
    const { HostProvider } = createRuntimeBindings(createRuntime);
    expect(typeof HostProvider).toBe("function");
  });
});

describe("useRuntime", () => {
  it("throws an error if there is no Runtime in the context", () => {
    const consoleError = console.error;
    console.error = jest.fn();
    const Component = () => {
      useRuntime();
      return null;
    };

    expect(() => {
      render(<Component />);
    }).toThrowError();

    console.error = consoleError;
  });

  it("returns a Runtime from the context", () => {
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
});

describe("useSetter", () => {
  it("throws an error if there is no Runtime in the context", () => {
    const consoleError = console.error;
    console.error = jest.fn();
    const Component = () => {
      useSetter("locale");
      return null;
    };

    expect(() => {
      render(<Component />);
    }).toThrowError();

    console.error = consoleError;
  });

  it(`throws an error given an invalid prop`, () => {
    const consoleError = console.error;
    console.error = jest.fn();
    const Component = () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const setInvalidProp = useSetter("invalid_prop");
      setInvalidProp("1");
      return null;
    };
    const Wrapper = createWrapper();

    expect(() => {
      render(
        <Wrapper>
          <Component />
        </Wrapper>
      );
    }).toThrowError();

    console.error = consoleError;
  });

  describe("given a valid prop", () => {
    describe("returns a function that", () => {
      it("throws if there is no RuntimeProvider in the context", () => {
        const consoleError = console.error;
        console.error = jest.fn();
        const Component = () => {
          useSetter("locale");
          return null;
        };

        expect(() => {
          render(<Component />);
        }).toThrowError();

        console.error = consoleError;
      });

      it("updates the state", async () => {
        const runtime = createRuntime({ context: { appName: "TestApp" } });
        const { result } = renderHook(() => useSetter("locale"), {
          wrapper: createWrapper(runtime),
        });
        const random = Math.random().toString();
        expect(typeof result.current).toBe("function");
        act(() => {
          result.current(random);
        });
        await waitForExpect(() => {
          expect(runtime.state.get("locale")).toBe(random);
        });
      });

      // it(`doesn't rerender when that state prop changes`, async () => {
      //   const runtime = createRuntime({ context: { appName: "TestApp" } });
      //   await runtime.state.loaded();
      //   // const { waitForNextUpdate } = renderHook(() => useSetter("locale"), {
      //   renderHook(() => useSetter("locale"), {
      //     wrapper: createWrapper(runtime),
      //   });
      //   setTimeout(() => {
      //     runtime.state.set("locale", Math.random().toString());
      //   }, 1);
      //   let error: Error | undefined = undefined;
      //   await waitForNextUpdate({ timeout: 200 }).catch((err) => {
      //     error = err;
      //   });
      //   // Timed out means waitForNextUpdate didn't rerender again
      //   await waitForExpect(() =>
      //     expect(error?.message).toContain("Timed out")
      //   );
      // });
    });
  });
});

describe("useGetter", () => {
  it("throws an error if there is no Runtime in the context", () => {
    const consoleError = console.error;
    console.error = jest.fn();
    const Component = () => {
      useGetter("locale");
      return null;
    };

    expect(() => {
      render(<Component />);
    }).toThrowError();

    console.error = consoleError;
  });

  it(`throws an error given an invalid prop`, () => {
    const consoleError = console.error;
    console.error = jest.fn();
    const Component = () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      useGetter("invalid_prop");
      return null;
    };
    const Wrapper = createWrapper();
    expect(() => {
      render(
        <Wrapper>
          <Component />
        </Wrapper>
      );
    }).toThrowError();

    console.error = consoleError;
  });

  describe("given a valid prop", () => {
    it("returns the current value", async () => {
      const runtime = createRuntime({ context: { appName: "TestApp" } });
      const { result } = renderHook(() => useGetter("locale"), {
        wrapper: createWrapper(runtime),
      });
      expect(result.current).toBe("en");
    });

    it("rerenders when the current value changes", async () => {
      const runtime = createRuntime({ context: { appName: "TestApp" } });
      const random = Math.random().toString();
      const { result } = renderHook(() => useGetter("locale"), {
        wrapper: createWrapper(runtime),
      });
      expect(result.current).toBe("en");
      act(() => {
        runtime.state.set("locale", random);
      });
      await waitForExpect(() => expect(result.current).toBe(random));
    });
  });
});

describe("useLoading", () => {
  it("throws an error if there is no Runtime in the context", () => {
    const consoleError = console.error;
    console.error = jest.fn();
    const Component = () => {
      useLoading("locale");
      return null;
    };

    expect(() => {
      render(<Component />);
    }).toThrowError();

    console.error = consoleError;
  });

  it(`throws an error given an invalid prop`, () => {
    const consoleError = console.error;
    console.error = jest.fn();
    const Component = () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      useLoading("invalid_prop");
      return null;
    };
    const Wrapper = createWrapper();
    expect(() => {
      render(
        <Wrapper>
          <Component />
        </Wrapper>
      );
    }).toThrowError();

    console.error = consoleError;
  });

  it("returns the current loading state of that state prop given a valid prop", async () => {
    const runtime = createRuntime({ context: { appName: "TestApp" } });
    const random = Math.random().toString();
    const { result } = renderHook(() => useLoading("locale"), {
      wrapper: createWrapper(runtime),
    });
    expect(result.current).toBe(false);
    act(() => {
      runtime.state.load(
        "locale",
        () => new Promise((resolve) => setTimeout(() => resolve(random), 1)),
        { appName: "TestApp" }
      );
    });
    expect(result.current).toBe(true);
    await waitForExpect(() => expect(result.current).toBe(false));
  });
});

describe("useError", () => {
  it("throws an error if there is no Runtime in the context", () => {
    const consoleError = console.error;
    console.error = jest.fn();
    const Component = () => {
      useError("locale");
      return null;
    };
    expect(() => {
      render(<Component />);
    }).toThrowError();

    console.error = consoleError;
  });

  it(`throws an error given an invalid prop`, async () => {
    const consoleError = console.error;
    console.error = jest.fn();
    const Component = () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      useError("invalid_prop");

      return null;
    };
    const Wrapper = createWrapper();

    expect(() => {
      render(
        <Wrapper>
          <Component />
        </Wrapper>
      );
    }).toThrowError();

    console.error = consoleError;
  });

  it("returns the current error of that state prop given a valid prop", async () => {
    const runtime = createRuntime({ context: { appName: "TestApp" } });
    const random = Math.random().toString();
    const { result } = renderHook(() => useError("locale"), {
      wrapper: createWrapper(runtime),
    });

    expect(result.current).toBe(undefined);

    await act(async () => {
      await runtime.state.load(
        "locale",
        () => new Promise((_, reject) => setTimeout(() => reject(random), 1)),
        { appName: "TestApp" }
      );
    });

    await waitForExpect(() => {
      expect(result.current).toBe(random);
    });
  });
});
