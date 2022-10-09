# @leanjs/aws

## Installation

If your apps are in a monorepo (recommended) execute the following command at the root of your repository:

```sh
yarn add -D -W @leanjs/aws @leanjs/cli && yarn add -W @leanjs/core
```

then in the `package.json` of each composable app add the following `devDependency`:

```
"devDependencies": {
  "@leanjs/cli": "*"
}
```

If you don't use a monorepo, run the following command in each repository of each composable app instead of the above:

```sh
 yarn add -D @leanjs/aws @leanjs/cli && yarn add @leanjs/core
```

## Basic usage

If you deploy all your micro-frontends to the same cloud provider and use a monorepo, you can add the following in your `lean.config.js` file:

```
module.exports = {
  // ... some other config
  command: {
    deploy: {
      use: "@leanjs/aws",
    },
  },
};
```

Then in each micro-app `package.json` in your monorepo you can add the following script:

```
  "scripts": {
      "deploy": "lean deploy"
  }

```

Alternatively, you can specify the cloud provider package that you want to `use` when running the `deploy` command:

```
  "scripts": {
      "deploy": "lean deploy --use @leanjs/aws"
  }
```

## CI/CD

You must define the following environment variables in your CI/CD:

- `AWS_ACCESS_KEY_ID`, required
- `AWS_SECRET_ACCESS_KEY`, required
- `AWS_S3_BUCKET`, required
- `AWS_REGION`, required
