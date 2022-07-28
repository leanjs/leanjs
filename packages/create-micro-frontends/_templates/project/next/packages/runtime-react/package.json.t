---
to: <%= h.inflection.dasherize(projectName) %>/packages/runtime-react/package.json
---
{
  "name": "@<%=h.inflection.dasherize(projectName)%>/runtime-react",
  "version": "1.0.0",
  "description": "",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "license": "MIT",
  "peerDependencies": {
    "@leanjs/react": "*"
  },
  "dependencies": {
    "@<%=h.inflection.dasherize(projectName)%>/runtime-shared": "*"
  }
}
