import React, { lazy, Suspense } from "react";
import { Host } from "@leanjs/react";
import { createRuntime, HostProvider } from "@art-boards/runtime-react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";

import "./app.css";
import Home from "./components/Home";
import routes from "./routes";
import Fallback from "./components/Fallback";
import { Logo } from "./components/Logo";
import { Chat } from "./features/chat";
// import ZimaBlue from "@art-boards/zima-blue";
// const zimaBlue = () => import("@art-boards/zima-blue");

const runtime = createRuntime();

export function App() {
  return (
    <HostProvider origin="http://localhost:33000" runtime={runtime}>
      <BrowserRouter>
        <Logo />
        <Routes>
          {routes.map(({ pathname, dynamicImport }) => {
            // const Work = lazy(dynamicImport);
            return (
              <Route
                key={pathname}
                path={pathname}
                element={
                  <div className="board-layout">
                    <Suspense fallback={<Fallback />}>
                      {/* <Work /> */}
                      <Host app={dynamicImport} />
                    </Suspense>
                    <Chat />
                  </div>
                }
              />
            );
          })}
          <Route path="/" element={<Home />} />
          <Route
            path="/test"
            element={
              <h1>
                <Link to="/">home</Link>
              </h1>
            }
          />
        </Routes>
      </BrowserRouter>
    </HostProvider>
  );
}
