# @leanjs/core

## The LeanJS runtime

The LeanJS `runtime` enables composable apps to share some state or to define APIs that share the same execution context, in a controlled manner. This keeps your composable apps performant and maintainable. By default nothing is shared. You can read more about [the why of this package in this post](https://alexlobera.com/sharing-state-in-micro-frontends-at-runtime/).

The `runtime` is created in two steps:

1. **`configureRuntime`**. In a distributed architecture there are many contexts where a `runtime` could be created. For instance, each composable app will create a `runtime` when they run in isolation. However, when composable apps are composed into a single app, only one `runtime` will be created and shared across all of them. The `runtime` can be created in more than one place but the configuration of it should be consistent across contexts.

2. **`createRuntime`**. Invoking `configureRuntime` returns a function called `createRuntime` which creates a `runtime` when invoked. `createRuntime` is not a singleton so you are responsible for not calling `createRuntime` more than once in a given execution context. In other words, call `createRuntime` only once in your host app.

There are two types of things that you can share in this `runtime`:

- State. This is data that your app/s need to react to when it changes. By design, we don't facilitate creating complex data structures. The `runtime` shared state is a flatten data structure, it doesn't support nested states unlike Redux for instance. However, you can add any object in a given state property. You can think of the `runtime` state as a **read-write** hash table.
- APIs. These are application interfaces that your program shares along with its execution context. It contains instances of classes, or closures, that we want to share, typically for performance reasons. E.g. a WebSocket client that holds WS connections, functions or classes that have internal non-reactive state like an HTTP client cache, etc. You can think of these API instances as a global **read-only** object.

## Installation

If your app is in a monorepo (recommended) execute the following command at the root of your repository:

```sh
yarn add -W @leanjs/core
```

then in the `package.json` of your app add the following `peerDependencies`:

```
"peerDependencies": {
  "@leanjs/core": "*"
}
```

If your app is not in a monorepo, then run the following command instead of the above:

```sh
yarn add @leanjs/core
```

## Basic usage

```ts
const defaultState = {
  locale: "en",
};

const { createRuntime } = configureRuntime(defaultState)({
  onError: (error) => {}, // required, log the error properly
});
```

With api factory:

```ts
const defaultState = {
  locale: "en",
};

const { createRuntime } = configureRuntime(defaultState)({
  onError: () => {}, // required, log the error properly
  apiFactory: {
    alert: () => new ToastNotifications(),
  },
});
```

## Runtime functions

### `configureRuntime`

It's a function with two curried arguments. The argument of the first function receives the default state. The argument of the second function is aditional configuration of the runtime.

The default state must be an object. The keys of the objects are used at runtime to validate access to the shared state. For instance, given the following default state:

```js
const defaultState = {
  locale: "en",
};
```

if a consumer of the `runtime` tries to read or write a shared state property named `foo`, the `runtime` will throw an error. Only `locale` is a valid shared state property. In other words, the default state is also used as a runtime validator. This behaviour can't be disabled.

If you use TypeScript, the `runtime` will infer the types of the shared state from the default state. For instance, in the previous `defaultState` TypeScript will only allow consumers of your shared state to read and write a state property called `locale` and its only possible value will be a string.

`configureRuntime` is a generic function so you can pass a TypeScript type definition for your shared state. This is useful if your default state values don't match all the possible values of your shared state, e.g.

```ts
interface SharedState {
  locale?: string;
}

const defaultState = {
  locale: undefined,
};

// without passing a type to the generic `configureRuntime`,
// locale could only be assigned to undefined
const { createRuntime } = configureRuntime<SharedState>(defaultState)({
  onError: () => {}, // required, log the error properly
});
```

#### onError - required function

The `runtime` makes any asynchronous code internally look synchronous externally. This means that you won't be able to catch all the promises that might be generated. The `onError` function will be invoked whenever there is an error in the `runtime`, either sync or async.

#### apiFactory - optional object

You can use it to define APIs specific to your runtime. Similarly to `defaultState`, each property in the `apiFactory` object is used to validate access to your shared APIs at runtime. In the following example, reading an `api` prop different from `fetch` will throw a runtime error.

```ts
const { createRuntime } = configureRuntime(defaultState)({
  onError,
  apiFactory: {
    // each key in apiFactory must be a function that returns something
    fetch: () => new FetchWithCache(),
  },
});

const runtime = createRuntime({ context: { appName: "AppExample" } });

// ✅ reading the following property doesn't throw an error
runtime.api.fetch;

// ❌ reading the following property will throw an error
runtime.api.nameIsNotValid;
```

The `api` object generated by the `apiFactory` is read-only. You can't re-assign values. The following example is not possible:

```ts
// ❌ assigning a new value to an api property will throw an error
runtime.api.fetch = new FetchWithCache();
```

If you use TypeScript, the types of the `api` object will be inferred by TypeScript from the `apiFactory` as follows:

```ts
const { createRuntime } = configureRuntime(defaultState)({
  onError,
  apiFactory: {
    // runtime.api.wsClient1 type is WebSocketClient
    wsClient1: () => new WebSocketClient(),
    // runtime.api.wsClient2 type is WebSocketClient
    wsClient2: async () => new WebSocketClient()),
  },
});
```

`api` factory functions are executed lazily when the property is read. In the example above calling `createRuntime()` will return the following runtime:

```ts
const runtime = createRuntime();
// runtime.api.wsClient1 has not been initialised and it's value is undefined
// runtime.api.wsClient2 has not been initialised and it's value is undefined
runtime.api.wsClient1; // this calls the api factory function for wsClient1
// runtime.api.wsClient2 has not been initialised and it's value is undefined
```

You can also lazy load `api` code. In the following example, when a composable app reads `runtime.api.wsClient`, the JavaScript required to execute `wsClient` will be downloaded and executed.

```ts
const { createRuntime } = configureRuntime(defaultState)({
  onError,
  apiFactory: {
    wsClient: () => import("./path-to-my-code"),
  },
});

const runtime = createRuntime();
// runtime.api.wsClient is undefined
// and path-to-my-code.js has not been downloaded

const wsClient = await runtime.api.wsClient;
// path-to-my-code.js has been downloaded
// and wsClient is not undefined
```

Each factory function has access to a `runtime` context.

```ts
const defaultState = { token: "" };

const { createRuntime } = configureRuntime(defaultState)({
  onError,
  apiFactory: {
    wsClient: async ({
      state: { get, set, load, loaded, loader },
      onCleanup,
      isBrowser,
      request,
    }) => {
      // e.g. init and read token from the shared state
      const token = await load("token", fetchToken);
      const client = new WebSocketClient(token);
      // call onCleanup hook, notice client.destroy() is not invoked yet
      onCleanup(() => client.destroy());

      return client;
    },
  },
});

const runtime = createRuntime();
// runtime.api.wsClient has not been initialised and it's value is undefined

// creates an instance of WebSocketClient
const wsClient = await runtime.api.wsClient;

// calls client.destroy() and sets runtime.api.wsClient as undefined again
runtime.cleanup("wsClient");
```

### `createRuntime`

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

A `runtime` can extend another `runtime` as long as the parent runtime is a subset of the child runtime. Example:

```ts
const defaultParentState = {
  locale: "en",
};

const { createRuntime: createParentRuntime } = configureRuntime(
  defaultParentState
)({
  onError,
});

const parentRuntime = createRuntime();

const defaultChildState = {
  locale: "en",
  username: "alex",
};

const { createRuntime: createChildRuntime } = configureRuntime(
  defaultChildState
)({
  onError,
});

const childRuntime = createChildRuntime({ runtime: parentRuntime });
```

### `state.get`

It returns the current state of a given state property.

```ts
const locale = runtime.state.get("locale");
```

### `state.set`

It sets the state of a given state property.

```ts
const locale = runtime.state.set("locale", "pt");
```

### `state.listen`

It's used to listen to state changes. It receives a state property and a callback. When the state property changes the callback is invoked. It returns an `unlisten` function. Example:

```ts
const unlisten = runtime.state.listen("locale", (locale) =>
  console.log(`locale changed, new value is ${locale}`)
);
```

### `state.load`

It loads some value in a given state property. Once a state property is loaded with a value or being loaded, no other loader will be executed on the given state property. `load` is async. Example:

```ts
const locale = await runtime.state.load("locale", fetchLocale);
```

When calling `load` many times for the same state property, the `runtime` will only execute the first loader.

```ts
// ✅ fetchLocale is executed
runtime.state.load("locale", fetchLocale);
// ❌ fetchLocale is skipped
runtime.state.load("locale", fetchLocale);
// ❌ fetchLocale is skipped
runtime.state.load("locale", fetchLocale);
```

### `state.loaded`

It's an async method that will await while a given state property is being loaded. If the state property is not being loaded it resolves immediately. Example:

```ts
runtime.state.load("locale", () => Promise.resolve("es"));
// in real-world apps the next line would not be after the `load` call
// but in a different part of the codebase
const locale = await runtime.state.loaded("locale"); // locale equals "es"
```

The previous code has the same effect as the following code. The reason for having `loaded` is that in a distributed UI, the code that needs to `await` might not be the same as the code that `load`s the value. Example:

```ts
const locale = await runtime.state.load("locale", () => Promise.resolve("es"));
```

If `loaded` is called with no state property then it awaits for all the loaders that are in progress to resolve.

```ts
runtime.state.load("locale", fetchLocale);
runtime.state.load("token", fetchToken);

await runtime.state.loaded();
// both locale and token have been loaded
```

### `state.loader`

It returns the state of a loader: `loading: boolean` and `error?: string`. Example:

```ts
runtime.state.load("locale", fetchLocale);
// runtime.state.loader.locale.loading is true

await runtime.state.loaded("locale");
// runtime.state.loader.locale.loading is false

// Heads up, make sure to await runtime.state.loaded("state_property") before checking if there is an error
const didError = runtime.state.loader.locale.error;
// didError has an error message if the load method failed.
```

### `api`

It holds the shared execution context and the interfaces to interact with it. Example:

```ts
const wsClient = runtime.api.wsClient;

// api is read only, the following line throws an error
// ❌ runtime.api.wsClient = new WebSocketClient()
```

### `cleanup`

It calls the clean-up function/s defined in the `apiFactory` of your `configureRuntime`. Example:

```ts
// it calls all the clean-up functions defined in the apiFactory
runtime.api.cleanup();

// it calls the clean-up function of "someApi" defined in the apiFactory
runtime.api.cleanup("someApi");
```

Accessing an `api` after calling its clean-up function will create a new instance of that `api`. Example:

```ts
const { createRuntime } = configureRuntime(defaultState)({
  onError: () => {}, // required, log the error properly
  apiFactory: {
    wsClient: ({ onCleanup }) => {
      const wsClient = new WebSocketClient();
      onCleanup(() => wsClient.destroy());

      return wsClient;
    },
  },
});

const runtime = createRuntime();
// runtime.api.wsClient is undefined

// the following line creates an instance of WebSocketClient
runtime.api.wsClient;

// WebSocketClient is destroyed
runtime.api.cleanup("wsClient");
// runtime.api.wsClient is undefined

// the following line creates a new instance of WebSocketClient
runtime.api.wsClient;
```

## Guiding principles

We have the following recommendations when you design your shared runtime:

- Both sharing state or execution context are a form of coupling. The more things you share between composable apps the higher coupling. Use this `runtime` sparingly.
- Use TypeScript. This way developers in different teams easily know what is shared and what isn't.
- Centralise the configuration of the `runtime`. Anyone can use the `runtime` but only a few people should be able to change what is shared in it. Define your `configureRuntime` in a place with restricted access, for instance via CODEOWNERS, then export `createRuntime` for anyone to use it.
