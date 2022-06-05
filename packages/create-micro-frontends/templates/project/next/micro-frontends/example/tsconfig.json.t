---
to: <%= h.inflection.dasherize(projectName) %>/micro-frontends/<%= h.inflection.dasherize(microFrontendName) %>/tsconfig.json
---
{
  "extends": "../../tsconfig.json",
  "include": ["."],
  "exclude": ["dist", "build", "node_modules"]
}
