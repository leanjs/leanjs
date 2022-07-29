import { createRemoteName, isObject, isPromise } from "./index";

function emptyFunction() {
  // empty
}

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
