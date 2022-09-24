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
import { _ as Utils } from "@leanjs/react";
// import ZimaBlue from "@art-boards/zima-blue";
// const zimaBlue = () => import("@art-boards/zima-blue");

const { ErrorBoundary } = Utils;

const runtime = createRuntime();

//const A = ;

const Host2 = React.lazy(
  () =>
    new Promise((resolve) => {
      //import("./features/chat").then((file) =>
      // @ts-ignore
      //resolve({ default: () => <h1>Test</h1> });
      //);
      import("./features/chat").then((file) => {
        // @ts-ignore
        // resolve({ default: file.default })
        // const Lazy = React.lazy(() => )
        const Comp = () => (
          <h1 style={{ paddingTop: "100px" }}>1aaaaa222222</h1>
        );
        const Lazy = React.lazy(
          () =>
            new Promise((resolve2) => {
              resolve2({
                default: Comp,
              });
            })
        );
        resolve({
          default: () => <Lazy />,
        });
      });
    })
);

export function App() {
  return (
    <HostProvider origin="http://localhost:33000" runtime={runtime}>
      <BrowserRouter>
        <Logo />
        <Routes>
          {routes.map(({ pathname, dynamicImport }) => {
            // const Work = lazy(() => import("./features/chat"));
            // const Work = () => {
            //   //console.log("aaaaaaa Work2");
            //   // const A = lazy(
            //   //   () => import("./features/chat")
            //   //   // new Promise((resolve) => {
            //   //   //   import("./features/chat").then((file) =>
            //   //   //     // @ts-ignore
            //   //   //     resolve({ default: file.default })
            //   //   //   );
            //   //   // })
            //   // );

            //   const A = () => {
            //     console.log("aaaaaaa Work222");
            //     return <h1>AAAA</h1>;
            //   };

            //   return <A />;
            // };

            return (
              <Route
                key={pathname}
                path={pathname}
                element={
                  <div className="board-layout">
                    <Suspense fallback={<Fallback />}>
                      {/* <Work /> */}
                      <Host2 />
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
