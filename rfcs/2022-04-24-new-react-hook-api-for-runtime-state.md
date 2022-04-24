- RFC PR: [https://github.com/leanjs/leanjs/pull/26](https://github.com/leanjs/leanjs/pull/26)

# Summary

This feature introduces some new React hooks to access `runtime` state.

# Basic example

New APIs

```ts
const loader = () => Promise.resole("some value");

const [globalStateX, setLocalStateX] = useWatchState(
  "state_property_X",
  loader
);
const [globalStateX, setGlobalStateX] = useSyncState(
  "state_property_X",
  loader
);
```

# Motivation

This feature reuses two common use cases when working with shared `runtime` state. Otherwise we must repeat the same cumbersome code over and over again using existing hooks.

1 . Observing global state to perform local updates. For instance, when a value in a form needs to be initialised with global state and updated only when the form is submitted.

```js
export function UserForm() {
  const shareUsername = useSetter("username");
  const sharedUsername = useGetter("username", fetchUsername);
  const [username = "", setUsername] = useState(sharedUsername);

  useEffect(() => {
    setUsername(sharedUsername);
  }, [sharedUsername]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        shareUsername(username);
      }}
    >
      <Input value={username} onChange={(e) => setUsername(e.target.value)} />
      <button type="submit">Save</button>
    </form>
  );
}
```

The code above could be replaced with the following code given the new `useWatchState` hook :

```js
export function UserForm() {
  const shareUsername = useSetter("username");
  const [username = "", setLocalUsername] = useWatchState(
    "username",
    fetchUsername
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        shareUsername(username);
      }}
    >
      <Input
        value={username}
        onChange={(e) => setLocalUsername(e.target.value)}
      />
      <button type="submit">Save</button>
    </form>
  );
}
```

2 . Observing global state to perform global updates. Example when a value changes localy and it needs to be sync with other micro-frontends immediately. For instance when a user selects a new locale all the micro-frontends must update with the new language.

```js
export function LocaleSelector() {
  const shareLocale = useSetter("locale");
  const locale = useGetter("locale", fetchLocale);

  return (
    <>
      <label for="locale-select">Choose language:</label>
      <select
        value={locale}
        onChange={(e) => shareLocale(e.target.value)}
        name="locale"
        id="locale-select"
      >
        <option value="">--Please choose an option--</option>
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>
    </>
  );
}
```

The code above could be replaced with the following code given the new `useSyncState` hook:

```js
export function LocaleSelector() {
  const [locale, shareLocale] = useSyncState("locale", fetchLocale);

  return (
    <>
      <label for="locale-select">Choose language:</label>
      <select
        value={locale}
        onChange={(e) => shareLocale(e.target.value)}
        name="locale"
        id="locale-select"
      >
        <option value="">--Please choose an option--</option>
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>
    </>
  );
}
```

# Drawbacks

Why should we _not_ do this? Please consider:

This feature could be implemented in user space using the existing hooks. It could be confusing to understand what the new hooks do.

# Alternatives

We only implement `useWatchState`. This would reduce confusion between which hook to use based on the use case. `useSyncState` seems less common use case.

# How we teach this

@leanjs/react docs will be updated to include the new hooks. The `coolest-todos` example will be updated to use `useWatchState`.
