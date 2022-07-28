"use strict";(self.webpackChunk_leanjs_website=self.webpackChunk_leanjs_website||[]).push([[349],{5318:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>m});var o=n(7378);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},a=Object.keys(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=o.createContext({}),c=function(e){var t=o.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=c(e.components);return o.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},d=o.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),d=c(n),m=r,f=d["".concat(l,".").concat(m)]||d[m]||u[m]||a;return n?o.createElement(f,i(i({ref:t},p),{},{components:n})):o.createElement(f,i({ref:t},p))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,i=new Array(a);i[0]=d;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:r,i[1]=s;for(var c=2;c<a;c++)i[c]=n[c];return o.createElement.apply(null,i)}return o.createElement.apply(null,n)}d.displayName="MDXCreateElement"},9183:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>u,frontMatter:()=>a,metadata:()=>s,toc:()=>c});var o=n(5773),r=(n(7378),n(5318));const a={slug:"/",title:"Introduction"},i=void 0,s={unversionedId:"introduction",id:"introduction",title:"Introduction",description:"LeanJS is a stack of solutions for adopting and scaling micro-frontends. These solutions integrate with existing technology, and they are grouped in the following six layers:",source:"@site/../docs/introduction.md",sourceDirName:".",slug:"/",permalink:"/",draft:!1,editUrl:"https://github.com/leanjs/leanjs/edit/main/docs/../docs/introduction.md",tags:[],version:"current",frontMatter:{slug:"/",title:"Introduction"},sidebar:"defaultSidebar",next:{title:"Getting started",permalink:"/getting-started"}},l={},c=[{value:"What are micro-frontends?",id:"what-are-micro-frontends",level:2},{value:"You may not need LeanJS",id:"you-may-not-need-leanjs",level:2},{value:"Why another Framework?",id:"why-another-framework",level:2}],p={toc:c};function u(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,o.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"LeanJS is a ",(0,r.kt)("strong",{parentName:"p"},"stack of solutions for adopting and scaling micro-frontends"),". These solutions integrate with existing technology, and they are grouped in the following six layers:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502     Deployment     \u2502  AWS\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502     Workspace      \u2502  Turborepo, Lerna\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502      Routing       \u2502  Nextjs, Vue Router, React Router\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502  App composition   \u2502  React, Vue\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502   Shared runtime   \u2502  Vue, React\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502    Shared code     \u2502  Webpack Module Federation\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n")),(0,r.kt)("h2",{id:"what-are-micro-frontends"},"What are micro-frontends?"),(0,r.kt)("p",null,"Micro-frontends is a software architecture for building distributed frontend applications. In this architecture, a frontend application is composed of smaller frontend applications. We believe that successful micro-frontend implementations are ",(0,r.kt)("strong",{parentName:"p"},"LEAN"),":"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"L"),"oosely coupled"),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"E"),"xecuted and deployed independently"),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"A"),"utonomously developed and managed by a small team"),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"N"),"arrowed to a business domain")),(0,r.kt)("p",null,"Hence the name LeanJS."),(0,r.kt)("admonition",{type:"tip"},(0,r.kt)("p",{parentName:"admonition"},"Micro-frontends help organizations scale engineers. Its benefits don't correlate with the size of the codebase but with the number of engineers working on it."),(0,r.kt)("p",{parentName:"admonition"},"Micro-frontends don't solve technical problems, they sove people problems.")),(0,r.kt)("h2",{id:"you-may-not-need-leanjs"},"You may not need LeanJS"),(0,r.kt)("p",null,"Micro-frontends help break up Web-based products into smaller independent ones that can be developed, built, and run by small independent groups of people."),(0,r.kt)("p",null,"That's tipically a requirement when an organization wants to develop more features faster but incrementining the number of engineers contributing to a product doesn't increment the output proprocionally. In other words, they fail to scale people."),(0,r.kt)("p",null,"You don't need micro-frontends if:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"You don't have problems scaling engineers."),(0,r.kt)("li",{parentName:"ul"},"You have one team or a few small ones."),(0,r.kt)("li",{parentName:"ul"},"Your lead time, code to market, and mean time to recovery metrics are fine.")),(0,r.kt)("h2",{id:"why-another-framework"},"Why another Framework?"),(0,r.kt)("p",null,"LeanJS is borned from the need to break up monolithic front-end applications in different companies. Most micro-frontend projects start by breaking up an existing monolith rather than building a brand new product using micro-frontends from the start."),(0,r.kt)("p",null,"Although most micro-frontend architectures will face similar problems, every front-end monolith has its own requirements and tech stack. That's why many organizations - ",(0,r.kt)("a",{parentName:"p",href:"https://www.youtube.com/watch?v=gmQ4I4adNec"},"Amex"),", ",(0,r.kt)("a",{parentName:"p",href:"https://www.youtube.com/watch?v=UFJ3yrw9h6s&t=8s"},"Hopin"),", ",(0,r.kt)("a",{parentName:"p",href:"https://www.youtube.com/watch?v=BuRB3djraeM"},"DAZN"),", ",(0,r.kt)("a",{parentName:"p",href:"https://www.youtube.com/watch?v=Xdx__JXq7_U"},"Netflix"),", ",(0,r.kt)("a",{parentName:"p",href:"https://medium.com/cazoo/how-to-build-micro-frontends-with-react-271e651272bc"},"Cazoo"),", ",(0,r.kt)("a",{parentName:"p",href:"https://engineering.zalando.com/posts/2021/03/micro-frontends-part1.html"},"Zalando")," - end up building their own framework instead of using an off the shelf micro-frontends solution."),(0,r.kt)("p",null,"That's not to say that existing micro-frontend frameworks don't work. Your requirementes might be implemented using frameworks such as ",(0,r.kt)("a",{parentName:"p",href:"https://single-spa.js.org/"},"single-spa"),", like ",(0,r.kt)("a",{parentName:"p",href:"https://www.youtube.com/watch?v=24NxNEy7SaE"},"IG")," did."),(0,r.kt)("p",null,"You may have to build a micro-frontend framework that perfectly matches the requirements and stack of your organization. We have been there. We believe that organizations should be able to incrementally integrate many of these solutions in their unique monoliths without reinventing them."),(0,r.kt)("p",null,"LeanJS is not a single, standalone framework. It's an opinionated stack of solutions that you can use to build your own micro-frontend framework."))}u.isMDXComponent=!0}}]);