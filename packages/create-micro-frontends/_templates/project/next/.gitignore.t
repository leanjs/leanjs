---
to: <%= h.inflection.dasherize(projectName) %>/.gitignore
---
# build output
dist

# dependencies
node_modules
package-lock.json
test/node_modules
/.pnp
.pnp.js

# next.js
.next

# logs & pids
*.log
pids

# coverage
.nyc_output
coverage

# test output
test/**/out*

# Editors
**/.idea
**/.#*

# tools
.eslintcache
.turbo


# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo