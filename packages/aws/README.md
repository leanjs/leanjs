# @leanjs/aws

LeanJS utilities for AWS.

## Installation

```sh
# If you use a monorepo run this command at the root
yarn add -D @leanjs/aws @leanjs/cli
```

## Usage

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

Then in each micro-frontend `package.json` in your monorepo you can add the following script:

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
- `CLOUDFRONT_DISTRIBUTION_ID`, recommended
