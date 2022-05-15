export const isObject = (data: any) =>
  ({}.toString.call(data) === "[object Object]" && data !== null);

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
