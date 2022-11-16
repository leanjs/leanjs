# Example of a front-end modular monolith with micro-frontend

This project has one shell app (`apps/monolith`) composed with the following three apps:

- `composable-apps/chat`
- `composable-apps/dashboard`
- `composable-apps/zima-blue`

Any app may use packages from the `packages` folder.

```
art-boards/
├─ apps/
│  ├─ monolith/
├─ composable-apps/
│  ├─ chat
│  ├─ dashboard
│  ├─ zima-blue
├─ packages/
```

## Local development

```sh
git clone https://github.com/leanjs/leanjs.git

cd examples/art-boards

yarn
```

You can start all the apps running:

```sh
# cd examples/art-boards

yarn dev
```

You can start each app individually running:

```sh
# cd examples/art-boards/apps/monlith
yarn dev

# cd examples/art-boards/composable-apps/zima-blue
yarn dev

# and so on
```

## Production pipeline

The [`Chat` & `ZimaBlue`](https://d1s8oi6ouy9ssm.cloudfront.net/__art_boards_app/zima-blue) apps are built and deployed along with the monolith to production. The [Dashboard](https://d1s8oi6ouy9ssm.cloudfront.net/__art_boards_app/) app is always built and deployed independently, and is downloaded from a [remote build](https://d1s8oi6ouy9ssm.cloudfront.net/__art_boards_dashboard_app/latest/browser/remoteEntry.js) on production, also known as micro-frontend.

Packages are not published to a registry. Both monolith and micro-frontend have in each build a copy of the packages they use.

CI examples:

- [Github action run](https://github.com/leanjs/leanjs/actions/runs/3474609505)
- [Github action workflow](https://github.com/leanjs/leanjs/blob/main/.github/workflows/example_main_art_boards.yml)

## PR pipeline

Although `Chat` & `ZimaBlue` are built and deployed along with the monolith in the production pipeline, we deploy each composable app to an ephemeral address on each PR. This way the reviewer of the PR can easily run and interact with the new functionality.

CI examples:

- [PR comment](https://github.com/leanjs/leanjs/pull/244#issuecomment-1315906706)
- [Github action run](https://github.com/leanjs/leanjs/actions/runs/3474056117)
- [Github action workflow](https://github.com/leanjs/leanjs/blob/main/.github/workflows/example_pr_art_boards.yml)
