afterEach(() => {
  jest.resetModules();
  jest.unmock("child_process");
});

describe("getMonorepoDependencies", () => {
  it("calls execFileSync and returns its output", async () => {
    const random = Math.random().toString();
    const packageName = Math.random().toString();
    jest.doMock("child_process", () => ({
      ...jest.requireActual("child_process"),
      execFileSync: () =>
        JSON.stringify({
          random,
        }),
    }));

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getMonorepoDependencies } = require("./getMonorepoDependencies");

    const monorepoDependencies = getMonorepoDependencies({
      packageName,
    });

    expect(monorepoDependencies).toEqual({
      random,
    });
  });

  it("handles error if execFileSync fails", async () => {
    const random = Math.random().toString();
    const packageName = Math.random().toString();
    jest.doMock("child_process", () => ({
      ...jest.requireActual("child_process"),
      execFileSync: () => {
        throw new Error(random);
      },
    }));
    jest.spyOn(console, "log").mockImplementation(() => {
      // do nothing
    });

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getMonorepoDependencies } = require("./getMonorepoDependencies");

    getMonorepoDependencies({
      packageName,
    });

    expect(console.log).toHaveBeenCalled();
  });
});
