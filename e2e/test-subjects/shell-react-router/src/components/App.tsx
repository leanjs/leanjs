import React, { Suspense } from "react";
import { UniversalRouter, Host } from "@leanjs/react-router";
import {
  createRuntime,
  HostProvider,
} from "@leanjs/e2e-test-subjects-package-runtime-react";
import { Link, Route, Routes } from "react-router-dom";
import SubPages from "./SubPages";
import reactApp from "@leanjs/e2e-test-subjects-remote-react-1";
// const reactApp = () => import("@leanjs/e2e-test-subjects-remote-react-1");

const runtime = createRuntime();

export function App() {
  return (
    <HostProvider origin="http://localhost:56500" runtime={runtime}>
      <UniversalRouter>
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
                <Suspense fallback={() => "..."}>
                  <Host
                    app={reactApp}
                    // app={{
                    //   packageName:
                    //     "@leanjs/e2e-test-subjects-remote-react-sub-pages",
                    // }}
                  />
                </Suspense>
              </>
            }
          />
        </Routes>
      </UniversalRouter>
    </HostProvider>
  );
}
