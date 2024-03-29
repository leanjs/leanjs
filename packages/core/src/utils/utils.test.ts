import {
  createRemoteName,
  isError,
  isObject,
  isPromise,
  createAppError,
  setRuntimeContext,
} from "./index";

import { configureRuntime } from "../runtime";

function emptyFunction() {
  // empty
}

describe("utils: setRuntimeContext", () => {
  const { createRuntime } = configureRuntime({})({
    onError: emptyFunction,
    apiFactory: {
      fake: () => 1,
    },
  });

  it(`returns undefined if no runtime is passed`, () => {
    const actual = setRuntimeContext({ appName: "TestApp" }, undefined);
    expect(actual).toBe(undefined);
  });

  it(`returns a new runtime with a new appName if a runtime is passed`, () => {
    const initialAppName = Math.random().toString();
    const initialContext = { appName: initialAppName };
    const runtime = createRuntime({ context: initialContext });

    const newAppName = Math.random().toString();
    const newRuntimeContext = setRuntimeContext(
      { appName: newAppName },
      runtime
    );

    expect(runtime).not.toBe(newRuntimeContext);

    expect(runtime.context.appName).toBe(initialAppName);
    expect(runtime.context.version).toBe(undefined);
    expect(newRuntimeContext?.context.appName).toBe(
      `${initialAppName} ( ${newAppName} )`
    );
  });

  it(`returns a new runtime with a new version if a version and runtime is passed`, () => {
    const initialAppName = Math.random().toString();
    const initialVersion = Math.random().toString();
    const initialContext = { appName: initialAppName, version: initialVersion };
    const runtime = createRuntime({ context: initialContext });

    const newAppName = Math.random().toString();
    const newVersion = Math.random().toString();
    const newRuntimeContext = setRuntimeContext(
      { appName: newAppName, version: newVersion },
      runtime
    );

    expect(runtime).not.toBe(newRuntimeContext);
    expect(runtime.context.appName).toBe(initialAppName);
    expect(newRuntimeContext?.context.appName).toBe(
      `${initialAppName} ( ${newAppName} )`
    );
    expect(newRuntimeContext?.context.version).toBe(
      `${initialVersion} ( ${newVersion} )`
    );
  });

  it(`only changes runtime context from the original runtime`, () => {
    const initialContext = { appName: Math.random().toString() };
    const runtime = createRuntime({ context: initialContext });
    const newAppName = Math.random().toString();
    const newVersion = Math.random().toString();
    const newRuntimeContext = setRuntimeContext(
      { appName: newAppName, version: newVersion },
      runtime
    );

    expect(runtime.api.fake).toBe(newRuntimeContext?.api.fake);
    expect(runtime.api).toBe(newRuntimeContext?.api);
    expect(runtime.state).toBe(newRuntimeContext?.state);
    expect(runtime.cleanup).toBe(newRuntimeContext?.cleanup);
    expect(runtime.logError).toBe(newRuntimeContext?.logError);
  });
});

describe("utils: isError", () => {
  it(`returns true when the input is an error`, () => {
    const actual = isError(new Error());
    expect(actual).toBe(true);
  });

  it(`returns false when the input is not an error`, () => {
    expect(isError(undefined)).toBe(false);
    expect(isError(1)).toBe(false);
    expect(isError("undefined")).toBe(false);
    expect(isError(new Date())).toBe(false);
    expect(isError(true)).toBe(false);
    expect(isError({})).toBe(false);
  });
});

describe("utils: createAppError", () => {
  it(`returns a new error if the input is not an error`, () => {
    const actual = createAppError({ error: Math.random(), appName: "TestApp" });

    expect(actual.name).toBe("Error::TestApp");
    expect(actual instanceof Error).toBe(true);
  });

  it(`adds appName to the error`, () => {
    const appName = Math.random().toString();
    const actual = createAppError({ error: new Error(), appName });

    expect(actual.name).toBe(`Error::${appName}`);
    expect(actual.appName).toBe(appName);
    expect(actual instanceof Error).toBe(true);
  });

  it(`adds appName and version to the error`, () => {
    const version = Math.random().toString();
    const appName = Math.random().toString();
    const actual = createAppError({ error: new Error(), appName, version });

    expect(actual.name).toBe(`Error::${appName}::${version}`);
    expect(actual.appName).toBe(appName);
    expect(actual.version).toBe(version);
    expect(actual instanceof Error).toBe(true);
  });
});

describe("utils: createRemoteName", () => {
  it(`removes all characters but numberes and ASCII letters`, async () => {
    let actual = createRemoteName("afdasdf");
    expect(actual).toContain("afdasdf");

    actual = createRemoteName("af$@EFWdasdf");
    expect(actual).toContain("af_EFWdasdf");

    actual = createRemoteName("https://github.com/leanjs/leanjs");
    expect(actual).toContain("_https_github_com_leanjs_leanjs");

    actual = createRemoteName("@my-org/some-Nam´#123");
    expect(actual).toContain("__my_org_some_Nam_123");

    actual = createRemoteName("123@my-org/some-Nam´#");
    expect(actual).toContain("_123_my_org_some_Nam_");
  });

  it(`adds an underscore at the beginning of the string`, async () => {
    const actual = createRemoteName("afdasdf");
    expect(actual).toBe("_afdasdf");
  });
});

describe("utils: isObject", () => {
  it("returns true for object types", () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ a: 1 })).toBe(true);
    expect(isObject({ a: { b: 2 } })).toBe(true);
  });

  it("returns false for non-object types", () => {
    expect(isObject(emptyFunction)).toBe(false);
    expect(isObject([])).toBe(false);
    expect(isObject("")).toBe(false);
    expect(isObject(1)).toBe(false);
    expect(isObject(false)).toBe(false);
    expect(isObject(null)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject(Promise.resolve())).toBe(false);
    expect(isObject(new Promise(emptyFunction))).toBe(false);
  });
});

describe("utils: isPromise", () => {
  it("returns true for promise types", () => {
    expect(isPromise(Promise.resolve())).toBe(true);
    expect(isPromise(new Promise(emptyFunction))).toBe(true);
  });

  it("returns false for non-promise types", () => {
    expect(isPromise(emptyFunction)).toBe(false);
    expect(isPromise([])).toBe(false);
    expect(isPromise("")).toBe(false);
    expect(isPromise(1)).toBe(false);
    expect(isPromise(false)).toBe(false);
    expect(isPromise(null)).toBe(false);
    expect(isPromise(undefined)).toBe(false);
    expect(isPromise({})).toBe(false);
    expect(isPromise({ a: 1 })).toBe(false);
    expect(isPromise({ a: { b: 2 } })).toBe(false);
  });
});
