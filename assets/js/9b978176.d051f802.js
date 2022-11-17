"use strict";(self.webpackChunk_leanjs_website=self.webpackChunk_leanjs_website||[]).push([[189],{5318:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>d});var a=n(7378);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var s=a.createContext({}),l=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):p(p({},t),e)),n},c=function(e){var t=l(e.components);return a.createElement(s.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,r=e.originalType,s=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),u=l(n),d=o,h=u["".concat(s,".").concat(d)]||u[d]||m[d]||r;return n?a.createElement(h,p(p({ref:t},c),{},{components:n})):a.createElement(h,p({ref:t},c))}));function d(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=n.length,p=new Array(r);p[0]=u;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:o,p[1]=i;for(var l=2;l<r;l++)p[l]=n[l];return a.createElement.apply(null,p)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},7724:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>p,default:()=>m,frontMatter:()=>r,metadata:()=>i,toc:()=>l});var a=n(5773),o=(n(7378),n(5318));const r={},p="@leanjs/react-router",i={unversionedId:"react-router/README",id:"react-router/README",title:"@leanjs/react-router",description:"Installation",source:"@site/../packages/react-router/README.md",sourceDirName:"react-router",slug:"/react-router/",permalink:"/packages/react-router/",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"defaultSidebar",previous:{title:"@leanjs/react",permalink:"/packages/react/"},next:{title:"@leanjs/next",permalink:"/packages/next/"}},s={},l=[{value:"Installation",id:"installation",level:2},{value:"Basic usage",id:"basic-usage",level:2},{value:"<code>HostProvider</code>",id:"hostprovider",level:3},{value:"Composable app",id:"composable-app",level:2},{value:"<code>createApp</code>",id:"createapp",level:3},{value:"Components",id:"components",level:2},{value:"<code>Host</code>",id:"host",level:3},{value:"<code>app</code> - required prop",id:"app---required-prop",level:4},{value:"<code>className</code> - optional prop",id:"classname---optional-prop",level:4},{value:"<code>basename</code> - optional prop",id:"basename---optional-prop",level:4}],c={toc:l};function m(e){let{components:t,...n}=e;return(0,o.kt)("wrapper",(0,a.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"leanjsreact-router"},"@leanjs/react-router"),(0,o.kt)("h2",{id:"installation"},"Installation"),(0,o.kt)("p",null,"If your React Router app is in a monorepo (recommended) execute the following command at the root of your repository:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sh"},"yarn add -W react-router-dom@6 history react-dom@17 react@17 \\\n  @leanjs/react-router @leanjs/core @leanjs/react\n")),(0,o.kt)("p",null,"then in the ",(0,o.kt)("inlineCode",{parentName:"p"},"package.json")," of your React Router app add the following ",(0,o.kt)("inlineCode",{parentName:"p"},"peerDependencies"),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},'"peerDependencies": {\n  "@leanjs/core": "*",\n  "@leanjs/react-router": "*",\n  "@leanjs/react": "*",\n  "react-router-dom": "*",\n  "react-dom": "*",\n  "react": "*"\n}\n')),(0,o.kt)("p",null,"If your React Router app is not in a monorepo, then run the following command instead of the above:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sh"},"yarn add react-router-dom@6 history react-dom@17 react@17 \\\n  @leanjs/react-router @leanjs/core @leanjs/react\n")),(0,o.kt)("h2",{id:"basic-usage"},"Basic usage"),(0,o.kt)("h3",{id:"hostprovider"},(0,o.kt)("inlineCode",{parentName:"h3"},"HostProvider")),(0,o.kt)("p",null,"You have to add a ",(0,o.kt)("inlineCode",{parentName:"p"},"HostProvider")," at the root of the component tree of your React Router host app if you want to host composable apps within a React Router host. ",(0,o.kt)("strong",{parentName:"p"},"Heads up!")," ",(0,o.kt)("inlineCode",{parentName:"p"},"HostProvider")," is not exported from ",(0,o.kt)("inlineCode",{parentName:"p"},"@leanjs/react-router"),". Learn more about the ",(0,o.kt)("a",{parentName:"p",href:"/packages/react/#hostprovider"},(0,o.kt)("inlineCode",{parentName:"a"},"HostProvider")),"."),(0,o.kt)("p",null,"Example:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},'import React from "react";\nimport { BrowserRouter, Route, Routes } from "react-router-dom";\nimport { Host } from "@leanjs/react-router";\n// React runtime package created within your org\nimport { HostProvider, createRuntime } from "@my-org/react-runtime";\n\nimport ExampleApp from "@my-org/example-app";\n\nconst runtime = createRuntime({ context: { appName: "AppExample" } });\n\nconst Root = () => (\n  <HostProvider runtime={runtime}>\n    <BrowserRouter>\n      <Routes>\n        <Route path="/" element={<Host app={ExampleApp} />} />\n      </Routes>\n    </BrowserRouter>\n  </HostProvider>\n);\n\nexport default Root;\n')),(0,o.kt)("admonition",{type:"info"},(0,o.kt)("p",{parentName:"admonition"},"Read ",(0,o.kt)("a",{parentName:"p",href:"/packages/core/#basic-usage"},"@leanjs/core")," if you have not already created your own ",(0,o.kt)("inlineCode",{parentName:"p"},"createRuntime")," function.")),(0,o.kt)("h2",{id:"composable-app"},"Composable app"),(0,o.kt)("p",null,"Create small React Router apps that can be composed with other apps."),(0,o.kt)("h3",{id:"createapp"},(0,o.kt)("inlineCode",{parentName:"h3"},"createApp")),(0,o.kt)("p",null,"Arguments:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"App: ReactElement")," - required"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"options: { appName?: string }")," - optional. By default, the name of your composable app is the name of your ",(0,o.kt)("inlineCode",{parentName:"li"},"App")," component. You can change it using the optional argument ",(0,o.kt)("inlineCode",{parentName:"li"},"appName"),".")),(0,o.kt)("p",null,"Create a file called ",(0,o.kt)("inlineCode",{parentName:"p"},"index.ts|js")," in the ",(0,o.kt)("inlineCode",{parentName:"p"},"src")," directory where your composable app is. For example:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"my-monorepo/\n\u251c\u2500 apps/\n\u2502  \u251c\u2500 react-router-host/\n\u251c\u2500 composable-apps/\n\u2502  \u251c\u2500 react-router-app-1/\n\u2502  \u2502  \u251c\u2500 package.json\n\u2502  \u2502  \u251c\u2500 src/\n\u2502  \u2502  \u2502  \u251c\u2500 ReactRouterApp1.tsx\n\u2502  \u2502  \u2502  \u251c\u2500 index.ts \ud83d\udc48\n\u251c\u2500 package.json\n")),(0,o.kt)("admonition",{type:"tip"},(0,o.kt)("p",{parentName:"admonition"},"Read the recommended setup in our ",(0,o.kt)("a",{parentName:"p",href:"../../docs/getting-started#recommended-setup"},"getting started page")," if you want to create a similar monorepo structure")),(0,o.kt)("p",null,"Call ",(0,o.kt)("inlineCode",{parentName:"p"},"createApp")," with the root component of your app, for example:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},'// my-monorepo/composable-apps/react-router-app-1/src/index.ts\n\nimport { createApp } from "@leanjs/react-router";\n\nimport { ReactRouterApp1 } from "./ReactRouterApp1";\n\n// \ud83d\udc47 you have to `export default`\nexport default createApp(ReactRouterApp1);\n\n// The name of the composable app is the name of your component,\n// "ReactRouterApp1 in this case.\n// you can name it differently using the second argument, e.g.\n// export default createApp(ReactRouterApp1, { appName: "SomeName" });\n')),(0,o.kt)("p",null,"Hello world example of the ",(0,o.kt)("inlineCode",{parentName:"p"},"ReactRouterApp1")," imported above"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},'// my-monorepo/composable-apps/react-router-app-1/src/ReactRouterApp1.tsx\n\nimport React from "react";\n\nexport const ReactRouterApp1 = () => <h1>Hello React Router app</h1>;\n')),(0,o.kt)("p",null,"Create a file called ",(0,o.kt)("inlineCode",{parentName:"p"},"selfHosted.ts|js")," in the ",(0,o.kt)("inlineCode",{parentName:"p"},"src")," directory where your composable app is, for example:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"my-monorepo/\n\u251c\u2500 apps/\n\u2502  \u251c\u2500 react-router-host/\n\u251c\u2500 composable-apps/\n\u2502  \u251c\u2500 react-router-app-1/\n\u2502  \u2502  \u251c\u2500 package.json\n\u2502  \u2502  \u251c\u2500 src/\n\u2502  \u2502  \u2502  \u251c\u2500 ReactRouterApp1.tsx\n\u2502  \u2502  \u2502  \u251c\u2500 index.ts\n\u2502  \u2502  \u2502  \u251c\u2500 selfHosted.ts \ud83d\udc48\n\u251c\u2500 package.json\n")),(0,o.kt)("p",null,"Export a ",(0,o.kt)("inlineCode",{parentName:"p"},"createRuntime")," function from the ",(0,o.kt)("inlineCode",{parentName:"p"},"selfHosted.ts|js")," file. This is the runtime that will be used when the app runs in isolation, meaning without a host."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},'// my-monorepo/composable-apps/react-router-app-1/src/selfHosted.ts\n\nexport { createRuntime } from "@my-org/runtime-react";\n')),(0,o.kt)("admonition",{type:"info"},(0,o.kt)("p",{parentName:"admonition"},"Read ",(0,o.kt)("a",{parentName:"p",href:"/packages/core/#basic-usage"},"@leanjs/core")," if you have not already created your own ",(0,o.kt)("inlineCode",{parentName:"p"},"createRuntime")," function")),(0,o.kt)("h2",{id:"components"},"Components"),(0,o.kt)("h3",{id:"host"},(0,o.kt)("inlineCode",{parentName:"h3"},"Host")),(0,o.kt)("p",null,"It hosts a composable app in a React Router host."),(0,o.kt)("h4",{id:"app---required-prop"},(0,o.kt)("inlineCode",{parentName:"h4"},"app")," - required prop"),(0,o.kt)("p",null,"The ",(0,o.kt)("inlineCode",{parentName:"p"},"app")," prop expects a ",(0,o.kt)("inlineCode",{parentName:"p"},"GetComposableApp")," type. You can ",(0,o.kt)("inlineCode",{parentName:"p"},"import")," a ",(0,o.kt)("inlineCode",{parentName:"p"},"GetComposableApp")," from any ",(0,o.kt)("inlineCode",{parentName:"p"},"export default createApp()")," function, for instance:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},'// my-monorepo/composable -apps/react-router-app-1/src/ReactRouterApp1.tsx\n\nimport { createApp } from "@leanjs/react-router";\n\nimport { ReactRouterApp1 } from "./ReactRouterApp1";\n\nexport default createApp(ReactRouterApp1);\n')),(0,o.kt)("admonition",{type:"info"},(0,o.kt)("p",{parentName:"admonition"},"In this example, both the host app and the composable app are React Router apps. However, the React Router ",(0,o.kt)("inlineCode",{parentName:"p"},"<Host>")," component can host any composable app, e.g. Vue.")),(0,o.kt)("p",null,"then pass it to the ",(0,o.kt)("inlineCode",{parentName:"p"},"Host")," component in a React Router app:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},'// my-monorepo/apps/react-router-host/src/pages/index.tsx\n\nimport { Host } from "@leanjs/react-router";\n\n// this composable app is bundled and deployed along with the host app\nimport ReactRouterApp1 from "@my-org/react-router-app-1";\n\nconst Home = () => (\n  <>\n    <h1>React Router Host</h1>\n    <Host app={ReactRouterApp1} />\n  </>\n);\n\nexport default Home;\n')),(0,o.kt)("p",null,"You can also pass a function to the ",(0,o.kt)("inlineCode",{parentName:"p"},"Host")," component that returns a dynamic import to lazy load a composable app:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},'// my-monorepo/apps/react-router-host/src/pages/index.tsx\n\nimport React, { Suspense } from "react";\nimport { Host, ErrorBoundary } from "@leanjs/react-router";\n\nconst Home = () => (\n  <>\n    <h1>React Router Host</h1>\n    {/* The network can fail.\n     Add an ErrorBoundary if you are hosting an app using a dynamic import */}\n    <ErrorBoundary>\n      <Suspense fallback={<p>Loading...</p>}>\n        <Host\n          app={() => {\n            // this composable app is bundled in a separate chunk\n            // but it\'s still built and deployed along with the host app\n            return import("@my-org/react-router-app-1");\n          }}\n        />\n      </Suspense>\n    </ErrorBoundary>\n  </>\n);\n\nexport default Home;\n')),(0,o.kt)("p",null,"Alternatively, you can pass an object to the ",(0,o.kt)("inlineCode",{parentName:"p"},"app")," prop with a ",(0,o.kt)("inlineCode",{parentName:"p"},"packageName")," key which value is the field ",(0,o.kt)("inlineCode",{parentName:"p"},"name")," in the package.json of the composable app that you want to host. In this case, the ",(0,o.kt)("inlineCode",{parentName:"p"},"Host")," component will try to fetch the ",(0,o.kt)("inlineCode",{parentName:"p"},"mount")," function from the remote ",(0,o.kt)("inlineCode",{parentName:"p"},"origin")," specified in ",(0,o.kt)("inlineCode",{parentName:"p"},'<HostProvider origin=" \ud83d\udc49 HERE \ud83d\udc48 " runtime={runtime}>')," (see ",(0,o.kt)("a",{parentName:"p",href:"/packages/react/#origin-prop---optional"},"origin prop")," to know more). For example:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},'// my-monorepo/apps/react-router-host/src/pages/index.tsx\n\nimport React, { Suspense } from "react";\nimport { Host, ErrorBoundary } from "@leanjs/react";\n\nconst Home = () => (\n  <>\n    <h1>React Host</h1>\n    {/* The network can fail.\n     Add an ErrorBoundary if you are hosting a remote app */}\n    <ErrorBoundary>\n      <Suspense fallback={<p>Loading...</p>}>\n        {/* in this case, the composable app is neither built nor deployed\n          along with the React host */}\n        <Host app={{ packageName: "@my-org/react-router-app-1" }} />\n      </Suspense>\n    </ErrorBoundary>\n  </>\n);\n\nexport default Home;\n')),(0,o.kt)("admonition",{type:"caution"},(0,o.kt)("p",{parentName:"admonition"},"Fetching from a remote ",(0,o.kt)("inlineCode",{parentName:"p"},"origin")," only works with Webpack v5 because this feature uses Module Federation under the hood. You need to add a ",(0,o.kt)("a",{parentName:"p",href:"/packages/webpack/#hostwebpackplugin"},"HostWebpackPlugin")," to your Webpack configuration to enable this feature. If this feature is enabled you need to build and deploy your composable apps independently. See ",(0,o.kt)("a",{parentName:"p",href:"/packages/aws/"},"@leanjs/aws")," to deploy your composable apps to AWS.")),(0,o.kt)("admonition",{type:"tip"},(0,o.kt)("p",{parentName:"admonition"},"You can still pass an ",(0,o.kt)("inlineCode",{parentName:"p"},"import")," (either dynamic or static) to the ",(0,o.kt)("inlineCode",{parentName:"p"},"app")," prop of the ",(0,o.kt)("inlineCode",{parentName:"p"},"Host")," component and configure Webpack to fetch it from a remote origin by changing the configuration of your ",(0,o.kt)("inlineCode",{parentName:"p"},"HostWebpackPlugin"),".")),(0,o.kt)("p",null,"Tip example:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},'// webpack.config.js of the host application\nconst { HostWebpackPlugin } = require("@leanjs/webpack");\n\nmodule.exports = {\n  // the rest of your configuration goes here\n  plugins: [\n    new HostWebpackPlugin({\n      remotes: {\n        // these packages are not built along with the host app\n        // but downloaded from a remote origin\n        packages: ["@my-org/react-router-app-1"],\n      },\n    }),\n  ],\n};\n')),(0,o.kt)("p",null,"then in your React app:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},'// @my-org/my-react-app pages/index.tsx\n\nimport React, { Suspense } from "react";\nimport { Host, ErrorBoundary } from "@leanjs/react";\n\n// this composable app is neither bundled nor deployed along with the host app\n// because of the above remote: { packages: ["@my-org/react-router-app-1"] }\n// in the webpack.config.js HostWebpackPlugin\nimport ReactRouterApp1 from "@my-org/react-router-app-1";\n\nconst Home = () => (\n  <>\n    <h1>React Host</h1>\n    {/* The network can fail.\n     Add an ErrorBoundary if you are hosting a remote app */}\n    <ErrorBoundary>\n      <Suspense fallback={<p>Loading...</p>}>\n        <Host app={ReactRouterApp1} />\n      </Suspense>\n    </ErrorBoundary>\n  </>\n);\n\nexport default Home;\n')),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Pro-tip"),"\nConfigure your ",(0,o.kt)("inlineCode",{parentName:"p"},"remotes")," in ",(0,o.kt)("inlineCode",{parentName:"p"},"HostWebpackPlugin")," on development only. This way no CI/CD changes are required. It also reduces build time of your monolith in development since these packages are excluded from the monolith build. Last but not least, you can experiment with micro-frontends in development without changing how you implement and host your apps."),(0,o.kt)("p",null,"Pro-tip example:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},'// webpack.config.js of the host application\nconst { HostWebpackPlugin } = require("@leanjs/webpack");\n\nmodule.exports = {\n  // the rest of your configuration goes here\n  plugins: [\n    new HostWebpackPlugin({\n      remotes: {\n        // the following packages are built and deployed along with\n        // the React Router app on production, but not during development.\n        packages:\n          process.env.NODE_ENV === "production"\n            ? []\n            : ["@my-org/react-router-app-1"],\n      },\n    }),\n  ],\n};\n')),(0,o.kt)("h4",{id:"classname---optional-prop"},(0,o.kt)("inlineCode",{parentName:"h4"},"className")," - optional prop"),(0,o.kt)("p",null,"CSS class added to the root DOM element where the ",(0,o.kt)("a",{parentName:"p",href:"#app---required-prop"},(0,o.kt)("inlineCode",{parentName:"a"},"app")," prop")," is mounted."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},'// my-monorepo/apps/react-host/src/index.ts\n\nimport React from "react";\nimport { Host } from "@leanjs/react";\nimport ReactRouterApp1 from "@my-org/react-router-app-1";\n\nconst Home = () => (\n  <>\n    <h1>React Host</h1>\n    <Host className="some-css-class" app={ReactRouterApp1} />\n  </>\n);\n\nexport default Home;\n')),(0,o.kt)("h4",{id:"basename---optional-prop"},(0,o.kt)("inlineCode",{parentName:"h4"},"basename")," - optional prop"),(0,o.kt)("p",null,'It makes all routes and links in your app relative to a "base" portion of the URL pathname that they all share. For instance, you could render an app ',(0,o.kt)("inlineCode",{parentName:"p"},"BestSellingBooksApp")," in the following URL ",(0,o.kt)("inlineCode",{parentName:"p"},"https://fake-bookstore.com/best-sellers"),"."),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"BestSellingBooksApp")," doesn't need to define internally the segment in the URL pathname where it is hosted. In this example ",(0,o.kt)("inlineCode",{parentName:"p"},"basename")," is ",(0,o.kt)("inlineCode",{parentName:"p"},"/best-sellers"),", and it could be changed, e.g. ",(0,o.kt)("inlineCode",{parentName:"p"},"https://fake-bookstore.com/top-\ud83d\udcda"),", without having to change anything inside ",(0,o.kt)("inlineCode",{parentName:"p"},"BestSellingBooksApp"),'. The "base" portion of the URL pathname where ',(0,o.kt)("inlineCode",{parentName:"p"},"BestSellingBooksApp")," is hosted is responsibility of the host."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},'// my-monorepo/apps/react-host/src/index.ts\n\nimport React from "react";\nimport { Host } from "@leanjs/react";\nimport BestSellingBooksApp from "@my-org/best-selling-books";\n\nconst Home = () => (\n  <>\n    <h1>React Host</h1>\n    <Host basename="/best-sellers" app={BestSellingBooksApp} />\n  </>\n);\n\nexport default Home;\n')))}m.isMDXComponent=!0}}]);