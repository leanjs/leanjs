---
to: <%= h.inflection.dasherize(projectName) %>/apps/shell/pages/_app.tsx
---
import { HostProvider, createRuntime } from "@<%=h.inflection.dasherize(projectName)%>/runtime-react";

const runtime = createRuntime({ context: { appName: "NextShell" }});

export default function MyApp({ Component, pageProps }) {
  return (
    <HostProvider origin="http://localhost:<%=devServerPort%>" runtime={runtime}>
      <Component {...pageProps} />
    </HostProvider>
  );
}
