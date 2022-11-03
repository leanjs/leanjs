import React, { Suspense } from "react";
import { Host } from "@leanjs/react-router";

export default function SubPages() {
  const basename = "/micro"; // how can we infer the basename like we do in Nextjs host?

  return (
    <>
      <h2>Micro-frontend page (this is not the 🏠 page)</h2>
      <Suspense fallback={<>Loading...</>}>
        <Host
          basename={basename}
          app={{
            packageName: "@leanjs/e2e-test-subjects-remote-react-sub-pages",
          }}
        />
      </Suspense>
    </>
  );
}
