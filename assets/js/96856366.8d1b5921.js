"use strict";(self.webpackChunk_leanjs_website=self.webpackChunk_leanjs_website||[]).push([[820],{5318:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>m});var a=n(7378);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,i=function(e,t){if(null==e)return{};var n,a,i={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var s=a.createContext({}),c=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=c(e.components);return a.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,i=e.mdxType,r=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),d=c(n),m=i,h=d["".concat(s,".").concat(m)]||d[m]||u[m]||r;return n?a.createElement(h,o(o({ref:t},p),{},{components:n})):a.createElement(h,o({ref:t},p))}));function m(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var r=n.length,o=new Array(r);o[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:i,o[1]=l;for(var c=2;c<r;c++)o[c]=n[c];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},6711:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>u,frontMatter:()=>r,metadata:()=>l,toc:()=>c});var a=n(5773),i=(n(7378),n(5318));const r={},o="@leanjs/core",l={unversionedId:"core/README",id:"core/README",title:"@leanjs/core",description:"The LeanJS runtime",source:"@site/../packages/core/README.md",sourceDirName:"core",slug:"/core/",permalink:"/packages/core/",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"defaultSidebar",previous:{title:"create-micro-frontends",permalink:"/packages/create-micro-frontends/"},next:{title:"@leanjs/cli",permalink:"/packages/cli/"}},s={},c=[{value:"The LeanJS runtime",id:"the-leanjs-runtime",level:2},{value:"Installation",id:"installation",level:2},{value:"Basic usage",id:"basic-usage",level:2},{value:"Runtime functions",id:"runtime-functions",level:2},{value:"<code>configureRuntime</code>",id:"configureruntime",level:3},{value:"onError - required function",id:"onerror---required-function",level:4},{value:"apiFactory - optional object",id:"apifactory---optional-object",level:4},{value:"<code>createRuntime</code>",id:"createruntime",level:3},{value:"<code>state.get</code>",id:"stateget",level:3},{value:"<code>state.set</code>",id:"stateset",level:3},{value:"<code>state.listen</code>",id:"statelisten",level:3},{value:"<code>state.load</code>",id:"stateload",level:3},{value:"<code>state.loaded</code>",id:"stateloaded",level:3},{value:"<code>state.loader</code>",id:"stateloader",level:3},{value:"<code>api</code>",id:"api",level:3},{value:"<code>cleanup</code>",id:"cleanup",level:3},{value:"Guiding principles",id:"guiding-principles",level:2}],p={toc:c};function u(e){let{components:t,...n}=e;return(0,i.kt)("wrapper",(0,a.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"leanjscore"},"@leanjs/core"),(0,i.kt)("h2",{id:"the-leanjs-runtime"},"The LeanJS runtime"),(0,i.kt)("p",null,"The LeanJS ",(0,i.kt)("inlineCode",{parentName:"p"},"runtime")," enables composable apps to share some state or to define APIs that share the same execution context, in a controlled manner. This keeps your composable apps performant and maintainable. By default nothing is shared. You can read more about ",(0,i.kt)("a",{parentName:"p",href:"https://alexlobera.com/sharing-state-in-micro-frontends-at-runtime/"},"the why of this package in this post"),"."),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"runtime")," is created in two steps:"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("inlineCode",{parentName:"strong"},"configureRuntime")),". In a distributed architecture there are many contexts where a ",(0,i.kt)("inlineCode",{parentName:"p"},"runtime")," could be created. For instance, each composable app will create a ",(0,i.kt)("inlineCode",{parentName:"p"},"runtime")," when they run in isolation. However, when composable apps are composed into a single app, only one ",(0,i.kt)("inlineCode",{parentName:"p"},"runtime")," will be created and shared across all of them. The ",(0,i.kt)("inlineCode",{parentName:"p"},"runtime")," can be created in more than one place but the configuration of it should be consistent across contexts.")),(0,i.kt)("li",{parentName:"ol"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("inlineCode",{parentName:"strong"},"createRuntime")),". Invoking ",(0,i.kt)("inlineCode",{parentName:"p"},"configureRuntime")," returns a function called ",(0,i.kt)("inlineCode",{parentName:"p"},"createRuntime")," which creates a ",(0,i.kt)("inlineCode",{parentName:"p"},"runtime")," when invoked. ",(0,i.kt)("inlineCode",{parentName:"p"},"createRuntime")," is not a singleton so you are responsible for not calling ",(0,i.kt)("inlineCode",{parentName:"p"},"createRuntime")," more than once in a given execution context. In other words, call ",(0,i.kt)("inlineCode",{parentName:"p"},"createRuntime")," only once in your host app."))),(0,i.kt)("p",null,"There are two types of things that you can share in this ",(0,i.kt)("inlineCode",{parentName:"p"},"runtime"),":"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"State. This is data that your app/s need to react to when it changes. By design, we don't facilitate creating complex data structures. The ",(0,i.kt)("inlineCode",{parentName:"li"},"runtime")," shared state is a flatten data structure, it doesn't support nested states unlike Redux for instance. However, you can add any object in a given state property. You can think of the ",(0,i.kt)("inlineCode",{parentName:"li"},"runtime")," state as a ",(0,i.kt)("strong",{parentName:"li"},"read-write")," hash table."),(0,i.kt)("li",{parentName:"ul"},"APIs. These are application interfaces that your program shares along with its execution context. It contains instances of classes, or closures, that we want to share, typically for performance reasons. E.g. a WebSocket client that holds WS connections, functions or classes that have internal non-reactive state like an HTTP client cache, etc. You can think of these API instances as a global ",(0,i.kt)("strong",{parentName:"li"},"read-only")," object.")),(0,i.kt)("h2",{id:"installation"},"Installation"),(0,i.kt)("p",null,"If your app is in a monorepo (recommended) execute the following command at the root of your repository:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"yarn add -W @leanjs/core\n")),(0,i.kt)("p",null,"then in the ",(0,i.kt)("inlineCode",{parentName:"p"},"package.json")," of your app add the following ",(0,i.kt)("inlineCode",{parentName:"p"},"peerDependencies"),":"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},'"peerDependencies": {\n  "@leanjs/core": "*"\n}\n')),(0,i.kt)("p",null,"If your app is not in a monorepo, then run the following command instead of the above:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"yarn add @leanjs/core\n")),(0,i.kt)("h2",{id:"basic-usage"},"Basic usage"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},'const defaultState = {\n  locale: "en",\n};\n\nconst { createRuntime } = configureRuntime(defaultState)({\n  onError: (error) => {}, // required, log the error properly\n});\n')),(0,i.kt)("p",null,"With api factory:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},'const defaultState = {\n  locale: "en",\n};\n\nconst { createRuntime } = configureRuntime(defaultState)({\n  onError: () => {}, // required, log the error properly\n  apiFactory: {\n    alert: () => new ToastNotifications(),\n  },\n});\n')),(0,i.kt)("h2",{id:"runtime-functions"},"Runtime functions"),(0,i.kt)("h3",{id:"configureruntime"},(0,i.kt)("inlineCode",{parentName:"h3"},"configureRuntime")),(0,i.kt)("p",null,"It's a function with two curried arguments. The argument of the first function receives the default state. The argument of the second function is aditional configuration of the runtime."),(0,i.kt)("p",null,"The default state must be an object. The keys of the objects are used at runtime to validate access to the shared state. For instance, given the following default state:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'const defaultState = {\n  locale: "en",\n};\n')),(0,i.kt)("p",null,"if a consumer of the ",(0,i.kt)("inlineCode",{parentName:"p"},"runtime")," tries to read or write a shared state property named ",(0,i.kt)("inlineCode",{parentName:"p"},"foo"),", the ",(0,i.kt)("inlineCode",{parentName:"p"},"runtime")," will throw an error. Only ",(0,i.kt)("inlineCode",{parentName:"p"},"locale")," is a valid shared state property. In other words, the default state is also used as a runtime validator. This behaviour can't be disabled."),(0,i.kt)("p",null,"If you use TypeScript, the ",(0,i.kt)("inlineCode",{parentName:"p"},"runtime")," will infer the types of the shared state from the default state. For instance, in the previous ",(0,i.kt)("inlineCode",{parentName:"p"},"defaultState")," TypeScript will only allow consumers of your shared state to read and write a state property called ",(0,i.kt)("inlineCode",{parentName:"p"},"locale")," and its only possible value will be a string."),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"configureRuntime")," is a generic function so you can pass a TypeScript type definition for your shared state. This is useful if your default state values don't match all the possible values of your shared state, e.g."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"interface SharedState {\n  locale?: string;\n}\n\nconst defaultState = {\n  locale: undefined,\n};\n\n// without passing a type to the generic `configureRuntime`,\n// locale could only be assigned to undefined\nconst { createRuntime } = configureRuntime<SharedState>(defaultState)({\n  onError: () => {}, // required, log the error properly\n});\n")),(0,i.kt)("h4",{id:"onerror---required-function"},"onError - required function"),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"runtime")," makes any asynchronous code internally look synchronous externally. This means that you won't be able to catch all the promises that might be generated. The ",(0,i.kt)("inlineCode",{parentName:"p"},"onError")," function will be invoked whenever there is an error in the ",(0,i.kt)("inlineCode",{parentName:"p"},"runtime"),", either sync or async."),(0,i.kt)("h4",{id:"apifactory---optional-object"},"apiFactory - optional object"),(0,i.kt)("p",null,"You can use it to define APIs specific to your runtime. Similarly to ",(0,i.kt)("inlineCode",{parentName:"p"},"defaultState"),", each property in the ",(0,i.kt)("inlineCode",{parentName:"p"},"apiFactory")," object is used to validate access to your shared APIs at runtime. In the following example, reading an ",(0,i.kt)("inlineCode",{parentName:"p"},"api")," prop different from ",(0,i.kt)("inlineCode",{parentName:"p"},"fetch")," will throw a runtime error."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"const { createRuntime } = configureRuntime(defaultState)({\n  onError,\n  apiFactory: {\n    // each key in apiFactory must be a function that returns something\n    fetch: () => new FetchWithCache(),\n  },\n});\n\nconst runtime = createRuntime();\n\n// \u2705 reading the following property doesn't throw an error\nruntime.api.fetch;\n\n// \u274c reading the following property will throw an error\nruntime.api.nameIsNotValid;\n")),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"api")," object generated by the ",(0,i.kt)("inlineCode",{parentName:"p"},"apiFactory")," is read-only. You can't re-assign values. The following example is not possible:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"// \u274c assigning a new value to an api property will throw an error\nruntime.api.fetch = new FetchWithCache();\n")),(0,i.kt)("p",null,"If you use TypeScript, the types of the ",(0,i.kt)("inlineCode",{parentName:"p"},"api")," object will be inferred by TypeScript from the ",(0,i.kt)("inlineCode",{parentName:"p"},"apiFactory")," as follows:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"const { createRuntime } = configureRuntime(defaultState)({\n  onError,\n  apiFactory: {\n    // runtime.api.wsClient1 type is WebSocketClient\n    wsClient1: () => new WebSocketClient(),\n    // runtime.api.wsClient2 type is WebSocketClient\n    wsClient2: async () => new WebSocketClient()),\n  },\n});\n")),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"api")," factory functions are executed lazily when the property is read. In the example above calling ",(0,i.kt)("inlineCode",{parentName:"p"},"createRuntime()")," will return the following runtime:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"const runtime = createRuntime();\n// runtime.api.wsClient1 has not been initialised and it's value is undefined\n// runtime.api.wsClient2 has not been initialised and it's value is undefined\nruntime.api.wsClient1; // this calls the api factory function for wsClient1\n// runtime.api.wsClient2 has not been initialised and it's value is undefined\n")),(0,i.kt)("p",null,"You can also lazy load ",(0,i.kt)("inlineCode",{parentName:"p"},"api")," code. In the following example, when a composable app reads ",(0,i.kt)("inlineCode",{parentName:"p"},"runtime.api.wsClient"),", the JavaScript required to execute ",(0,i.kt)("inlineCode",{parentName:"p"},"wsClient")," will be downloaded and executed."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},'const { createRuntime } = configureRuntime(defaultState)({\n  onError,\n  apiFactory: {\n    wsClient: () => import("./path-to-my-code"),\n  },\n});\n\nconst runtime = createRuntime();\n// runtime.api.wsClient is undefined\n// and path-to-my-code.js has not been downloaded\n\nconst wsClient = await runtime.api.wsClient;\n// path-to-my-code.js has been downloaded\n// and wsClient is not undefined\n')),(0,i.kt)("p",null,"Each factory function has access to a ",(0,i.kt)("inlineCode",{parentName:"p"},"runtime")," context."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},'const defaultState = { token: "" };\n\nconst { createRuntime } = configureRuntime(defaultState)({\n  onError,\n  apiFactory: {\n    wsClient: async ({\n      state: { get, set, load, loaded, loader },\n      onCleanup,\n      isBrowser,\n      request,\n    }) => {\n      // e.g. init and read token from the shared state\n      const token = await load("token", fetchToken);\n      const client = new WebSocketClient(token);\n      // call onCleanup hook, notice client.destroy() is not invoked yet\n      onCleanup(() => client.destroy());\n\n      return client;\n    },\n  },\n});\n\nconst runtime = createRuntime();\n// runtime.api.wsClient has not been initialised and it\'s value is undefined\n\n// creates an instance of WebSocketClient\nconst wsClient = await runtime.api.wsClient;\n\n// calls client.destroy() and sets runtime.api.wsClient as undefined again\nruntime.cleanup("wsClient");\n')),(0,i.kt)("h3",{id:"createruntime"},(0,i.kt)("inlineCode",{parentName:"h3"},"createRuntime")),(0,i.kt)("p",null,"It creates a ",(0,i.kt)("inlineCode",{parentName:"p"},"runtime"),". Example:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},'const defaultState = {\n  locale: "en",\n};\n\nconst { createRuntime } = configureRuntime(defaultState)({\n  onError,\n});\n\nconst runtime = createRuntime();\n')),(0,i.kt)("p",null,"A ",(0,i.kt)("inlineCode",{parentName:"p"},"runtime")," can extend another ",(0,i.kt)("inlineCode",{parentName:"p"},"runtime")," as long as the parent runtime is a subset of the child runtime. Example:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},'const defaultParentState = {\n  locale: "en",\n};\n\nconst { createRuntime: createParentRuntime } = configureRuntime(\n  defaultParentState\n)({\n  onError,\n});\n\nconst parentRuntime = createRuntime();\n\nconst defaultChildState = {\n  locale: "en",\n  username: "alex",\n};\n\nconst { createRuntime: createChildRuntime } = configureRuntime(\n  defaultChildState\n)({\n  onError,\n});\n\nconst childRuntime = createChildRuntime({ runtime: parentRuntime });\n')),(0,i.kt)("h3",{id:"stateget"},(0,i.kt)("inlineCode",{parentName:"h3"},"state.get")),(0,i.kt)("p",null,"It returns the current state of a given state property."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},'const locale = runtime.state.get("locale");\n')),(0,i.kt)("h3",{id:"stateset"},(0,i.kt)("inlineCode",{parentName:"h3"},"state.set")),(0,i.kt)("p",null,"It sets the state of a given state property."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},'const locale = runtime.state.set("locale", "pt");\n')),(0,i.kt)("h3",{id:"statelisten"},(0,i.kt)("inlineCode",{parentName:"h3"},"state.listen")),(0,i.kt)("p",null,"It's used to listen to state changes. It receives a state property and a callback. When the state property changes the callback is invoked. It returns an ",(0,i.kt)("inlineCode",{parentName:"p"},"unlisten")," function. Example:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},'const unlisten = runtime.state.listen("locale", (locale) =>\n  console.log(`locale changed, new value is ${locale}`)\n);\n')),(0,i.kt)("h3",{id:"stateload"},(0,i.kt)("inlineCode",{parentName:"h3"},"state.load")),(0,i.kt)("p",null,"It loads some value in a given state property. Once a state property is loaded with a value or being loaded, no other loader will be executed on the given state property. ",(0,i.kt)("inlineCode",{parentName:"p"},"load")," is async. Example:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},'const locale = await runtime.state.load("locale", fetchLocale);\n')),(0,i.kt)("p",null,"When calling ",(0,i.kt)("inlineCode",{parentName:"p"},"load")," many times for the same state property, the ",(0,i.kt)("inlineCode",{parentName:"p"},"runtime")," will only execute the first loader."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},'// \u2705 fetchLocale is executed\nruntime.state.load("locale", fetchLocale);\n// \u274c fetchLocale is skipped\nruntime.state.load("locale", fetchLocale);\n// \u274c fetchLocale is skipped\nruntime.state.load("locale", fetchLocale);\n')),(0,i.kt)("h3",{id:"stateloaded"},(0,i.kt)("inlineCode",{parentName:"h3"},"state.loaded")),(0,i.kt)("p",null,"It's an async method that will await while a given state property is being loaded. If the state property is not being loaded it resolves immediately. Example:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},'runtime.state.load("locale", () => Promise.resolve("es"));\n// in real-world apps the next line would not be after the `load` call\n// but in a different part of the codebase\nconst locale = await runtime.state.loaded("locale"); // locale equals "es"\n')),(0,i.kt)("p",null,"The previous code has the same effect as the following code. The reason for having ",(0,i.kt)("inlineCode",{parentName:"p"},"loaded")," is that in a distributed UI, the code that needs to ",(0,i.kt)("inlineCode",{parentName:"p"},"await")," might not be the same as the code that ",(0,i.kt)("inlineCode",{parentName:"p"},"load"),"s the value. Example:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},'const locale = await runtime.state.load("locale", () => Promise.resolve("es"));\n')),(0,i.kt)("p",null,"If ",(0,i.kt)("inlineCode",{parentName:"p"},"loaded")," is called with no state property then it awaits for all the loaders that are in progress to resolve."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},'runtime.state.load("locale", fetchLocale);\nruntime.state.load("token", fetchToken);\n\nawait runtime.state.loaded();\n// both locale and token have been loaded\n')),(0,i.kt)("h3",{id:"stateloader"},(0,i.kt)("inlineCode",{parentName:"h3"},"state.loader")),(0,i.kt)("p",null,"It returns the state of a loader: ",(0,i.kt)("inlineCode",{parentName:"p"},"loading: boolean")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"error?: string"),". Example:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},'runtime.state.load("locale", fetchLocale);\n// runtime.state.loader.locale.loading is true\n\nawait runtime.state.loaded("locale");\n// runtime.state.loader.locale.loading is false\n\n// Heads up, make sure to await runtime.state.loaded("state_property") before checking if there is an error\nconst didError = runtime.state.loader.locale.error;\n// didError has an error message if the load method failed.\n')),(0,i.kt)("h3",{id:"api"},(0,i.kt)("inlineCode",{parentName:"h3"},"api")),(0,i.kt)("p",null,"It holds the shared execution context and the interfaces to interact with it. Example:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"const wsClient = runtime.api.wsClient;\n\n// api is read only, the following line throws an error\n// \u274c runtime.api.wsClient = new WebSocketClient()\n")),(0,i.kt)("h3",{id:"cleanup"},(0,i.kt)("inlineCode",{parentName:"h3"},"cleanup")),(0,i.kt)("p",null,"It calls the clean-up function/s defined in the ",(0,i.kt)("inlineCode",{parentName:"p"},"apiFactory")," of your ",(0,i.kt)("inlineCode",{parentName:"p"},"configureRuntime"),". Example:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},'// it calls all the clean-up functions defined in the apiFactory\nruntime.api.cleanup();\n\n// it calls the clean-up function of "someApi" defined in the apiFactory\nruntime.api.cleanup("someApi");\n')),(0,i.kt)("p",null,"Accessing an ",(0,i.kt)("inlineCode",{parentName:"p"},"api")," after calling its clean-up function will create a new instance of that ",(0,i.kt)("inlineCode",{parentName:"p"},"api"),". Example:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},'const { createRuntime } = configureRuntime(defaultState)({\n  onError: () => {}, // required, log the error properly\n  apiFactory: {\n    wsClient: ({ onCleanup }) => {\n      const wsClient = new WebSocketClient();\n      onCleanup(() => wsClient.destroy());\n\n      return wsClient;\n    },\n  },\n});\n\nconst runtime = createRuntime();\n// runtime.api.wsClient is undefined\n\n// the following line creates an instance of WebSocketClient\nruntime.api.wsClient;\n\n// WebSocketClient is destroyed\nruntime.api.cleanup("wsClient");\n// runtime.api.wsClient is undefined\n\n// the following line creates a new instance of WebSocketClient\nruntime.api.wsClient;\n')),(0,i.kt)("h2",{id:"guiding-principles"},"Guiding principles"),(0,i.kt)("p",null,"We have the following recommendations when you design your shared runtime:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Both sharing state or execution context are a form of coupling. The more things you share between composable apps the higher coupling. Use this ",(0,i.kt)("inlineCode",{parentName:"li"},"runtime")," sparingly."),(0,i.kt)("li",{parentName:"ul"},"Use TypeScript. This way developers in different teams easily know what is shared and what isn't."),(0,i.kt)("li",{parentName:"ul"},"Centralise the configuration of the ",(0,i.kt)("inlineCode",{parentName:"li"},"runtime"),". Anyone can use the ",(0,i.kt)("inlineCode",{parentName:"li"},"runtime")," but only a few people should be able to change what is shared in it. Define your ",(0,i.kt)("inlineCode",{parentName:"li"},"configureRuntime")," in a place with restricted access, for instance via CODEOWNERS, then export ",(0,i.kt)("inlineCode",{parentName:"li"},"createRuntime")," for anyone to use it.")))}u.isMDXComponent=!0}}]);