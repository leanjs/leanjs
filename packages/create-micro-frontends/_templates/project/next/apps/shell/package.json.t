---
to: <%= h.inflection.dasherize(projectName) %>/apps/shell/package.json
---
{
  "name": "@<%=h.inflection.dasherize(projectName)%>/shell-next",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "NODE_OPTIONS='--inspect' next dev -p 3001"
  },
  "dependencies": {
    "@<%=h.inflection.dasherize(projectName)%>/runtime-react": "*"
  },
  "peerDependencies": {
    "@leanjs/next": "*",
    "@leanjs/react": "*",
    "@leanjs/webpack": "*",
    "cors": "*",
    "next": "*",
    "react": "*",
    "react-dom": "*"
  },
  "devDependencies": {
    "@types/cors": "*",
    "@types/node": "*",
    "@types/react": "*",
    "typescript": "*"
  }
}
