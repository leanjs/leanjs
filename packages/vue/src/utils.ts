export function shallowCopy(data: any) {
  if (Array.isArray(data)) {
    return data.slice();
  } else if (typeof data === "object" && data !== null) {
    return { ...data };
  } else {
    return data;
  }
}

export const isPrimitive = (test: any) => test !== Object(test);
