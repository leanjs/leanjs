---
to: <%= h.inflection.dasherize(projectName) %>/micro-frontends/<%= h.inflection.dasherize(microFrontendName) %>/package.json
---
{
  "name": "@<%=h.inflection.dasherize(projectName)%>/<%= h.inflection.dasherize(microFrontendName) %>",
  "version": "1.0.0",
  "scripts": {
    "dev": "lean dev --config=react",
    "build": "lean build --config=react"
  },
  "author": "",
  "license": "MIT",
  "dependencies": {
    "@leanjs/react-router": "*",
    "@<%=h.inflection.dasherize(projectName)%>/runtime-react": "*",
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "react-router-dom": "^6.3.0"
  },
  "devDependencies": {
    "@leanjs/cli": "*"
  }
}
