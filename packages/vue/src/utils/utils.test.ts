import { shallowCopy, isPrimitive, isObject } from "./";

describe("utils: shallowCopy", () => {
  it("changes the reference for objects", () => {
    const obj1 = { a: 1, b: 2 };

    const obj2 = shallowCopy(obj1);

    expect(obj1).not.toBe(obj2);
    expect(obj1).toEqual(obj2);
  });

  it("changes the reference for an array", () => {
    const arr1 = [{ a: 1, b: 2 }];

    const arr2 = shallowCopy(arr1);

    expect(arr1).not.toBe(arr2);
    expect(arr1).toEqual(arr2);
  });

  it("doesn't change the reference of a function", () => {
    const fn1 = () => {
      // empty
    };

    const fn2 = shallowCopy(fn1);

    expect(fn1).toBe(fn2);
  });

  it("doesn't change the reference of primitive types", () => {
    const num1 = 1;
    const num2 = shallowCopy(num1);

    expect(num1).toBe(num2);
  });
});

describe("utils: isPrimitive", () => {
  it("returns true for primitive types", () => {
    expect(isPrimitive(1)).toBe(true);
    expect(isPrimitive(false)).toBe(true);
    expect(isPrimitive("")).toBe(true);
    expect(isPrimitive(null)).toBe(true);
  });

  it("returns false for non-primitive types", () => {
    expect(isPrimitive({})).toBe(false);
    expect(isPrimitive([])).toBe(false);
  });
});

describe("utils: isObject", () => {
  it("returns true for object types", () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ a: 1 })).toBe(true);
    expect(isObject({ a: { b: 2 } })).toBe(true);
  });

  it("returns false for non-primitive types", () => {
    expect(
      isObject(function () {
        // empty
      })
    ).toBe(false);
    expect(isObject([])).toBe(false);
    expect(isObject("")).toBe(false);
    expect(isObject(1)).toBe(false);
    expect(isObject(false)).toBe(false);
    expect(isObject(null)).toBe(false);
    expect(isObject(undefined)).toBe(false);
  });
});
