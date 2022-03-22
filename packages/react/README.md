# @leanjs/react

This package contains React bindings for the shared `runtime`.

# Installation

`yarn add @leanjs/react`

# Usage

First, you must create bindings for your runtime. This will add type-safety based on your `runtime`

```ts
export const { createRuntime } = configureRuntime(defaultState)({
  onError: () => {}, // add a proper logger
});

export const { useGetter, useSetter, useRuntime } =
  createRuntimeBindings(createRuntime);
```

```tsx
function MyComponent() {
  return;
}
```

## API

### `useGetter`

Custom hook to get the current state of a given prop and if it's loading or it was loaded with an error.

Arguments:

1. State property, required.

Output is the following tuple:

1. Current state of the given property
2. If the state property is loading
3. If the state property error to load
