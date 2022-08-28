import { _ as CoreUtils } from "@leanjs/core";

const { isObject, isPrimitive } = CoreUtils;

export function shallowCopy(data: any) {
  if (Array.isArray(data)) {
    return data.slice();
  } else if (isObject(data)) {
    return { ...data };
  } else {
    return data;
  }
}
