---
title: Contributing
---

# Contributing

Developers like you can help by contributing to documentation, issuing pull requests to help us cover new use cases, and to help move front-end development forward.

## How Can I Help?

Anybody can help by doing any of the following:

- Try LeanJS in projects
- Help us write and maintain the content on this site
- Contribute to the LeanJS repository

## Setup

Before you can contribute to the codebase, you will need to fork the repo. New features and bug-fixes of any packages should be branched off of and merged into the `main` branch.

The following steps will get you setup to contribute changes to this repo:

1. Fork the repo

2. Clone your fork locally

   ```bash
   # in a terminal, cd to parent directory where you want your clone to be, then
   git clone https://github.com/<your_github_username>/leanjs.git
   cd leanjs
   ```

3. Install dependencies by running `yarn`. LeanJS uses [Yarn (version 1)][yarn-version-1], so you should too. If you install using `npm`, unnecessary `package-lock.json` files will be generated

   ```bash
   yarn
   ```

4. Verify you've got everything set up for local development by running the test suite, you have to build the project first

   ```bash
   yarn build
   yarn test
   ```

# Development notes

## Workspaces don’t contain Examples

The LeanJs monorepo has different workspaces; as you can see [here](https://github.com/leanjs/leanjs/blob/main/package.json#L27), the examples folder is not one of them.
The reason is that when we install dependencies at the root of the monorepo it could take a lot of time if there are a lot of workspaces with many different dependencies, which slows down CI, our local dev, etc.
When we run yarn in the root directory, yarn installs the dependencies, and if a local package depends on some LeanJS package (e.g. [e2e/test-subjects/package-leanjs-react-18](https://github.com/leanjs/leanjs/blob/main/e2e/test-subjects/package-leanjs-react-18/package.json#L23)) then yarn will create a symlink in the node_modules to the local LeanJS package.

## How to experiment with LeanJs packages

If you want to experiment with some LeanJS packages by making changes and running them in an app, the easiest way is to use any of the **e2e/test-subjects** apps because they are part of the workspaces. This is what I normally do. Heads up! because we export the output of the build in the dist folder, we need to run **yarn build** in the LeanJS package that you are changing so you can use those changes in the e2e test app.

## Make changes in a LeanJS package and use that in an example folder

If you want to make changes in a LeanJS package and use that in an example folder, then you have to create a symlink to replicate the above functionality. You have two options of that:

- [yarn link](https://classic.yarnpkg.com/lang/en/docs/cli/link/)
- [yalc](https://github.com/wclr/yalc)

In my experience using **yarn link** I had sometimes issues when a linked dependency had a dependency on another package that was also local and it was also linked, e.g. @leanjs/react depends on @leanjs/core. So I prefer to use **yalc** which has worked always fine for me.
Bear in mind that in either case, **yarn link** or **yalc**, you’ll have to do **yarn build every time that you make changes in the local @leanjs package to be able to execute those changes in your “linked” app**.

### Example of using yalc

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

## Use Single-version policy in monorepo

When working on a monorepo, the peerDependencies should point to an asterisk (\*) as version in each package except the root package.
Then we can bump a given dependency in all the packages by changing the version in one place.
This is an implementation of something called single-version policy, which is something most monorepo tools recommend. All the packages in the monorepo use the same version. This is to avoid a [dependency hell](https://en.wikipedia.org/wiki/Dependency_hell).
