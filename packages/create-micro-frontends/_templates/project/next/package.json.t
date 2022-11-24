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
    "@leanjs/cli": "0.7.34",
    "@leanjs/webpack": "0.21.4",
    "@leanjs/webpack-react": "0.2.42",
    "@swc/core": "^1.2.142",
    "@swc/jest": "^0.2.17",
    "@types/jest": "^27.4.0",
    "@types/node": "^17.0.23",
    "del-cli": "^4.0.1",
    "jest": "^27.5.1",
    "prettier": "^2.5.1",
    "ts-jest": "^27.1.3",
    "turbo": "^1.2.14",
    "typescript": "^4.5.3",
    "webpack": "^5.58.2"
  },
  "dependencies": {
    "@leanjs/core": "0.25.0",
    "@leanjs/next": "0.8.6",
    "@leanjs/react": "0.19.1",
    "cors": "2.8.5",
    "next": "13.0.2",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  },
  "engines": {
    "npm": ">=7.0.0",
    "node": ">=14.0.0"
  }
}
