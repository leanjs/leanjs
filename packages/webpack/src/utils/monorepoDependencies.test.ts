afterEach(() => {
  jest.resetModules();
  jest.unmock("@leanjs/cli");
});

const mocksMonorepoPath = `${__dirname}/../../mocks/monorepo`;

describe("monorepoDependencies", () => {
  it("finds versions in the monorepo only using workspaces and root package.json if workspaces is defined", async () => {
    const react = Math.random().toString();
    const vue = Math.random().toString();
    const rootPackageJson = {
      name: "root",
      dependencies: {
        react,
        vue,
      },
      workspaces: ["packages/*", "I-dont-exist"],
    };

    jest.doMock("@leanjs/cli", () => ({
      ...jest.requireActual("@leanjs/cli"),
      findRootConfigSync: () => ({
        packageJson: rootPackageJson,
        absolutePath: mocksMonorepoPath,
      }),
    }));

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { findMonorepoDependencies } = require("./monorepoDependencies");

    const versions = await findMonorepoDependencies();

    expect(versions).toEqual({
      "package-a": "1.2.3",
      "package-b": "~11.22.33",
      react,
      vue,
    });
  });

  it("finds all versions in the monorepo package.jsons if no workspaces is defined", async () => {
    const react = Math.random().toString();
    const vue = Math.random().toString();
    const rootPackageJson = {
      name: "root",
      dependencies: {
        react,
        vue,
      },
    };

    jest.doMock("@leanjs/cli", () => ({
      ...jest.requireActual("@leanjs/cli"),
      findRootConfigSync: () => ({
        packageJson: rootPackageJson,
        absolutePath: mocksMonorepoPath,
      }),
    }));

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { findMonorepoDependencies } = require("./monorepoDependencies");

    const versions = await findMonorepoDependencies();

    expect(versions).toEqual({
      "package-a": "1.2.3",
      "package-b": "~11.22.33",
      "package-c": "3.3.3",
      "package-d": "~4.4.4",
      react,
      vue,
    });
  });

  it("doesn't find any versions in the monorepo if no root lean.config.js file is found", async () => {
    jest.doMock("@leanjs/cli", () => ({
      ...jest.requireActual("@leanjs/cli"),
      findRootConfigSync: () => ({}),
    }));

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { findMonorepoDependencies } = require("./monorepoDependencies");

    const versions = await findMonorepoDependencies();

    expect(versions).toEqual({});
  });

  it("finds versions in the monorepo package.jsons if no root package.json is found and root lean.config.js file is found", async () => {
    jest.doMock("@leanjs/cli", () => ({
      ...jest.requireActual("@leanjs/cli"),
      findRootConfigSync: () => ({
        absolutePath: mocksMonorepoPath,
      }),
    }));

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { findMonorepoDependencies } = require("./monorepoDependencies");

    const versions = await findMonorepoDependencies();

    expect(versions).toEqual({
      "package-a": "1.2.3",
      "package-b": "~11.22.33",
      "package-c": "3.3.3",
      "package-d": "~4.4.4",
    });
  });
});
