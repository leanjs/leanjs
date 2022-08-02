"use strict";(self.webpackChunk_leanjs_website=self.webpackChunk_leanjs_website||[]).push([[787],{5318:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>d});var a=n(7378);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var p=a.createContext({}),l=function(e){var t=a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=l(e.components);return a.createElement(p.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,p=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),m=l(n),d=r,f=m["".concat(p,".").concat(d)]||m[d]||c[d]||o;return n?a.createElement(f,i(i({ref:t},u),{},{components:n})):a.createElement(f,i({ref:t},u))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=m;var s={};for(var p in t)hasOwnProperty.call(t,p)&&(s[p]=t[p]);s.originalType=e,s.mdxType="string"==typeof e?e:r,i[1]=s;for(var l=2;l<o;l++)i[l]=n[l];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},9083:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>i,default:()=>c,frontMatter:()=>o,metadata:()=>s,toc:()=>l});var a=n(5773),r=(n(7378),n(5318));const o={},i="@leanjs/vue",s={unversionedId:"vue/README",id:"vue/README",title:"@leanjs/vue",description:"This package contains Vue bindings for @leanjs/core runtime. These Vue bindings provide idiomatic type-safe access to your LeanJS runtime.",source:"@site/../packages/vue/README.md",sourceDirName:"vue",slug:"/vue/",permalink:"/packages/vue/",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"defaultSidebar",previous:{title:"@leanjs/react-router",permalink:"/packages/react-router/"},next:{title:"@leanjs/vue-router",permalink:"/packages/vue-router/"}},p={},l=[{value:"API",id:"api",level:2},{value:"<code>useSharedState</code>",id:"usesharedstate",level:3},{value:"Example",id:"example",level:2},{value:"Issues",id:"issues",level:2},{value:"Feedback or questions",id:"feedback-or-questions",level:2}],u={toc:l};function c(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"leanjsvue"},"@leanjs/vue"),(0,r.kt)("p",null,"This package contains Vue bindings for ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/leanjs/leanjs/tree/main/packages/core"},"@leanjs/core")," ",(0,r.kt)("inlineCode",{parentName:"p"},"runtime"),". These Vue bindings provide idiomatic type-safe access to your LeanJS ",(0,r.kt)("inlineCode",{parentName:"p"},"runtime"),"."),(0,r.kt)("h1",{id:"installation"},"Installation"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"yarn add @leanjs/vue")),(0,r.kt)("h1",{id:"usage"},"Usage"),(0,r.kt)("p",null,"1 . Create your custom ",(0,r.kt)("inlineCode",{parentName:"p"},"useSharedState")," composable. This will add type-safety to your ",(0,r.kt)("inlineCode",{parentName:"p"},"useSharedState")," composable based on your instance of LeanJS ",(0,r.kt)("inlineCode",{parentName:"p"},"runtime"),"."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},'// runtime-vue.ts\n// Pro-tip: move this file to its own package, see examples/coolest-todos/packages/runtime-vue\n\nconst defaultState = {\n  locale: "en", // define your default state accordingly, this is just an example\n};\n\n// configureRuntime is a generic TS function (if you use TypeScript)\n// handy if the types that you want don\'t match the inferred types from defaultState\nexport const { createRuntime } = configureRuntime(defaultState)({\n  onError: () => throw new Error("\ud83d\udd25 log this properly!")\n});\n\nexport const { useSharedState } = createRuntimeBindings(createRuntime);\n')),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"\u26a0\ufe0f Why is ",(0,r.kt)("inlineCode",{parentName:"strong"},"useSharedState")," not a generic function instead of using ",(0,r.kt)("inlineCode",{parentName:"strong"},"createRuntimeBindings")," to infer and return a typed ",(0,r.kt)("inlineCode",{parentName:"strong"},"useSharedState"),"?")),(0,r.kt)("p",null,"We want ",(0,r.kt)("inlineCode",{parentName:"p"},"useSharedState")," to have custom TypeScript types based on the ",(0,r.kt)("inlineCode",{parentName:"p"},"runtime")," used by a group of micro-apps in the same micro-frontend architecture. We don't want to give the consumers of ",(0,r.kt)("inlineCode",{parentName:"p"},"useSharedState")," the ability to change these types because that could create inconsistencies between different micro-apps that share the same ",(0,r.kt)("inlineCode",{parentName:"p"},"runtime"),"."),(0,r.kt)("p",null,"2 . Provide a ",(0,r.kt)("inlineCode",{parentName:"p"},"runtime")," at the root of your app, e.g."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-tsx"},'import { createApp } from "vue";\n// Pro-tip: move your ./runtime-vue file to its own package, see examples/coolest-todos/packages/runtime-vue\nimport { createRuntime } from "./runtime-vue";\n\nconst runtime = createRuntime();\nconst app = createApp(App);\n\napp.provide("runtime", runtime);\napp.mount(document.getElementById("#app"));\n')),(0,r.kt)("p",null,"3 . Use your ",(0,r.kt)("inlineCode",{parentName:"p"},"useSharedState")," in your app, e.g."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-html"},'<template>\n  <h1>Locale is {{ locale }}</h1>\n</template>\n<script>\n  import { useSharedState } from "./runtime-vue";\n  export default {\n    name: "App",\n    setup() {\n      return useSharedState("locale");\n    },\n  };\n<\/script>\n')),(0,r.kt)("h2",{id:"api"},"API"),(0,r.kt)("p",null,"To use any of the following, you must first call ",(0,r.kt)("inlineCode",{parentName:"p"},"createRuntimeBindings"),". Read the ",(0,r.kt)("a",{parentName:"p",href:"#usage"},"usage")," section above for more info."),(0,r.kt)("h3",{id:"usesharedstate"},(0,r.kt)("inlineCode",{parentName:"h3"},"useSharedState")),(0,r.kt)("p",null,"Composable to get the current state of one or many shared state properties. Types:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"type useSharedState = <\n  MyState extends Record<string, any>,\n  Prop extends keyof MyState\n>(\n  ...props:\n    | Prop[]\n    | {\n        prop: Prop;\n        loader?: () => MyState[Prop] | Promise<MyState[Prop]>;\n        deep?: boolean;\n      }\n) => Record<Prop, Ref<MyState[Prop]>>;\n")),(0,r.kt)("h2",{id:"example"},"Example"),(0,r.kt)("p",null,"You have a full example in the following files:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"examples/coolest-todos/packages/runtime-vue/src/index.ts")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"examples/coolest-todos/micros/profile-reset/src/components/App.vue"))),(0,r.kt)("h2",{id:"issues"},"Issues"),(0,r.kt)("p",null,"Do you have any issues with this package? Please file an ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/leanjs/leanjs/issues/new"},"issue"),"."),(0,r.kt)("h2",{id:"feedback-or-questions"},"Feedback or questions"),(0,r.kt)("p",null,"Send me a tweet at ",(0,r.kt)("a",{parentName:"p",href:"https://twitter.com/alex_lobera/"},"@alex_lobera")," with any feedback or questions \ud83d\ude4f."))}c.isMDXComponent=!0}}]);