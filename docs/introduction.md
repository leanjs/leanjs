---
slug: /
title: Introduction
---

LeanJS is a **stack of solutions for adopting and scaling micro-frontends**. These solutions integrate with existing technology, and they are grouped in the following six layers:

```
┌────────────────────┐
│     Deployment     │  AWS
└────────────────────┘
┌────────────────────┐
│     Workspace      │  Turborepo, Lerna
└────────────────────┘
┌────────────────────┐
│      Routing       │  Nextjs, Vue Router, React Router
└────────────────────┘
┌────────────────────┐
│  App composition   │  React, Vue
└────────────────────┘
┌────────────────────┐
│   Shared runtime   │  Vue, React
└────────────────────┘
┌────────────────────┐
│    Shared code     │  Webpack Module Federation
└────────────────────┘
```

## What are micro-frontends?

Micro-frontends is a software architecture for building distributed frontend applications. In this architecture, a frontend application is composed of smaller frontend applications. We believe that successful micro-frontend implementations are **LEAN**:

1. **L**oosely coupled
2. **E**xecuted and deployed independently
3. **A**utonomously developed and managed by a small team
4. **N**arrowed to a business domain

Hence the name LeanJS.

:::tip

Micro-frontends help organisations scale engineers. Its benefits don't correlate with the size of the codebase but with the number of engineers working on it.

Micro-frontends don't solve technical problems, they solve people problems.

:::

## You may not need LeanJS

Micro-frontends help break up Web-based products into smaller independent ones that can be developed, deployed, and run by small independent groups of people.

That's typically a requirement when an organisation wants to develop more features faster but incrementing the number of engineers contributing to a product doesn't increment the output proportionally. In other words, they fail to scale people.

You don't need micro-frontends if:

- You don't have problems scaling engineers.
- You have one team or a few small ones.
- Your lead time, code to market, and mean time to recovery metrics are fine.

## Why another Framework?

LeanJS is born from the need to break up monolithic front-end applications in different companies. Most micro-frontend projects start by breaking up an existing monolith rather than building a brand new product using micro-frontends from the start.

Although most micro-frontend architectures will face similar problems, every front-end monolith has its own requirements and tech stack. That's why many organisations - [Amex](https://www.youtube.com/watch?v=gmQ4I4adNec), [Hopin](https://www.youtube.com/watch?v=UFJ3yrw9h6s&t=8s), [DAZN](https://www.youtube.com/watch?v=BuRB3djraeM), [Netflix](https://www.youtube.com/watch?v=Xdx__JXq7_U), [Cazoo](https://medium.com/cazoo/how-to-build-micro-frontends-with-react-271e651272bc), [Zalando](https://engineering.zalando.com/posts/2021/03/micro-frontends-part1.html) - end up building their own solutions instead of using off the shelf micro-frontends solutions.

That's not to say that existing micro-frontend frameworks don't work. Your requirements might be implemented using frameworks such as [single-spa](https://single-spa.js.org/), like [IG](https://www.youtube.com/watch?v=24NxNEy7SaE) did.

We believe that organisations should be able to incrementally integrate and reuse solutions within their unique monoliths without reinventing them. LeanJS is not a single, standalone framework. It's an opinionated stack of solutions that you can reuse to build your own micro-frontend framework.
