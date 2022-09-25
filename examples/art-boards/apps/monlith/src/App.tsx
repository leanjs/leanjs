import React, { Suspense } from "react";
import { Host } from "@leanjs/react";
import { createRuntime, HostProvider } from "@art-boards/runtime-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./components/Home";
import Fallback from "./components/Fallback";
import { Logo } from "./components/Logo";

import ChatApp from "@art-boards/chat";

const ZimaBlueLazyComponent = React.lazy(
  () => import("../src/works/zima-blue")
);

const ZimaBlueLazyApp = () => import("@art-boards/zima-blue");

const runtime = createRuntime();

export function App() {
  return (
    <HostProvider origin="http://localhost:33000" runtime={runtime}>
      <BrowserRouter>
        <Logo />
        <Routes>
          <Route
            path="/zima-blue"
            element={
              <div className="board-layout">
                {/* <Suspense fallback={<Fallback />}>
                        <ZimaBlueLazyComponent />
                      </Suspense> */}
                <Host fallback={<Fallback />} app={ZimaBlueLazyApp} />
                <Host app={ChatApp} />
              </div>
            }
          />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </HostProvider>
  );
}
