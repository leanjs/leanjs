import { createValidJSVarName } from "./utils";

describe("utils: createValidJSVarName", () => {
  it(`removes all characters but numberes and ASCII letters`, async () => {
    let actual = createValidJSVarName("afdasdf");
    expect(actual).toContain("afdasdf");

    actual = createValidJSVarName("af$@EFWdasdf");
    expect(actual).toContain("afEFWdasdf");

    actual = createValidJSVarName("https://github.com/leanjs/leanjs");
    expect(actual).toContain("httpsgithubcomleanjsleanjs");

    actual = createValidJSVarName("@my-org/some-Nam´#123");
    expect(actual).toContain("myorgsomeNam123");

    actual = createValidJSVarName("123@my-org/some-Nam´#");
    expect(actual).toContain("123myorgsomeNam");
  });

  it(`adds an underscore at the beginning of the string`, async () => {
    const actual = createValidJSVarName("afdasdf");
    expect(actual).toBe("_afdasdf");
  });
});
