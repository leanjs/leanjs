# @leanjs/react

This package contains React bindings for the shared `runtime`.

# Installation

`yarn add @leanjs/react`

# Usage

First, you must create custom bindings for your LeanJS `runtime`. This will add type-safety to your React hooks and components based on your LeanJS `runtime`.

```ts
// shared-runtime.ts

const defaultState = {
  locale: "en", // define your default state accordingly, this is just an example
};

// configureRuntime is a generic function (if you use TypeScript),
// handy if the state types that you want don't match the inferred types from defaultState
export const { createRuntime } = configureRuntime(defaultState)({
  onError: () => {}, // add a proper logger here
});

export const {
  useGetter,
  useSetter,
  useLoading,
  useError,
  useRuntime,
  RuntimeProvider,
} = createRuntimeBindings(createRuntime);
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

Use any of our hooks in your components, e.g.

```tsx
// It's recommended to move your ./shared-runtime file to its own package
import { useGetter } from "./shared-runtime";

export function LocaleComponent() {
  const locale = useGetter("locale");

  return <p>Current locale is {locale}</p>;
}
```

## API

To use any of the following, you must first call `createRuntimeBindings`. Read the [usage](#usage) section above for more info.

### `useGetter`

Hook to get the current state of a given state property.

Arguments:

1. State property, required.
2. Loader function, optional.

The output is the current state of the given property.

Example:

```tsx
// where does shared-runtime come from? Read the "Usage" section at the top
import { useGetter } from "./shared-runtime";

export function LocaleComponent() {
  const locale = useGetter("locale", () =>
    fetch("/api/settings")
      .then((response) => response.json())
      .then((data) => data.locale)
  );

  return <p>Locale is {locale}</p>;
}
```

### `useLoading`

Hook to get the loading state of a given state property.

Arguments:

1. State property, required.

The output is a boolean indicating if the given state property is loading.

Example:

```tsx
// where does shared-runtime come from? Read the "Usage" section at the top
import { useLoading } from "./shared-runtime";

export function LocaleSpinner() {
  const loading = useLoading("locale");

  if (loading) {
    return <p>Loading...</p>;
  } else {
    return null;
  }
}
```

### `useError`

Hook to get the error state if a given state property failed to load.

Arguments:

1. State property, required.

The output is undefined or a string with the error message.

Example:

```tsx
// where does shared-runtime come from? Read the "Usage" section at the top
import { useError } from "./shared-runtime";

export function LocaleErrorMessage() {
  const error = useError("locale");

  if (error) {
    return <p>Oops, locale error: {error} </p>;
  } else {
    return null;
  }
}
```

### `useSetter`

Hook to update the value of a given state property.

Arguments:

1. State property, required.

The output is a function to update the value of the given state property.

Example:

```jsx
// where does shared-runtime come from? Read the "Usage" section at the top
import { useSetter } from "./shared-runtime";

export function ThemeSelector() {
  const shareTheme = useSetter("theme");

  return (
    <>
      <label for="theme-select">Choose a theme:</label>
      <select
        onChange={(e) => shareTheme(e.target.value)}
        name="theme"
        id="theme-select"
      >
        <option value="">--Please choose an option--</option>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
    </>
  );
}
```

### `RuntimeProvider`

Component to set a `runtime` in the context. It has one required property `runtime`.

Example:

```tsx
// where does shared-runtime come from? Read the "Usage" section at the top
import { createRuntime, RuntimeProvider } from "./shared-runtime";

const runtime = createRuntime();

export function App({ children }) {
  return <RuntimeProvider runtime={runtime}>{children}</RuntimeProvider>;
}
```

### `useRuntime`

It returns the shared `runtime` from the context.

Example:

```jsx
// where does shared-runtime come from? Read the "Usage" section at the top
import { useRuntime } from "./shared-runtime";

// RuntimeProvider must be an ancestor of the following component
export function Component() {
  const runtime = useRuntime(); // do something with runtime

  return <h1>My component</h1>;
}
```
