import React, { Suspense } from "react";
import {
  ReactRouterHost,
  ErrorBoundary,
  createRuntime,
  HostProvider,
} from "@leanjs/e2e-test-package-leanjs-react-17";
import { Link, Route, Routes, BrowserRouter } from "react-router-dom";
import reactApp from "@leanjs/e2e-test-subjects-remote-react-1";

import SubPages from "./SubPages";

const runtime = createRuntime({
  context: { appName: "ReactRouterShell", version: "1.2.3" },
});

export function App() {
  return (
    <HostProvider origin="http://localhost:56500" runtime={runtime}>
      <BrowserRouter>
        <h1>React Router shell</h1>
        <Link to="/">Link to home shell</Link>
        <Routes>
          <Route path="/micro/*" element={<SubPages />} />
          <Route
            path="/*"
            element={
              <>
                <h2>🏠 Home page</h2>
                <Link to="/micro">Visit micro-frontend on another page</Link>
                <ErrorBoundary>
                  <Suspense fallback={<>Loading...</>}>
                    <ReactRouterHost app={reactApp} />
                  </Suspense>
                </ErrorBoundary>
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </HostProvider>
  );
}
