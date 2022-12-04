import React, { Suspense, lazy } from "react";
// import { Host } from "@leanjs/react-router/18";

import { Route, Routes, Link } from "react-router-dom";
import { ErrorBoundary } from "@leanjs/react/18";

// import ChatComponent from "@art-boards/chat-component";
import ChatApp from "@art-boards/chat-app-vue";
// import DashboardApp from "@art-boards/dashboard-app";

import { Dashboard } from "./dashboard";
import { Loading } from "./components/Loading";
import { ErrorComponent } from "./components/ErrorComponent";
import { Host } from "@leanjs/react-router/18";

const ZimaBlueLazyComponent = lazy(() => import("../src/works/zima-blue"));
const ZimaBlueLazyApp = () => import("@art-boards/zima-blue");

export function App() {
  return (
    <ErrorBoundary fallback={ErrorComponent}>
      <h1 className="logo">
        <Link to="/">🎨 Creative Dev Work</Link>
      </h1>
      <Routes>
        <Route
          path="/zima-blue"
          element={
            <div className="work-layout">
              <Suspense fallback={<Loading />}>
                <ZimaBlueLazyComponent />
              </Suspense>
              <Host app={ChatApp} />
            </div>
          }
        />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </ErrorBoundary>
  );
}

/* 

<Host app={ZimaBlueLazyApp} />

<Host app={ChatApp} />

<Route
  path="/"
  element={
    <Suspense fallback={<Loading />}>
      <Host app={DashboardApp} />
    </Suspense>
  }
/> 
*/
