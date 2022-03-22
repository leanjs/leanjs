import { configureRuntime } from "@leanjs/runtime";
import { render } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import React, { ReactNode } from "react";
import waitForExpect from "wait-for-expect";

import { createRuntimeBindings } from "./createRuntimeBindings";

const defaultState = {
  locale: "en",
  theme: "dark",
};

const { createRuntime } = configureRuntime(defaultState)({
  onError: () => {},
});

const { useGetter, useSetter, useRuntime, RuntimeProvider } =
  createRuntimeBindings(createRuntime);

interface WrapperProps {
  children: ReactNode;
}
const createWrapper =
  (runtime = createRuntime()) =>
  ({ children }: WrapperProps) =>
    <RuntimeProvider runtime={runtime}>{children}</RuntimeProvider>;

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

    expect(typeof runtime.load).toBe("function");
    expect(typeof runtime.loaded).toBe("function");
    expect(typeof runtime.loader).toBe("object");
    expect(typeof runtime.state).toBe("object");
    expect(typeof runtime.on).toBe("function");
    expect(typeof runtime.subscribe).toBe("function");
    expect(typeof runtime.booted).toBe("function");
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
          expect(runtime.state.locale).toBe(random);
        });
      });

      it(`doesn't rerender when that state prop changes`, async () => {
        const runtime = createRuntime();

        const { waitForNextUpdate } = renderHook(() => useSetter("locale"), {
          wrapper: createWrapper(runtime),
        });

        setTimeout(() => {
          runtime.state.locale = Math.random().toString();
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
        it("returns a tuple of 3 elements where the first index is the current value", async () => {
          const runtime = createRuntime();
          const random = Math.random().toString();
          const { result } = renderHook(() => useGetter("locale"), {
            wrapper: createWrapper(runtime),
          });

          expect(result.current[0]).toBe("en");

          act(() => {
            runtime.state.locale = random;
          });

          await waitForExpect(() => expect(result.current[0]).toBe(random));
        });

        it("returns a tuple of 3 elements where the second index is the current loading state of that state prop", async () => {
          const runtime = createRuntime();
          const random = Math.random().toString();
          const { result, waitForNextUpdate } = renderHook(
            () => useGetter("locale"),
            {
              wrapper: createWrapper(runtime),
            }
          );

          expect(result.current[1]).toBe(false);

          act(() => {
            runtime.load(
              "locale",
              () =>
                new Promise((resolve) => setTimeout(() => resolve(random), 1))
            );
          });

          expect(result.current[1]).toBe(true);

          await waitForNextUpdate();
          await waitForExpect(() => expect(result.current[1]).toBe(false));
        });

        it("returns a tuple of 3 elements where the third index is the current error of that state prop", async () => {
          const runtime = createRuntime();
          const random = Math.random().toString();
          const { result, waitForNextUpdate } = renderHook(
            () => useGetter("locale"),
            {
              wrapper: createWrapper(runtime),
            }
          );

          expect(result.current[2]).toBe(undefined);

          act(() => {
            runtime.load(
              "locale",
              () =>
                new Promise((_, reject) => setTimeout(() => reject(random), 1))
            );
          });
          await waitForNextUpdate();

          expect(result.current[2]).toBe(random);
        });
      });
    });
  });
});
