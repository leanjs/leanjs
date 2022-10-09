"use strict";(self.webpackChunk_leanjs_website=self.webpackChunk_leanjs_website||[]).push([[259],{5318:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>d});var a=n(7378);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=a.createContext({}),s=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):p(p({},t),e)),n},c=function(e){var t=s(e.components);return a.createElement(l.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,r=e.originalType,l=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),u=s(n),d=o,h=u["".concat(l,".").concat(d)]||u[d]||m[d]||r;return n?a.createElement(h,p(p({ref:t},c),{},{components:n})):a.createElement(h,p({ref:t},c))}));function d(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=n.length,p=new Array(r);p[0]=u;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:o,p[1]=i;for(var s=2;s<r;s++)p[s]=n[s];return a.createElement.apply(null,p)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},4897:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>p,default:()=>m,frontMatter:()=>r,metadata:()=>i,toc:()=>s});var a=n(5773),o=(n(7378),n(5318));const r={},p="@leanjs/react",i={unversionedId:"react/README",id:"react/README",title:"@leanjs/react",description:"Installation",source:"@site/../packages/react/README.md",sourceDirName:"react",slug:"/react/",permalink:"/packages/react/",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"defaultSidebar",previous:{title:"@leanjs/cli",permalink:"/packages/cli/"},next:{title:"@leanjs/react-router",permalink:"/packages/react-router/"}},l={},s=[{value:"Installation",id:"installation",level:2},{value:"Basic usage",id:"basic-usage",level:2},{value:"<code>createRuntimeBindings</code>",id:"createruntimebindings",level:3},{value:"Composable app",id:"composable-app",level:2},{value:"<code>createApp</code>",id:"createapp",level:3},{value:"Components",id:"components",level:2},{value:"<code>HostProvider</code>",id:"hostprovider",level:3},{value:"<code>runtime</code> prop - required",id:"runtime-prop---required",level:4},{value:"<code>errorComponent</code> prop - optional",id:"errorcomponent-prop---optional",level:4},{value:"<code>fallback</code> prop - optional",id:"fallback-prop---optional",level:4},{value:"<code>origin</code> prop - optional",id:"origin-prop---optional",level:4},{value:"<code>Host</code>",id:"host",level:3},{value:"<code>app</code> - required prop",id:"app---required-prop",level:4},{value:"Hooks",id:"hooks",level:2},{value:"<code>useGetter</code>",id:"usegetter",level:3},{value:"<code>useSetter</code>",id:"usesetter",level:3},{value:"<code>useLoading</code>",id:"useloading",level:3},{value:"<code>useError</code>",id:"useerror",level:3},{value:"<code>useRuntime</code>",id:"useruntime",level:3}],c={toc:s};function m(e){let{components:t,...n}=e;return(0,o.kt)("wrapper",(0,a.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"leanjsreact"},"@leanjs/react"),(0,o.kt)("h2",{id:"installation"},"Installation"),(0,o.kt)("p",null,"If your React app is in a monorepo (recommended) execute the following command at the root of your repository:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sh"},"yarn add -W @leanjs/react @leanjs/core\n")),(0,o.kt)("p",null,"then in the ",(0,o.kt)("inlineCode",{parentName:"p"},"package.json")," of your React app add the following ",(0,o.kt)("inlineCode",{parentName:"p"},"peerDependencies"),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},'"peerDependencies": {\n  "@leanjs/core": "*",\n  "@leanjs/react": "*"\n}\n')),(0,o.kt)("p",null,"If your React app is not in a monorepo, then run the following command instead of the above:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sh"},"yarn add @leanjs/react @leanjs/core\n")),(0,o.kt)("h2",{id:"basic-usage"},"Basic usage"),(0,o.kt)("h3",{id:"createruntimebindings"},(0,o.kt)("inlineCode",{parentName:"h3"},"createRuntimeBindings")),(0,o.kt)("p",null,"First, you have to create your React bindings (",(0,o.kt)("strong",{parentName:"p"},"HostProvider"),", ",(0,o.kt)("strong",{parentName:"p"},"useGetter"),", etc) for your ",(0,o.kt)("inlineCode",{parentName:"p"},"runtime"),"."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},'// shared-runtime.ts\n\n// You need to configure your runtime\nconst defaultState = { locale: "en" }; // this is just an example\nexport const { createRuntime } = configureRuntime(defaultState)({\n  onError: () => {},\n});\n\n// Then create the React bindings for your runtime\nexport const {\n  HostProvider,\n  useGetter,\n  useSetter,\n  useLoading,\n  useError,\n  useRuntime,\n} = createRuntimeBindings(createRuntime);\n')),(0,o.kt)("admonition",{type:"info"},(0,o.kt)("p",{parentName:"admonition"},"Read ",(0,o.kt)("a",{parentName:"p",href:"/packages/core#basic-usage"},"@leanjs/core")," if you have not already created your own ",(0,o.kt)("inlineCode",{parentName:"p"},"createRuntime")," function")),(0,o.kt)("p",null,"Add your ",(0,o.kt)("inlineCode",{parentName:"p"},"HostProvider")," at the root of your React component tree, e.g."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},'// It\'s recommended to move your ./shared-runtime file to its own package\nimport { createRuntime, HostProvider } from "./shared-runtime";\n\nconst runtime = createRuntime();\n\nexport function App({ children }) {\n  return <HostProvider runtime={runtime}>{children}</HostProvider>;\n}\n')),(0,o.kt)("p",null,"Use any of your hooks in your components, e.g."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},'// It\'s recommended to move your ./shared-runtime file to its own package\nimport { useGetter } from "./shared-runtime";\n\nexport function LocaleComponent() {\n  const locale = useGetter("locale");\n\n  return <p>Current locale is {locale}</p>;\n}\n')),(0,o.kt)("h2",{id:"composable-app"},"Composable app"),(0,o.kt)("p",null,"Create small React apps that can be composed with other apps."),(0,o.kt)("h3",{id:"createapp"},(0,o.kt)("inlineCode",{parentName:"h3"},"createApp")),(0,o.kt)("p",null,"Create a file called ",(0,o.kt)("inlineCode",{parentName:"p"},"index.ts|js")," in the ",(0,o.kt)("inlineCode",{parentName:"p"},"src")," directory where your composable app is. For example:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"my-monorepo/\n\u251c\u2500 apps/\n\u2502  \u251c\u2500 react-host/\n\u251c\u2500 composable-apps/\n\u2502  \u251c\u2500 react-app-1/\n\u2502  \u2502  \u251c\u2500 package.json\n\u2502  \u2502  \u251c\u2500 src/\n\u2502  \u2502  \u2502  \u251c\u2500 ReactApp1.tsx\n\u2502  \u2502  \u2502  \u251c\u2500 index.ts \ud83d\udc48\n\u251c\u2500 package.json\n")),(0,o.kt)("admonition",{type:"tip"},(0,o.kt)("p",{parentName:"admonition"},"Read the recommended setup in our ",(0,o.kt)("a",{parentName:"p",href:"/getting-started#recommended-setup"},"getting started page")," if you want to create a similar monorepo structure")),(0,o.kt)("p",null,"Call ",(0,o.kt)("inlineCode",{parentName:"p"},"createApp")," with the root component of your app and pass the package name of the app, for example:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},'// my-monorepo/composable-apps/react-app-1/src/index.ts\n\nimport { createApp } from "@leanjs/react";\n\nimport packageJson from "../package.json";\nimport { ReactApp1 } from "./ReactApp1";\n\n//       \ud83d\udc47  you have to `export default`\nexport default createApp(ReactApp1, {\n  packageName: packageJson.name,\n});\n')),(0,o.kt)("p",null,"Hello world example of the ",(0,o.kt)("inlineCode",{parentName:"p"},"ReactApp1")," imported above"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},'// my-monorepo/composable-apps/react-app-1/src/ReactApp1.tsx\n\nimport React from "react";\n\nexport const ReactApp1 = () => <h1>Hello React composable app 1</h1>;\n')),(0,o.kt)("p",null,"Create a file called ",(0,o.kt)("inlineCode",{parentName:"p"},"selfHosted.ts|js")," in the ",(0,o.kt)("inlineCode",{parentName:"p"},"src")," directory where your composable app is, for example:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"my-monorepo/\n\u251c\u2500 apps/\n\u2502  \u251c\u2500 react-host/\n\u251c\u2500 composable-apps/\n\u2502  \u251c\u2500 react-app-1/\n\u2502  \u2502  \u251c\u2500 package.json\n\u2502  \u2502  \u251c\u2500 src/\n\u2502  \u2502  \u2502  \u251c\u2500 ReactApp1.tsx\n\u2502  \u2502  \u2502  \u251c\u2500 index.ts\n\u2502  \u2502  \u2502  \u251c\u2500 selfHosted.ts \ud83d\udc48\n\u251c\u2500 package.json\n")),(0,o.kt)("p",null,"Export a ",(0,o.kt)("inlineCode",{parentName:"p"},"createRuntime")," function from the ",(0,o.kt)("inlineCode",{parentName:"p"},"selfHosted.ts|js")," file. This is the runtime that will be used when the app runs in isolation, meaning without a host."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},'// my-monorepo/composable-apps/react-app-1/src/selfHosted.ts\n\nexport { createRuntime } from "@my-org/runtime-react";\n')),(0,o.kt)("admonition",{type:"info"},(0,o.kt)("p",{parentName:"admonition"},"Read ",(0,o.kt)("a",{parentName:"p",href:"/packages/core#basic-usage"},"@leanjs/core")," if you have not already created your own ",(0,o.kt)("inlineCode",{parentName:"p"},"createRuntime")," function")),(0,o.kt)("h2",{id:"components"},"Components"),(0,o.kt)("h3",{id:"hostprovider"},(0,o.kt)("inlineCode",{parentName:"h3"},"HostProvider")),(0,o.kt)("p",null,"You have to ",(0,o.kt)("strong",{parentName:"p"},"call ",(0,o.kt)("a",{parentName:"strong",href:"#createruntimebindings"},"createRuntimeBindings")," to create a ",(0,o.kt)("inlineCode",{parentName:"strong"},"HostProvider")," component")," before you use it. ",(0,o.kt)("inlineCode",{parentName:"p"},"HostProvider")," stores in the React context values that are shared across apps hosted in the same component tree. Props:"),(0,o.kt)("h4",{id:"runtime-prop---required"},(0,o.kt)("inlineCode",{parentName:"h4"},"runtime")," prop - required"),(0,o.kt)("p",null,"Your Lean ",(0,o.kt)("a",{parentName:"p",href:"/packages/core/"},"runtime"),"."),(0,o.kt)("h4",{id:"errorcomponent-prop---optional"},(0,o.kt)("inlineCode",{parentName:"h4"},"errorComponent")," prop - optional"),(0,o.kt)("p",null,"React component displayed when a ",(0,o.kt)("inlineCode",{parentName:"p"},"<Host>")," component errors and the error is not handled. It can be overridden by the ",(0,o.kt)("inlineCode",{parentName:"p"},"<Host>")," component."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"type ErrorComponent = (props: { error: Error }) => ReactElement;\n")),(0,o.kt)("h4",{id:"fallback-prop---optional"},(0,o.kt)("inlineCode",{parentName:"h4"},"fallback")," prop - optional"),(0,o.kt)("p",null,"React element displayed when a ",(0,o.kt)("inlineCode",{parentName:"p"},"<Host>")," component is fetching a remote app. It can be overriden by the ",(0,o.kt)("inlineCode",{parentName:"p"},"<Host>")," component."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"type Fallback = ReactElement;\n")),(0,o.kt)("h4",{id:"origin-prop---optional"},(0,o.kt)("inlineCode",{parentName:"h4"},"origin")," prop - optional"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin"},"Origin")," where your remote composable apps are. During development, use the address where you run your Lean ",(0,o.kt)("a",{parentName:"p",href:"/packages/cli#proxy-dev-server"},"proxy dev server"),". Use the address of your CDN in production, e.g. ",(0,o.kt)("inlineCode",{parentName:"p"},"https://cdn.example.com"),"."),(0,o.kt)("p",null,"Example"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},'// where does shared-runtime come from? Read the "Usage" section at the top\nimport { createRuntime, HostProvider } from "./shared-runtime";\n\nconst runtime = createRuntime();\n// origin is optional, it\'s only used if micro-frontends are enabled\nconst origin = process.env.MICROFRONTENDS_ORIGIN;\n\nexport function App({ children }) {\n  return (\n    <HostProvider runtime={runtime} origin={origin}>\n      {children}\n    </HostProvider>\n  );\n}\n')),(0,o.kt)("h3",{id:"host"},(0,o.kt)("inlineCode",{parentName:"h3"},"Host")),(0,o.kt)("p",null,"It hosts a composable app in a React host."),(0,o.kt)("h4",{id:"app---required-prop"},(0,o.kt)("inlineCode",{parentName:"h4"},"app")," - required prop"),(0,o.kt)("p",null,"The ",(0,o.kt)("inlineCode",{parentName:"p"},"app")," prop can be a ",(0,o.kt)("inlineCode",{parentName:"p"},"ComposableApp")," object, or a function that returns a promise that resolves to a ",(0,o.kt)("inlineCode",{parentName:"p"},"ComposableApp")," object."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"interface ComposableApp {\n  // packageName is the `name` field in the `package.json` of a composable app\n  packageName: string;\n  // mount function returned by a `createApp` function\n  mount?: MountFunc;\n}\n")),(0,o.kt)("p",null,"You can ",(0,o.kt)("inlineCode",{parentName:"p"},"import")," a ",(0,o.kt)("inlineCode",{parentName:"p"},"ComposableApp")," from any ",(0,o.kt)("inlineCode",{parentName:"p"},"export default createApp()")," function, for instance:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},'// my-monorepo/composable-apps/react-app-1/src/index.tsx\n\nimport { createApp } from "@leanjs/react";\nimport { ReactApp1 } from "./ReactApp1";\n\n// createApp returns a ComposableApp\nexport default createApp(ReactApp1, {\n  packageName: "@my-org/react-app-1",\n});\n')),(0,o.kt)("p",null,"then pass it to the ",(0,o.kt)("inlineCode",{parentName:"p"},"Host")," component in a React app:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},'// my-monorepo/apps/react-host/src/index.ts\n\nimport { Host } from "@leanjs/react";\n\n// this composable app is bundled and deployed along with the host app\nimport ReactApp1 from "@my-org/react-app-1";\n\nconst Home = () => {\n  return (\n    <>\n      <h1>React Host</h1>\n      <Host app={ReactApp1} />\n    </>\n  );\n};\n\nexport default Home;\n')),(0,o.kt)("admonition",{type:"info"},(0,o.kt)("p",{parentName:"admonition"},"In this example, both the host app and the composable app are React apps. However, the React ",(0,o.kt)("inlineCode",{parentName:"p"},"<Host>")," component can host any composable app, e.g. Vue.")),(0,o.kt)("p",null,"You can also pass a function to the ",(0,o.kt)("inlineCode",{parentName:"p"},"Host")," component that returns a dynamic import to lazy load a composable app:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},'// my-monorepo/apps/react-host/src/index.ts\n\nimport { Host } from "@leanjs/react";\n\nconst Home = () => {\n  return (\n    <>\n      <h1>React Host</h1>\n      <Host\n        app={() => {\n          // this composable app is bundled in a separate chunk\n          // but it\'s still built and deployed along with the host app\n          return import("@my-org/react-app-1");\n        }}\n      />\n    </>\n  );\n};\n\nexport default Home;\n')),(0,o.kt)("p",null,"Alternatively, you can pass an object to the ",(0,o.kt)("inlineCode",{parentName:"p"},"app")," prop with a ",(0,o.kt)("inlineCode",{parentName:"p"},"packageName")," key which value is the field ",(0,o.kt)("inlineCode",{parentName:"p"},"name")," in the package.json of the composable app that you want to host. In this case, the ",(0,o.kt)("inlineCode",{parentName:"p"},"Host")," component will try to fetch the ",(0,o.kt)("inlineCode",{parentName:"p"},"mount")," function from the remote ",(0,o.kt)("inlineCode",{parentName:"p"},"origin")," specified in ",(0,o.kt)("inlineCode",{parentName:"p"},'<HostProvider origin=" \ud83d\udc49 HERE \ud83d\udc48 " runtime={runtime}>')," (see ",(0,o.kt)("a",{parentName:"p",href:"#origin-prop---optional"},"origin prop")," to know more). For example:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},'// my-monorepo/apps/react-host/src/index.ts\n\nimport { Host } from "@leanjs/react";\n\nconst Home = () => {\n  return (\n    <>\n      <h1>React Host</h1>\n      {/* in this case, the composable app is neither built nor deployed\n          along with the React host */}\n      <Host app={{ packageName: "@my-org/react-app-1" }} />\n    </>\n  );\n};\n\nexport default Home;\n')),(0,o.kt)("admonition",{type:"caution"},(0,o.kt)("p",{parentName:"admonition"},"Fetching from a remote ",(0,o.kt)("inlineCode",{parentName:"p"},"origin")," only works with Webpack v5 because this feature uses Module Federation under the hood. You need to add a ",(0,o.kt)("a",{parentName:"p",href:"/packages/webpack/#hostwebpackplugin"},"HostWebpackPlugin")," to your Webpack configuration to enable this feature. If this feature is enabled you need to build and deploy your composable apps independently. See ",(0,o.kt)("a",{parentName:"p",href:"/packages/aws/"},"@leanjs/aws")," to deploy your composable apps to AWS.")),(0,o.kt)("admonition",{type:"tip"},(0,o.kt)("p",{parentName:"admonition"},"You can still pass an ",(0,o.kt)("inlineCode",{parentName:"p"},"import")," (either dynamic or static) to the ",(0,o.kt)("inlineCode",{parentName:"p"},"app")," prop of the ",(0,o.kt)("inlineCode",{parentName:"p"},"Host")," component and configure Webpack to fetch it from a remote origin by changing the configuration of your ",(0,o.kt)("inlineCode",{parentName:"p"},"HostWebpackPlugin"),".")),(0,o.kt)("p",null,"Tip example:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},'// webpack.config.js of the host application\nconst { HostWebpackPlugin } = require("@leanjs/webpack");\n\nmodule.exports = {\n  // the rest of your configuration goes here\n  plugins: [\n    new HostWebpackPlugin({\n      remotes: {\n        // these packages are not built along with the host app\n        // but downloaded from a remote origin\n        packages: ["@my-org/react-app-1"],\n      },\n    }),\n  ],\n};\n')),(0,o.kt)("p",null,"then in your React app:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},'// my-monorepo/apps/react-host/src/index.ts\n\nimport { Host } from "@leanjs/react";\n\n// this composable app is neither bundled nor deployed along with the host app\n// because of the above remote: { packages: ["@my-org/react-app-1"] }\n// in the webpack.config.js HostWebpackPlugin\nimport ReactApp1 from "@my-org/react-app-1";\n\nconst Home = () => {\n  return (\n    <>\n      <h1>React Host</h1>\n      <Host app={ReactApp1} />\n    </>\n  );\n};\n\nexport default Home;\n')),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Pro-tip"),"\nConfigure your ",(0,o.kt)("inlineCode",{parentName:"p"},"remotes")," in ",(0,o.kt)("inlineCode",{parentName:"p"},"HostWebpackPlugin")," on development only. This way no CI/CD changes are required. It also reduces build time of your monolith in development since these packages are excluded from the monolith build. Last but not least, you can experiment with micro-frontends in development without changing how you implement and host your apps."),(0,o.kt)("p",null,"Pro-tip example:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},'// webpack.config.js of the host application\nconst { HostWebpackPlugin } = require("@leanjs/webpack");\n\nmodule.exports = {\n  // the rest of your configuration goes here\n  plugins: [\n    new HostWebpackPlugin({\n      remotes: {\n        // the following packages are built and deployed along with\n        // the React app on production, but not during development.\n        packages:\n          process.env.NODE_ENV === "production" ? [] : ["@my-org/react-app-1"],\n      },\n    }),\n  ],\n};\n')),(0,o.kt)("h2",{id:"hooks"},"Hooks"),(0,o.kt)("h3",{id:"usegetter"},(0,o.kt)("inlineCode",{parentName:"h3"},"useGetter")),(0,o.kt)("p",null,"Hook to get the current state of a given state property. You have to ",(0,o.kt)("strong",{parentName:"p"},"call ",(0,o.kt)("a",{parentName:"strong",href:"#createruntimebindings"},"createRuntimeBindings")," to create a ",(0,o.kt)("inlineCode",{parentName:"strong"},"useGetter")," hook")," before you use it."),(0,o.kt)("p",null,"Arguments:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"State property, required."),(0,o.kt)("li",{parentName:"ol"},"Loader function, optional.")),(0,o.kt)("p",null,"The output is the current state of the given property."),(0,o.kt)("p",null,"Example:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},'// where does shared-runtime come from? Read the "Usage" section at the top\nimport { useGetter } from "./shared-runtime";\n\nexport function LocaleComponent() {\n  const locale = useGetter("locale", () =>\n    fetch("/api/settings")\n      .then((response) => response.json())\n      .then((data) => data.locale)\n  );\n\n  return <p>Locale is {locale}</p>;\n}\n')),(0,o.kt)("h3",{id:"usesetter"},(0,o.kt)("inlineCode",{parentName:"h3"},"useSetter")),(0,o.kt)("p",null,"Hook to update the value of a given state property. You have to ",(0,o.kt)("strong",{parentName:"p"},"call ",(0,o.kt)("a",{parentName:"strong",href:"#createruntimebindings"},"createRuntimeBindings")," to create a ",(0,o.kt)("inlineCode",{parentName:"strong"},"useSetter")," hook")," before you use it."),(0,o.kt)("p",null,"Arguments:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"State property, required.")),(0,o.kt)("p",null,"The output is a function to update the value of the given state property."),(0,o.kt)("p",null,"Example:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-jsx"},'// where does shared-runtime come from? Read the "Usage" section at the top\nimport { useSetter } from "./shared-runtime";\n\nexport function ThemeSelector() {\n  const shareTheme = useSetter("theme");\n\n  return (\n    <>\n      <label for="theme-select">Choose a theme:</label>\n      <select\n        onChange={(e) => shareTheme(e.target.value)}\n        name="theme"\n        id="theme-select"\n      >\n        <option value="">--Please choose an option--</option>\n        <option value="dark">Dark</option>\n        <option value="light">Light</option>\n      </select>\n    </>\n  );\n}\n')),(0,o.kt)("h3",{id:"useloading"},(0,o.kt)("inlineCode",{parentName:"h3"},"useLoading")),(0,o.kt)("p",null,"Hook to get the loading state of a given state property. You have to ",(0,o.kt)("strong",{parentName:"p"},"call ",(0,o.kt)("a",{parentName:"strong",href:"#createruntimebindings"},"createRuntimeBindings")," to create a ",(0,o.kt)("inlineCode",{parentName:"strong"},"useLoading")," hook")," before you use it."),(0,o.kt)("p",null,"Arguments:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"State property, required.")),(0,o.kt)("p",null,"The output is a boolean indicating if the given state property is loading."),(0,o.kt)("p",null,"Example:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},'// where does shared-runtime come from? Read the "Usage" section at the top\nimport { useLoading } from "./shared-runtime";\n\nexport function LocaleSpinner() {\n  const loading = useLoading("locale");\n\n  if (loading) {\n    return <p>Loading...</p>;\n  } else {\n    return null;\n  }\n}\n')),(0,o.kt)("h3",{id:"useerror"},(0,o.kt)("inlineCode",{parentName:"h3"},"useError")),(0,o.kt)("p",null,"Hook to get the error state if a given state property failed to load. You have to ",(0,o.kt)("strong",{parentName:"p"},"call ",(0,o.kt)("a",{parentName:"strong",href:"#createruntimebindings"},"createRuntimeBindings")," to create a ",(0,o.kt)("inlineCode",{parentName:"strong"},"useError")," hook")," before you use it."),(0,o.kt)("p",null,"Arguments:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"State property, required.")),(0,o.kt)("p",null,"The output is undefined or a string with the error message."),(0,o.kt)("p",null,"Example:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},'// where does shared-runtime come from? Read the "Usage" section at the top\nimport { useError } from "./shared-runtime";\n\nexport function LocaleErrorMessage() {\n  const error = useError("locale");\n\n  if (error) {\n    return <p>Oops, locale error: {error} </p>;\n  } else {\n    return null;\n  }\n}\n')),(0,o.kt)("h3",{id:"useruntime"},(0,o.kt)("inlineCode",{parentName:"h3"},"useRuntime")),(0,o.kt)("p",null,"It returns the shared ",(0,o.kt)("inlineCode",{parentName:"p"},"runtime")," from the context. You have to ",(0,o.kt)("strong",{parentName:"p"},"call ",(0,o.kt)("a",{parentName:"strong",href:"#createruntimebindings"},"createRuntimeBindings")," to create a ",(0,o.kt)("inlineCode",{parentName:"strong"},"useRuntime")," hook")," before you use it."),(0,o.kt)("p",null,"Example:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-jsx"},'// where does shared-runtime come from? Read the "Usage" section at the top\nimport { useRuntime } from "./shared-runtime";\n\n// HostProvider must be an ancestor of the following component\nexport function Component() {\n  const runtime = useRuntime(); // do something with runtime\n\n  return <h1>My component</h1>;\n}\n')))}m.isMDXComponent=!0}}]);