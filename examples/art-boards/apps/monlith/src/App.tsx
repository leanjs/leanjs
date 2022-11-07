import React, { Suspense, lazy } from "react";
import { Host } from "@leanjs/react";
import { Route, Routes, Link } from "react-router-dom";
import { ErrorBoundary } from "@leanjs/react";

import { Dashboard } from "./components/dashboard";
import Fallback from "./components/Fallback";

import ChatComponent from "@art-boards/chat-component";
import ChatApp from "@art-boards/chat-app";

const ZimaBlueLazyComponent = lazy(() => import("../src/works/zima-blue"));
const ZimaBlueLazyApp = () => import("@art-boards/zima-blue");

export function App() {
  return (
    <>
      <h1 className="logo">
        <Link to="/">🎨 Creative Dev Work</Link>
      </h1>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/zima-blue"
          element={
            <div className="work-layout">
              <ErrorBoundary fallback={() => <h1>🔥🔥🔥🔥🔥🔥🔥🔥🔥</h1>}>
                <Suspense fallback={<Fallback />}>
                  <Host app={ZimaBlueLazyApp} />
                  <Host app={ChatApp} />
                </Suspense>
                {/* <Suspense fallback={<Fallback />}>
                  <ZimaBlueLazyComponent />
                  <ChatComponent />
                </Suspense> */}
              </ErrorBoundary>
            </div>
          }
        />
      </Routes>
    </>
  );
}
