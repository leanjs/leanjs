import { configureRuntime, GetRuntime } from "@leanjs/core";

const defaultState = {
  locale: "en",
};

export const { createRuntime } = configureRuntime(defaultState)({
  onError: (error) =>
    console.log(`🚨 log this properly 🔥! e.g. Sentry`, error),
});

export type Runtime = GetRuntime<typeof createRuntime>;

/****************************/

type BreakDownObject<O, R = void> = {
  [K in keyof O as string]: K extends string
    ? R extends string
      ? // Prefix with dot notation as well
        `${R}.${K}` | ObjectDotNotation<O[K], `${R}.${K}`>
      : K | ObjectDotNotation<O[K], K>
    : never;
};

type ObjectDotNotation<O, R = void> = O extends string
  ? R extends string
    ? R
    : never
  : BreakDownObject<O, R>[keyof BreakDownObject<O, R>];

const TranslationObject = {
  viewName: {
    componentName: {
      title: "translated title",
    },
  },
};

declare function getState(
  dottedString: ObjectDotNotation<typeof TranslationObject>
): string;

getState("viewName.componentName.title");
getState("viewName.componentName");
