---
to: <%= h.inflection.dasherize(projectName) %>/package.json
---
{
  "name": "@<%=h.inflection.dasherize(projectName)%>/root",
  "version": "0.0.0",
  "author": "",
  "private": true,
  "description": "Lean micro-frontends project created with create-micro-frontends",
  "workspaces": [
    "apps/*",
    "micro-frontends/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev --parallel --no-cache",
    "build": "turbo run build"
  },
  "devDependencies": {
    "@leanjs/cli": "^0.6.3",
    "@leanjs/webpack": "^0.17.0",
    "@leanjs/webpack-react": "^0.1.2",
    "@swc/core": "^1.2.142",
    "@swc/jest": "^0.2.17",
    "@types/jest": "^27.4.0",
    "@types/node": "^17.0.23",
    "del-cli": "^4.0.1",
    "jest": "^27.5.1",
    "prettier": "^2.5.1",
    "ts-jest": "^27.1.3",
    "turbo": "^1.2.14",
    "typescript": "^4.8.3",
    "webpack": "^5.58.2"
  },
  "dependencies": {
    "@leanjs/core": "^0.10.0",
    "@leanjs/next": "^0.3.0",
    "@leanjs/react": "^0.6.0",
    "cors": "^2.8.5",
    "next": "12.2.0",
    "next-transpile-modules": "^9.0.0",
    "react": "^17.0.2",
    "react-dom": "^17.0.2"
  },
  "engines": {
    "npm": ">=7.0.0",
    "node": ">=14.0.0"
  }
}
