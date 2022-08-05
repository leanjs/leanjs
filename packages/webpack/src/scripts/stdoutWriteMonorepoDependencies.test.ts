afterEach(() => {
  jest.resetModules();
  jest.unmock("../utils/monorepoDependencies");
});

describe("stdoutWriteMonorepoDependencies", () => {
  it("mapps * to versions in the monorepo", async () => {
    const output = Math.random().toString();
    jest.doMock("../utils/monorepoDependencies", () => ({
      findMonorepoDependencies: async () => output,
    }));
    jest.spyOn(process.stdout, "write").mockImplementation(() => true);

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { main } = require("./stdoutWriteMonorepoDependencies");

    await main();

    // `write` is called first when we require stdoutWriteMonorepoDependencies,
    // secondly when we run main(). If we don't run main() it's not executed at all, even if we require it.
    // That's why we need to run `main()` from the test, and it ends up being called twice.
    expect(process.stdout.write).toHaveBeenCalledTimes(2);
    expect(process.stdout.write).toHaveBeenCalledWith(`"${output}"`);
  });
});
