"use strict";(self.webpackChunk_leanjs_website=self.webpackChunk_leanjs_website||[]).push([[218],{5318:(e,a,t)=>{t.d(a,{Zo:()=>s,kt:()=>d});var n=t(7378);function r(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}function o(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);a&&(n=n.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),t.push.apply(t,n)}return t}function p(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{};a%2?o(Object(t),!0).forEach((function(a){r(e,a,t[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))}))}return e}function l(e,a){if(null==e)return{};var t,n,r=function(e,a){if(null==e)return{};var t,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)t=o[n],a.indexOf(t)>=0||(r[t]=e[t]);return r}(e,a);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)t=o[n],a.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var i=n.createContext({}),c=function(e){var a=n.useContext(i),t=a;return e&&(t="function"==typeof e?e(a):p(p({},a),e)),t},s=function(e){var a=c(e.components);return n.createElement(i.Provider,{value:a},e.children)},m={inlineCode:"code",wrapper:function(e){var a=e.children;return n.createElement(n.Fragment,{},a)}},k=n.forwardRef((function(e,a){var t=e.components,r=e.mdxType,o=e.originalType,i=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),k=c(t),d=r,u=k["".concat(i,".").concat(d)]||k[d]||m[d]||o;return t?n.createElement(u,p(p({ref:a},s),{},{components:t})):n.createElement(u,p({ref:a},s))}));function d(e,a){var t=arguments,r=a&&a.mdxType;if("string"==typeof e||r){var o=t.length,p=new Array(o);p[0]=k;var l={};for(var i in a)hasOwnProperty.call(a,i)&&(l[i]=a[i]);l.originalType=e,l.mdxType="string"==typeof e?e:r,p[1]=l;for(var c=2;c<o;c++)p[c]=t[c];return n.createElement.apply(null,p)}return n.createElement.apply(null,t)}k.displayName="MDXCreateElement"},4523:(e,a,t)=>{t.r(a),t.d(a,{assets:()=>i,contentTitle:()=>p,default:()=>m,frontMatter:()=>o,metadata:()=>l,toc:()=>c});var n=t(5773),r=(t(7378),t(5318));const o={title:"Getting started"},p="Getting started",l={unversionedId:"getting-started",id:"getting-started",title:"Getting started",description:"Quick start",source:"@site/../docs/getting-started.md",sourceDirName:".",slug:"/getting-started",permalink:"/getting-started",draft:!1,editUrl:"https://github.com/leanjs/leanjs/edit/main/docs/../docs/getting-started.md",tags:[],version:"current",frontMatter:{title:"Getting started"},sidebar:"defaultSidebar",previous:{title:"Introduction",permalink:"/"},next:{title:"Contributing",permalink:"/contributing"}},i={},c=[{value:"Quick start",id:"quick-start",level:2},{value:"Manual start",id:"manual-start",level:2},{value:"Recommended setup",id:"recommended-setup",level:2},{value:"Turn your monolith into a monorepo",id:"turn-your-monolith-into-a-monorepo",level:3},{value:"Create a <code>packages</code> workspace",id:"create-a-packages-workspace",level:3},{value:"Add the <code>lean</code> cli",id:"add-the-lean-cli",level:3},{value:"Create a <code>composable-apps</code> workspace",id:"create-a-composable-apps-workspace",level:3}],s={toc:c};function m(e){let{components:a,...t}=e;return(0,r.kt)("wrapper",(0,n.Z)({},s,t,{components:a,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"getting-started"},"Getting started"),(0,r.kt)("h2",{id:"quick-start"},"Quick start"),(0,r.kt)("p",null,"For a quick start, visit ",(0,r.kt)("a",{parentName:"p",href:"../packages/create-micro-frontends"},"create micro-frontends"),"."),(0,r.kt)("h2",{id:"manual-start"},"Manual start"),(0,r.kt)("p",null,"You will want to manually start a composable apps project when you have an existing monolith. This is the expected path."),(0,r.kt)("h2",{id:"recommended-setup"},"Recommended setup"),(0,r.kt)("h3",{id:"turn-your-monolith-into-a-monorepo"},"Turn your monolith into a monorepo"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"Create directory ",(0,r.kt)("inlineCode",{parentName:"p"},"apps/my-monolith")," and move all your code there")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"Keep also a copy of your ",(0,r.kt)("inlineCode",{parentName:"p"},"package.json")," at the root"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre"},"my-monorepo/\n\u251c\u2500 apps/\n\u2502  \u251c\u2500 my-monolith/\n\u2502  \u2502  \u251c\u2500 package.json  \ud83d\udc48 same\n\u251c\u2500 package.json  \ud83d\udc48 same\n"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"Make all the ",(0,r.kt)("inlineCode",{parentName:"p"},"dependencies")," in the package.json in ",(0,r.kt)("inlineCode",{parentName:"p"},"my-monorepo/apps/my-monolith")," point to version ",(0,r.kt)("inlineCode",{parentName:"p"},"*"),". We are enabling a single-version policy for the entire monorepo.")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"Add the following field ",(0,r.kt)("inlineCode",{parentName:"p"},'workspaces: ["apps/*"]')," in the root package.json:"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre"},"my-monorepo/\n\u251c\u2500 apps/\n\u2502  \u251c\u2500 my-monolith/\n\u2502  \u2502  \u251c\u2500 package.json\n\u251c\u2500 package.json  \ud83d\udc48 root\n")))),(0,r.kt)("h3",{id:"create-a-packages-workspace"},"Create a ",(0,r.kt)("inlineCode",{parentName:"h3"},"packages")," workspace"),(0,r.kt)("p",null,"Packages are used to share code between composable apps and/or the monolith."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"Add ",(0,r.kt)("em",{parentName:"p"},'"packages/',"*",'"')," to the following field ",(0,r.kt)("inlineCode",{parentName:"p"},'workspaces: ["apps/*", "packages/*"]')," in the root package.json."),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre"},"my-monorepo/\n\u251c\u2500 apps/\n\u2502  \u251c\u2500 my-monolith/\n\u2502  \u2502  \u251c\u2500 package.json\n\u251c\u2500 package.json  \ud83d\udc48 here\n"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"Create a ",(0,r.kt)("inlineCode",{parentName:"p"},"packages")," folder at the root of your monorepo, e.g."),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre"},"my-monorepo/\n\u251c\u2500 apps/\n\u251c\u2500 packages/ \ud83d\udc48 here\n\u251c\u2500 package.json\n"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"Create a package inside the ",(0,r.kt)("inlineCode",{parentName:"p"},"packages")," folder. You must include a ",(0,r.kt)("inlineCode",{parentName:"p"},"package.json")," in your package."),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre"},"my-monorepo/\n\u251c\u2500 apps/\n\u251c\u2500 packages/\n\u2502  \u251c\u2500 my-package/\n\u2502  \u2502  \u251c\u2500 package.json  \ud83d\udc48 here\n\u251c\u2500 package.json\n")))),(0,r.kt)("admonition",{type:"tip"},(0,r.kt)("p",{parentName:"admonition"},"Use the same scope in all the ",(0,r.kt)("inlineCode",{parentName:"p"},"package.json"),"s of your monorepo, e.g. ",(0,r.kt)("strong",{parentName:"p"},"@my-org"),":"),(0,r.kt)("ul",{parentName:"admonition"},(0,r.kt)("li",{parentName:"ul"},"apps/my-monolith/package.json ",(0,r.kt)("inlineCode",{parentName:"li"},'{ "name": "@my-org/my-monolith" }')),(0,r.kt)("li",{parentName:"ul"},"packages/new-package/package.json ",(0,r.kt)("inlineCode",{parentName:"li"},'{ "name": "@my-org/new-package" }')))),(0,r.kt)("h3",{id:"add-the-lean-cli"},"Add the ",(0,r.kt)("inlineCode",{parentName:"h3"},"lean")," cli"),(0,r.kt)("p",null,"Create a ",(0,r.kt)("inlineCode",{parentName:"p"},"lean.config.js")," file at the root of your monorepo:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"my-monorepo/\n\u251c\u2500 apps/\n\u251c\u2500 packages/\n\u251c\u2500 lean.config.js  \ud83d\udc48 here\n\u251c\u2500 package.json\n")),(0,r.kt)("p",null,"Add some config, for example:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'const { createReactWebpackConfig } = require("@leanjs/webpack-react");\n\nmodule.exports = {\n  devServer: { port: 43210 },\n  webpack: {\n    // replace the following config with your custom Webpack config\n    react: createReactWebpackConfig(),\n  },\n};\n')),(0,r.kt)("p",null,"Execute the following command at the root directory of your monorepo:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-sh"},"yarn add -W -D @leanjs/cli @leanjs/webpack\n")),(0,r.kt)("h3",{id:"create-a-composable-apps-workspace"},"Create a ",(0,r.kt)("inlineCode",{parentName:"h3"},"composable-apps")," workspace"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"Add ",(0,r.kt)("em",{parentName:"p"},'"composable-apps/',"*",'"')," to the following field ",(0,r.kt)("inlineCode",{parentName:"p"},'workspaces: ["apps/*", "packages/*", "composable-apps/*"]')," in the root package.json."),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre"},"my-monorepo/\n\u251c\u2500 apps/\n\u251c\u2500 packages/\n\u2502  \u251c\u2500 my-monolith/\n\u2502  \u2502  \u251c\u2500 package.json\n\u251c\u2500 package.json  \ud83d\udc48 here\n"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"Create a ",(0,r.kt)("inlineCode",{parentName:"p"},"composable-apps")," folder at the root of your monorepo, e.g."),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre"},"my-monorepo/\n\u251c\u2500 apps/\n\u251c\u2500 composable-apps/ \ud83d\udc48 here\n\u251c\u2500 packages/\n\u251c\u2500 package.json\n"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"Create a composable app inside the ",(0,r.kt)("inlineCode",{parentName:"p"},"composable-apps")," folder. You must include a ",(0,r.kt)("inlineCode",{parentName:"p"},"package.json")," in your new composable app:"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre"},"my-monorepo/\n\u251c\u2500 apps/\n\u251c\u2500 composable-apps/\n\u2502  \u251c\u2500 my-app/\n\u2502  \u2502  \u251c\u2500 package.json  \ud83d\udc48 here\n\u251c\u2500 packages/\n\u251c\u2500 package.json\n"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"Create a composable app based on your UI library:"),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"../packages/react-router/"},"React Router")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"../packages/vue-router/"},"Vue Router"))))))}m.isMDXComponent=!0}}]);