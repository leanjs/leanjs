# @leanjs/react

This package contains React bindings for the shared `runtime`.

# Installation

`yarn add @leanjs/react`

# Usage

First, you must create custom bindings for your `runtime`. This will add type-safety to your React hooks and components based on your `runtime`.

```ts
// shared-runtime.ts

const defaultState = {
  locale: "en", // define your default state accordingly, this is just an example
};

// if you use TypeScript, configureRuntime is a generic function in case you it
export const { createRuntime } = configureRuntime(defaultState)({
  onError: () => {}, // add a proper logger here
});

export const { useGetter, useSetter, useRuntime, RuntimeProvider } =
  createRuntimeBindings(createRuntime);
```

Add a `RuntimeProvider` at the root of your component tree, e.g.

```tsx
// It's recommended to move your ./shared-runtime file to its own package
import { createRuntime, RuntimeProvider } from "./shared-runtime";

const runtime = createRuntime();

export function App({ children }) {
  return <RuntimeProvider runtime={runtime}>{children}</RuntimeProvider>;
}
```

Use any of the hooks in your components, e.g.

```tsx
// It's recommended to move your ./shared-runtime file to its own package
import { useGetter } from "./shared-runtime";

export function LocaleComponent({ children }) {
  const [locale, loading, error] = useGetter("locale");

  if (error) {
    return <p>Oops there was an error {error} </p>;
  } else if (loading) {
    return <p>Loading...</p>;
  } else {
    return <p>Current locale is {locale}</p>;
  }
}
```

## API

To use any of the following, you must first call `createRuntimeBindings`. Read the [usage](#usage) section above for more info.

### `useGetter`

Hook to get the current state of a given prop and if it's loading or it was loaded with an error.

Arguments:

1. State property, required.

Output is the following tuple:

1. Current state of the given property
2. If the state property is loading
3. If the state property error to load

### `useSetter`

Hook to update a value in a given state property.

Arguments:

1. State property, required.

Output is a function to set the value of the given state property.

### `useRuntime`

It returns the shared `runtime` from the context.

### `RuntimeProvider`

Component to set a `runtime` in the context. It has one required prop `runtime`.
