---
to: <%= h.inflection.dasherize(projectName) %>/micro-frontends/<%= h.inflection.dasherize(microFrontendName) %>/src/App.tsx
---
import React from "react";
import { useGetter } from "@<%=h.inflection.dasherize(projectName)%>/runtime-react";

export function App() {
  const theme = useGetter("theme");

  return (
    <>
      <h2>Hello 👋 <%=microFrontendName%></h2>
      <p>Current theme is <strong>{theme}</strong></p>
    </>
  );
}
