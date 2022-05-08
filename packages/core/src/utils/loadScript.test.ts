import { loadScript } from "./loadScript";

describe("loadScript", () => {
  it("adds async script to the head", () => {
    const src = "https://leanjs.org/script.js";
    jest.spyOn(document.head, "appendChild");

    loadScript(src);

    expect(document.head.appendChild).toBeCalledWith(
      expect.objectContaining({
        async: true,
        src,
      })
    );
  });
});
