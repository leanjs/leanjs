import React from "react";
import { Host } from "@leanjs/react-router";
import { useParams } from "react-router-dom";

export default function SubPages() {
  const params = useParams();
  const basename = "/micro"; // how can we infer the basename like we do in Nextjs host?
  const pathname = params["*"];
  return (
    <>
      <h2>Micro-frontend page (this is not the 🏠 page)</h2>
      <Host
        basename={basename}
        pathname={pathname}
        remote={{
          packageName: "@leanjs/e2e-test-subjects-remote-react-sub-pages",
        }}
      />
    </>
  );
}
