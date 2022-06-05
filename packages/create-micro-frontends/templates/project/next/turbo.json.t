---
to: <%= h.inflection.dasherize(projectName) %>/turbo.json
---
{
  "$schema": "https://turborepo.org/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "outputs": []
    },
    "dev": {
      "cache": false
    }
  }
}
