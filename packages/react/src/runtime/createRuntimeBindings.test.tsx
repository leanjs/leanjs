import { configureRuntime } from "@leanjs/core";
import { render } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import React, { ReactElement } from "react";
import waitForExpect from "wait-for-expect";

import { createRuntimeBindings } from "./createRuntimeBindings";
import { RuntimeProvider } from "./RuntimeProvider";

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
  (runtime = createRuntime()) =>
  ({ children }: WrapperProps) =>
    <RuntimeProvider runtime={runtime}>{children}</RuntimeProvider>;

describe("createRuntimeBindings", () => {
  it("returns a HostProvider", () => {
    const { HostProvider } = createRuntimeBindings(createRuntime);

    expect(typeof HostProvider).toBe("function");
  });
});

describe("useRuntime", () => {
  it("throws an error if there is no Runtime in the context", () => {
    const Component = () => {
      useRuntime();
      return null;
    };

    expect(() => {
      render(<Component />);
    }).toThrowError();
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
    const Component = () => {
      useSetter("locale");
      return null;
    };

    expect(() => {
      render(<Component />);
    }).toThrowError();
  });

  it(`throws an error given an invalid prop`, () => {
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
  });

  describe("given a valid prop", () => {
    describe("returns a function that", () => {
      it("throws if there is no RuntimeProvider in the context", () => {
        const Component = () => {
          useSetter("locale");
          return null;
        };

        expect(() => {
          render(<Component />);
        }).toThrowError();
      });

      it("updates the state", async () => {
        const runtime = createRuntime();
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

      it(`doesn't rerender when that state prop changes`, async () => {
        const runtime = createRuntime();

        await runtime.state.loaded();
        const { waitForNextUpdate } = renderHook(() => useSetter("locale"), {
          wrapper: createWrapper(runtime),
        });

        setTimeout(() => {
          runtime.state.set("locale", Math.random().toString());
        }, 1);

        let error: Error | undefined = undefined;
        await waitForNextUpdate({ timeout: 200 }).catch((err) => {
          error = err;
        });

        // Timed out means waitForNextUpdate didn't rerender again
        await waitForExpect(() =>
          expect(error?.message).toContain("Timed out")
        );
      });
    });
  });
});

describe("useGetter", () => {
  it("throws an error if there is no Runtime in the context", () => {
    const Component = () => {
      useGetter("locale");

      return null;
    };

    expect(() => {
      render(<Component />);
    }).toThrowError();
  });

  it(`throws an error given an invalid prop`, () => {
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
  });

  describe("given a valid prop", () => {
    it("returns the current value", async () => {
      const runtime = createRuntime();
      const { result } = renderHook(() => useGetter("locale"), {
        wrapper: createWrapper(runtime),
      });

      expect(result.current).toBe("en");
    });

    it("rerenders when the current value changes", async () => {
      const runtime = createRuntime();
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
    const Component = () => {
      useLoading("locale");
      return null;
    };

    expect(() => {
      render(<Component />);
    }).toThrowError();
  });

  it(`throws an error given an invalid prop`, () => {
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
  });

  it("returns the current loading state of that state prop given a valid prop", async () => {
    const runtime = createRuntime();
    const random = Math.random().toString();
    const { result, waitForNextUpdate } = renderHook(
      () => useLoading("locale"),
      {
        wrapper: createWrapper(runtime),
      }
    );

    expect(result.current).toBe(false);

    act(() => {
      runtime.state.load(
        "locale",
        () => new Promise((resolve) => setTimeout(() => resolve(random), 1))
      );
    });

    expect(result.current).toBe(true);

    await waitForNextUpdate();
    await waitForExpect(() => expect(result.current).toBe(false));
  });
});

describe("useError", () => {
  it("throws an error if there is no Runtime in the context", () => {
    const Component = () => {
      useError("locale");
      return null;
    };

    expect(() => {
      render(<Component />);
    }).toThrowError();
  });

  it(`throws an error given an invalid prop`, () => {
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
  });

  it("returns the current error of that state prop given a valid prop", async () => {
    const runtime = createRuntime();
    const random = Math.random().toString();
    const { result, waitForNextUpdate } = renderHook(() => useError("locale"), {
      wrapper: createWrapper(runtime),
    });

    expect(result.current).toBe(undefined);

    act(() => {
      runtime.state.load(
        "locale",
        () => new Promise((_, reject) => setTimeout(() => reject(random), 1))
      );
    });
    await waitForNextUpdate();

    expect(result.current).toBe(random);
  });
});
