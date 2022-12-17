---
title: Development notes
---

# Development notes

Here are some development notes that may be useful to you if you decide to contribute to the project.

## No examples in workspaces

The LeanJs monorepo has different workspaces; as you can see [here](https://github.com/leanjs/leanjs/blob/main/package.json#L27), the examples folder is not one of them.
The reason is that when we install dependencies at the root of the monorepo it could take a lot of time if there are a lot of workspaces with many different dependencies, which slows down CI, our local dev, etc.
When we run yarn in the root directory, yarn installs the dependencies, and if a local package depends on some LeanJS package (e.g. [e2e/test-subjects/package-leanjs-react-18](https://github.com/leanjs/leanjs/blob/main/e2e/test-subjects/package-leanjs-react-18/package.json#L23)) then yarn will create a symlink in the node_modules to the local LeanJS package.

## Experimenting with packages

### Using e2e/test-subjects

If you want to experiment with some LeanJS packages by making changes and running them in an app, the easiest way is to use any of the **e2e/test-subjects** apps because they are part of the workspaces. This is what I normally do. Heads up! because we export the output of the build in the dist folder, we need to run **yarn build** in the LeanJS package that you are changing so you can use those changes in the e2e test app.

### Using yalc

If you want to make changes in a LeanJS package and use that in an example folder, then you have to create a symlink to replicate the above functionality. You have two options of that:

- [yarn link](https://classic.yarnpkg.com/lang/en/docs/cli/link/)
- [yalc](https://github.com/wclr/yalc)

In my experience using **yarn link** I had sometimes issues when a linked dependency had a dependency on another package that was also local and it was also linked, e.g. @leanjs/react depends on @leanjs/core. So I prefer to use **yalc** which has worked always fine for me.
Bear in mind that in either case, **yarn link** or **yalc**, you’ll have to do **yarn build every time that you make changes in the local @leanjs package to be able to execute those changes in your “linked” app**.

#### yalc walkthrough

- Install:

```bash
yarn global add yalc
```

- if you want experiment with the vue-router package:

```bash
cd packages/vue-router/
```

- make your changes, then build and publish the package @leanjs/vue-router locally in a local store in the folder ~/.yalc/

```bash
yarn build
yalc publish
```

- now to use this local package in our dependant example (eg. the coolest-todos)

```bash
cd ../../
cd examples/coolest-todos/
```

- install the local package in the example

```bash
yalc add -W @leanjs/vue-router@0.7.5
```

- propagate installation on workspaces

NOTE form yalc documentation:

> using yarn workspaces, --pure option will be used by default, so package.json and modules folder will not be touched. Then you add yalc'ed package folder to workspaces in package.json (you may just add .yalc/_ and .yalc/@_/\* patterns). While update (or push) operation, packages content will be updated automatically and yarn will care about everything else. If you want to override default pure behavior use --no-pure flag.

so, add `.yalc/* ` and `.yalc/@*/*` as workpackages in the example root package.json

```json
...
"workspaces": [
    "apps/*",
    "composable-apps/*",
    "packages/*",

    ".yalc/*",
    ".yalc/@*/*"
  ],
...
```

and run

```bash
yarn
```

- so, run the example

```bash
yarn dev
```

- when you're done to roll back the changes yalc made, remove all installed packages from yalc

```json
cd examples/coolest-todos/

yalc remove --all
```

## Single-version policy

When working on a monorepo, the peerDependencies should point to an asterisk (\*) as version in each package except the root package.
Then we can bump a given dependency in all the packages by changing the version in one place.
This is an implementation of something called single-version policy, which is something most monorepo tools recommend. All the packages in the monorepo use the same version. This is to avoid a [dependency hell](https://en.wikipedia.org/wiki/Dependency_hell).
