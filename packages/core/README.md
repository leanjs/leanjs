# @leanjs/core

LeanJS core utilities.

# Runtime

This `runtime` enables micro-frontends to share state or execution context in a controlled manner, keeping your micro-frontends performant and maintainable. By default nothing is shared. You can read more about [the why of this package in this post](https://alexlobera.com/sharing-state-in-micro-frontends-at-runtime/).

The `runtime` is created in two steps:

1. `configureRuntime`. In a distributed architecture there are many places where a runtime could be created. For instance, each micro-app will create a `runtime` if they run in isolation. However, when micro-apps are composed into a single app, only one `runtime` should be created and shared across all of them. The `runtime` can be created in more than one place but the configuration of it should be the same for all of them. Don't invoke `configureRuntime` more than once in a project. By project I mean in your whole micro-frontends architecture.

2. `createRuntime`. Invoking `configureRuntime` returns a function called `createRuntime` which creates a `runtime` when invoked. You can use `createRuntime` in each distributed micro-app. Remember, there should be only one shared `runtime` in the runtime program. `createRuntime` is not a singleton so you are responsible for making sure no more than one `runtime` is created.

There are two things that you can share in a `runtime`:

- State. By design, we don't facilitate creating complex data structures. The `runtime` shared state is a flatten data structure, it doesn't support nested states unlike Redux for instance. However, you can add any object in a given state property. You can think of the `runtime` state as a **read-write** hash table.
- Execution context. It contains instances of code that we want to share. E.g. a WebSocket client that holds WS connections. You can think of it as a **read-only** hash table.

## Installation

`yarn add @leanjs/runtime`

## Usage

### Guiding principles

When designing your shared runtime follow these recommendations:

- Less is more. The more things shared between micro-frontends the higher coupling. Use this `runtime` sparingly.
- Make the `runtime` type-safety. Only types defined in the configuration of the `runtime` are allowed. This way developers in different teams know what can be shared and what can't be shared. Use TypeScript.
- Centralise the configuration of the `runtime`. Anyone can use the `runtime` but only a few people should be able to change what can be shared. Execute `configureRuntime` in its own repo with restricted access, or use CODEOWNERS if in a monorepo, then export it for anyone to use.

### Basic

```ts
const defaultState = {
  locale: "en",
};

const { createRuntime } = configureRuntime(defaultState)({
  onError: (error) => {}, // required, log the error properly, e.g. Sentry, Datadog, etc
});
```

#### With execution context

```ts
const defaultState = {
  locale: "en",
};

const { createRuntime } = configureRuntime(defaultState)({
  onError: () => {}, // required, log the error properly, e.g. Sentry, Datadog, etc
  context: {
    eventEmitter: new MyEventEmitter(),
  },
});
```

### API

#### `configureRuntime`

It's a function with two curried arguments. The argument of the first function receives the default state. The argument of the second function is the configuration of the runtime.

The default state must be an object. The keys of the objects are used at runtime to validate access to the shared state. For instance, given the following default state:

```js
const defaultState = {
  locale: "en",
};
```

if a consumer of the `runtime` tries to read or write a shared state property named `foo`, the `runtime` will throw an error. Only `locale` is a valid shared state property. In other words, the default state is also used as a runtime validator. This behaviour can't be disabled.

If you use TypeScript, the `runtime` will infer the types of the shared state from the default state. For instance, in the previous `defaultState` TypeScript will only allow consumers of your shared state to read and write a state property called `locale` and its only possible value will be a string.

`configureRuntime` is a generic function so you can pass a TS type definition for your shared state. This is useful if your default state values don't match all the possible values of your shared state, e.g.

```ts
interface SharedState {
  locale?: string;
}

const defaultState = {
  locale: undefined,
};

// without passing a concrete type to the generic `configureRuntime`,
// locale could only be assigned to undefined because of the defaultState value
const { createRuntime } = configureRuntime<SharedState>(defaultState)({
  onError: () => {}, // required, log the error properly, e.g. Sentry, Datadog, etc
});
```

##### onError - required function

The `runtime` makes any asynchronous code internally look synchronous externally. This means that you won't be able to catch all the promises that might be generated. The `onError` function will be invoked whenever there is an errors in the runtime, either sync or async.

##### context - optional object

Similarly to `defaultState` each property in this context object argument is used to validate access at runtime to the shared context. Context is read-only. If you use TypeScript, since context can't change, the types of the context values will be inferred by TypeScript as follows:

```ts
configureRuntime(defaultState)({
  onError,
  context: {
    // wsClient1 type is WsClient
    wsClient1: new WsClient(),
    // wsClient2 type is WsClient
    wsClient2: () => new WsClient(),
    // wsClient3 type is WsClient
    wsClient3: async () => new WsClient()),
  },
});
```

#### `createRuntime`

It creates a `runtime`. Example:

```ts
const defaultState = {
  locale: "en",
};

const { createRuntime } = configureRuntime(defaultState)({
  onError,
});

const runtime = createRuntime();
```

#### `booted`

Async method that resolves true when all the async context resolves. If any of the async context properties is rejected it resolves false.

```ts
await runtime.booted();
```

#### `state`

It holds the current shared state.

```ts
// you can read state
const locale = runtime.state.locale;

// you can write state
runtime.state.locale = "es";
// subscribers to state.locale are notified
```

#### `subscribe`

It's used to subscribe to state changes. It receives a state property and a callback. When the state property changes the callback is invoked. It returns an `unsubscribe` function. Example:

```ts
const unsubscribe = runtime.subscribe("locale", (locale) =>
  console.log(`locale changed ${locale}`)
);
```

#### `context`

It holds the current shared context. Example:

```ts
const wsClient = runtime.context.wsClient;

// context is read only, the following line throws an error
// ❌ runtime.context.wsClient = new WsClient()
```

It's not recommended to access the context directly whenever possible. If you want to update some shared state based on an event from the shared context then use the `on` method underneath.

#### `on`

This method is used to update shared state based on events from the context.

It has two arguments, the context property that you want to use, and a callback function that will receive the context instance and the current state. The callback must return a clean-up function. `on` returns an `off` function which calls the callback clean-up function upon invocation. Example:

```ts
const off = runtime.on("wsClient", (wsClient, state) => {
  function updateLocale(value) {
    state.locale = value;
  }
  wsClient?.on("locale-changed", updateLocale);

  return () => {
    wsClient.off("locale-changed", updateLocale);
  };
});

off(); // wsClient.off("locale-changed", updateLocale); is called
```

#### `load`

It loads some value in a given state property. Once a state property is loaded with a value, no other loader will have effect on the given state property. `load` is async. Example:

```ts
const locale = await runtime.load("locale", fetchLocale);
// locale equals runtime.state.locale
```

When calling `load` many times for the same state property, the `runtime` will only execute the first loader.

```ts
// ✅ fetchLocale is executed
runtime.load("locale", fetchLocale);
// ❌ fetchLocale is skipped
runtime.load("locale", fetchLocale);
// ❌ fetchLocale is skipped
runtime.load("locale", fetchLocale);
```

#### `loaded`

It's an async method that will await while a given state property is being loaded. If the state property is not being loaded it resolves immediately. Example:

```ts
runtime.load("locale", () => Promise.resolve("es"));
// in real-world project the next line would not be after the previous `load` call but in a different part of the codebase
const locale = await runtime.loaded("locale"); // locale equals "es"
```

The previous code has the same effect as the following code. The reason for having `loaded` is that in a distributed UI, the code that needs to `await` might not be the same as the code that `load`s the value, unlike the following example:

```ts
const locale = await runtime.load("locale", () => Promise.resolve("es"));
```

If `loaded` is called with no state property then it awaits for all the loaders to resolve.

```ts
runtime.load("locale", fetchLocale);
runtime.load("token", fetchToken);

await runtime.loaded();
// both locale and token have been loaded
```

#### `loader`

It returns the state of a loader: `loading: boolean` and `error?: string`. Example:

```ts
runtime.load("locale", fetchLocale);
// runtime.loader.locale.loading is true

await runtime.loaded("locale");
// runtime.loader.locale.loading is false

// Heads up, make sure to await runtime.loaded("state_property") before checking if there is an error
const didError = runtime.loader.locale.error;
// didError has an error message if the load method failed.
```
