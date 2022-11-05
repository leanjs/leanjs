---
to: <%= h.inflection.dasherize(projectName) %>/apps/shell/pages/index.tsx
---
import { Host } from "@leanjs/next";
import React, { Suspense } from "react";
import Head from "next/head";
import { useGetter, useSetter } from "@<%=h.inflection.dasherize(projectName)%>/runtime-react";
import { ErrorBoundary } from "@leanjs/react";

const Home = () => {
  const locale = useGetter("locale");
  const setLocale = useSetter("locale");

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <h1>{locale === "en" ? `🇬🇧 Hello Nextjs` : `🇪🇸 Hola Nextjs`}</h1>
      <select value={locale} onChange={(e) => setLocale(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Spanish</option>
      </select>
      <hr />
       <ErrorBoundary>
        <Suspense fallback={<>Loading...</>}>
          <Host app={{ packageName: "@<%=h.inflection.dasherize(projectName)%>/<%= h.inflection.dasherize(microFrontendName) %>" }} />
        </Suspense>
       </ErrorBoundary>
    </>
  );
};

export default Home;
