---
to: <%= h.inflection.dasherize(projectName) %>/packages/runtime-react/package.json
---
{
  "name": "@<%=h.inflection.dasherize(projectName)%>/runtime-react",
  "version": "1.0.0",
  "description": "",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "author": "",
  "license": "MIT",
  "dependencies": {
    "@leanjs/react": "*",
    "@<%=h.inflection.dasherize(projectName)%>/runtime-shared": "*"
  }
}
