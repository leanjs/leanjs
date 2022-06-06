---
to: <%= h.inflection.dasherize(projectName) %>/tsconfig.json
---
{
  "compilerOptions": {
    "strict": true,
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "node",
    "skipLibCheck": true,
    "strictNullChecks": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "declaration": true,
    "jsx": "react"
  }
}
