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
