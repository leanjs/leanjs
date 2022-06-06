---
to: <%= h.inflection.dasherize(projectName) %>/packages/runtime-shared/package.json
---
{
  "name": "@<%=h.inflection.dasherize(projectName)%>/runtime-shared",
  "version": "1.0.0",
  "description": "",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "author": "",
  "license": "MIT",
  "dependencies": {
    "@leanjs/core": "*"
  }
}
