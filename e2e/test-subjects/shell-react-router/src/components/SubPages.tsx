import React, { Suspense } from "react";
import {
  ErrorBoundary,
  ReactRouterHost,
} from "@leanjs/e2e-test-package-leanjs-react-17";

export default function SubPages() {
  const basename = "/micro"; // how can we infer the basename like we do in Nextjs host?

  return (
    <>
      <h2>Micro-frontend page (this is not the 🏠 page)</h2>
      <ErrorBoundary>
        <Suspense fallback={<>Loading...</>}>
          <ReactRouterHost
            basename={basename}
            app={{
              packageName:
                "@leanjs/e2e-test-subjects-remote-react-router-sub-pages",
            }}
          />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
