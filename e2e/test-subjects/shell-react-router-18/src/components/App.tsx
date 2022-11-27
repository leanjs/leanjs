import React, { Suspense } from "react";
import {
  createRuntime,
  HostProvider,
  ReactRouterHost,
  ErrorBoundary,
} from "@leanjs/e2e-test-package-leanjs-react-18";
import { Link, Route, Routes, BrowserRouter } from "react-router-dom";
import reactRouter18App from "@leanjs/e2e-test-subjects-remote-react-router-18";

import SubPages from "./SubPages";

const runtime = createRuntime({ context: { appName: "ReactShell" } });

export function App() {
  return (
    <BrowserRouter>
      <HostProvider origin="http://localhost:56500" runtime={runtime}>
        <h1>React Router 18 shell / React {React.version}</h1>
        <Link to="/">Link to home shell</Link>
        <Routes>
          <Route path="/micro/*" element={<SubPages />} />
          <Route
            path="/*"
            element={
              <>
                <h2>🏠 Home page</h2>
                <Link to="/micro">Visit micro-frontend on another page</Link>
                <ErrorBoundary fallback={({ error }) => <>{error.message}</>}>
                  <Suspense fallback={<>Loading...</>}>
                    <ReactRouterHost app={reactRouter18App} />
                  </Suspense>
                </ErrorBoundary>
              </>
            }
          />
        </Routes>
      </HostProvider>
    </BrowserRouter>
  );
}
