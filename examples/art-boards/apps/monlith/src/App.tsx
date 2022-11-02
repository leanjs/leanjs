import React, { Suspense, lazy } from "react";
import { Host } from "@leanjs/react";
import { Route, Routes, Link } from "react-router-dom";
import { _ } from "@leanjs/react";

import { Home } from "./components/home";
import Fallback from "./components/Fallback";

import Chat from "@art-boards/chat-app";

const { ErrorBoundary } = _;
const ZimaBlueLazyComponent = lazy(() => import("../src/works/zima-blue"));
const ZimaBlueLazyApp = () => import("@art-boards/zima-blue");

export function App() {
  return (
    <>
      <h1 className="logo">
        <Link to="/">🎨 Creative Dev Work</Link>
      </h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/zima-blue"
          element={
            <div className="work-layout">
              <ErrorBoundary>
                <Suspense fallback={<Fallback />}>
                  <Host app={ZimaBlueLazyApp} errorComponent={null} />
                  <Host app={Chat} errorComponent={null} />
                </Suspense>
              </ErrorBoundary>
              {/* <Chat /> */}
            </div>
          }
        />
      </Routes>
    </>
  );
}
