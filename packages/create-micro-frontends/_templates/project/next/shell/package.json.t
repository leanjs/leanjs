---
to: <%= h.inflection.dasherize(projectName) %>/shell/package.json
---
{
  "name": "@<%=h.inflection.dasherize(projectName)%>/shell-next",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "NODE_OPTIONS='--inspect' next dev -p 3001"
  },
  "dependencies": {
    "@leanjs/next": "*",
    "@<%=h.inflection.dasherize(projectName)%>/runtime-react": "*",
    "cors": "^2.8.5",
    "next": "12.2.0",
    "react": "*",
    "react-dom": "*"
  },
  "devDependencies": {
    "@leanjs/webpack": "*",
    "@types/cors": "^2.8.12",
    "@types/node": "^17.0.23",
    "@types/react": "^17.0.30",
    "next-transpile-modules": "^9.0.0",
    "typescript": "^4.4.4",
    "webpack": "^5.58.2"
  }
}
