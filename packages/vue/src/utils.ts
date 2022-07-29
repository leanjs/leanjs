import { _ as CoreUtils } from "@leanjs/core";

const { isObject } = CoreUtils;

export function shallowCopy(data: any) {
  if (Array.isArray(data)) {
    return data.slice();
  } else if (isObject(data)) {
    return { ...data };
  } else {
    return data;
  }
}

export const isPrimitive = (test: any) => test !== Object(test);
