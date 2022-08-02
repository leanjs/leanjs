---
to: <%= h.inflection.dasherize(projectName) %>/micro-frontends/<%= h.inflection.dasherize(microFrontendName) %>/src/App.tsx
---
import React from "react";
import { useGetter } from "@<%=h.inflection.dasherize(projectName)%>/runtime-react";

export function App() {
  const locale = useGetter("locale");

  return (
   <h2>
      {locale === "en" ? `🇬🇧 Hello micro-frontend` : `🇪🇸 Hola  micro-frontend`}{" "}
      <%=microFrontendName%>
    </h2>
  );
}
