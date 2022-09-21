import React, { lazy, Suspense } from "react";
import { UniversalRouter, Host } from "@leanjs/react-router";
import { createRuntime, HostProvider } from "@art-boards/runtime-react";
import { Route, Routes } from "react-router-dom";

import "./app.css";
import Home from "./components/Home";
import routes from "./routes.json";
import Fallback from "./components/Fallback";
import { Logo } from "./components/Logo";

// import reactApp from "@leanjs/e2e-test-subjects-remote-react-1";
// const reactApp = () => import("@leanjs/e2e-test-subjects-remote-react-1");

const runtime = createRuntime();

export function App() {
  return (
    <HostProvider origin="http://localhost:56500" runtime={runtime}>
      <UniversalRouter>
        <Logo />
        <Routes>
          {routes.map(({ filepath }) => {
            const Work = lazy(() => import(`./works/${filepath}`));

            return (
              <Route
                key={filepath}
                path={`/${filepath}`}
                element={
                  <Suspense fallback={<Fallback />}>
                    <Work />
                  </Suspense>
                  // <Host />
                }
              />
            );
          })}

          <Route path="/" element={<Home />} />
        </Routes>
      </UniversalRouter>
    </HostProvider>
  );
}
