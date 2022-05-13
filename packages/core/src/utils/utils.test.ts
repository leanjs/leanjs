import { createRemoteName } from "./index";

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
