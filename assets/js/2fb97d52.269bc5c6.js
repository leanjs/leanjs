"use strict";(self.webpackChunk_leanjs_website=self.webpackChunk_leanjs_website||[]).push([[558],{5318:(e,t,n)=>{n.d(t,{Zo:()=>i,kt:()=>d});var r=n(7378);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var u=r.createContext({}),c=function(e){var t=r.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):p(p({},t),e)),n},i=function(e){var t=c(e.components);return r.createElement(u.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,u=e.parentName,i=l(e,["components","mdxType","originalType","parentName"]),m=c(n),d=a,k=m["".concat(u,".").concat(d)]||m[d]||s[d]||o;return n?r.createElement(k,p(p({ref:t},i),{},{components:n})):r.createElement(k,p({ref:t},i))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,p=new Array(o);p[0]=m;var l={};for(var u in t)hasOwnProperty.call(t,u)&&(l[u]=t[u]);l.originalType=e,l.mdxType="string"==typeof e?e:a,p[1]=l;for(var c=2;c<o;c++)p[c]=n[c];return r.createElement.apply(null,p)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},1288:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>p,default:()=>s,frontMatter:()=>o,metadata:()=>l,toc:()=>c});var r=n(5773),a=(n(7378),n(5318));const o={},p="@leanjs/vue-router",l={unversionedId:"vue-router/README",id:"vue-router/README",title:"@leanjs/vue-router",description:"Installation",source:"@site/../packages/vue-router/README.md",sourceDirName:"vue-router",slug:"/vue-router/",permalink:"/packages/vue-router/",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"defaultSidebar",previous:{title:"@leanjs/vue",permalink:"/packages/vue/"},next:{title:"@leanjs/nuxt",permalink:"/packages/nuxt/"}},u={},c=[{value:"Installation",id:"installation",level:2},{value:"Usage",id:"usage",level:2}],i={toc:c};function s(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},i,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"leanjsvue-router"},"@leanjs/vue-router"),(0,a.kt)("h2",{id:"installation"},"Installation"),(0,a.kt)("p",null,"If you use a monorepo (recommended), at the root of your repository:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"my-monorepo/\n\u251c\u2500 micro-apps/\n\u2502  \u251c\u2500 vue-router-micro-app-example/\n\u2502  \u2502  \u251c\u2500 package.json\n\u251c\u2500 package.json  \ud83d\udc48\n")),(0,a.kt)("p",null,"execute the following command:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-sh"},"yarn add @leanjs/vue-router @leanjs/core vue-router@4 vue@3\n")),(0,a.kt)("p",null,"Then in the ",(0,a.kt)("inlineCode",{parentName:"p"},"package.json")," of your micro-app app"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"my-monorepo/\n\u251c\u2500 micro-apps/\n\u2502  \u251c\u2500 vue-router-micro-app-example/\n\u2502  \u2502  \u251c\u2500 package.json \ud83d\udc48\n\u251c\u2500 package.json\n")),(0,a.kt)("p",null,"add the following ",(0,a.kt)("inlineCode",{parentName:"p"},"peerDependencies"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},'"dependencies": {\n  "@leanjs/vue-router": "*",\n  "vue-router": "*",\n  "vue": "*"\n}\n')),(0,a.kt)("p",null,"and also the following ",(0,a.kt)("inlineCode",{parentName:"p"},"devDependencies"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},'  "devDependencies": {\n    "@leanjs/cli": "*"\n  }\n')),(0,a.kt)("h2",{id:"usage"},"Usage"),(0,a.kt)("p",null,"Create a file called ",(0,a.kt)("inlineCode",{parentName:"p"},"index.ts")," in the ",(0,a.kt)("inlineCode",{parentName:"p"},"src")," directory where your micro-app is."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"my-monorepo/\n\u251c\u2500 micro-apps/\n\u2502  \u251c\u2500 vue-router-micro-app-example/\n\u2502  \u2502  \u251c\u2500 package.json\n\u2502  \u2502  \u251c\u2500 src/\n\u2502  \u2502  \u2502  \u251c\u2500 VueApp.vue\n\u2502  \u2502  \u2502  \u251c\u2500 index.ts \ud83d\udc48\n\u251c\u2500 package.json\n")),(0,a.kt)("blockquote",null,(0,a.kt)("p",{parentName:"blockquote"},(0,a.kt)("strong",{parentName:"p"},"Note"))),(0,a.kt)("blockquote",null,(0,a.kt)("p",{parentName:"blockquote"},"Read the recommended setup in our ",(0,a.kt)("a",{parentName:"p",href:"/getting-started#recommended-setup"},"getting started page")," if you want to create a similar monorepo structure")),(0,a.kt)("p",null,"Call ",(0,a.kt)("inlineCode",{parentName:"p"},"createApp")," with the root component of your VueApp and your ",(0,a.kt)("inlineCode",{parentName:"p"},"createRuntime")," function:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},'import { createApp } from "@leanjs/vue-router";\n// shared runtime example package created by your org\nimport { createRuntime } from "@my-org/runtime-shared";\n\nimport packageJson from "../package.json";\nimport VueApp from "./VueApp.vue";\n\n// \ud83d\udc47  you must `export default createApp(`\nexport default createApp(VueApp, {\n  createRuntime,\n  packageName: packageJson.name,\n});\n')),(0,a.kt)("blockquote",null,(0,a.kt)("p",{parentName:"blockquote"},(0,a.kt)("strong",{parentName:"p"},"Note"),"\nRead ",(0,a.kt)("a",{parentName:"p",href:"/packages/core#runtime"},"@leanjs/core")," if you have not already created your own ",(0,a.kt)("inlineCode",{parentName:"p"},"createRuntime")," function")),(0,a.kt)("p",null,"Create ",(0,a.kt)("inlineCode",{parentName:"p"},"VueApp.vue")," component, for example:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-vue"},"<template>\n  <h1>Hello Vue micro-app</h1>\n</template>\n")))}s.isMDXComponent=!0}}]);