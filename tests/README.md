# Tests

## ⚠️ 🚨 Run `node scripts/prepare-tests.mjs` before running these tests 🚨 ⚠️

Tests should be co-located within each package. Tests in this workspace are not co-located within their packages because their packages expose multiple entry points which use different versions of a common dependency.

For instance, `@leanjs/react` exposes `createRuntimeBindings` for React 17 through `@leanjs/react/17` and for React 18 through `@leanjs/react/18`. Although tests for `createRuntimeBindings` are pretty much the same for `@leanjs/react/17` and `@leanjs/react/18` each uses different versions of `react`, `react-dom`,`testing-library/react`, etc, and their TypeScript type definitions. We could inject all those dependencies to the tests and reuse the tests between different versions but the end result is cumbersome and not necessarly easier to maintain.
