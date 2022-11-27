import React from "react";
import { Link, Route, Routes } from "@leanjs/e2e-test-package-leanjs-react-17";

import { PetList } from "./components/pets";
import { Pet } from "./components/pets/Pet";

export function RemoteReactSubPages() {
  return (
    <>
      <Routes>
        <Route path="/" element={<PetList />}></Route>
        <Route path="/:id" element={<Pet />}></Route>
      </Routes>
      React {React.version}
      <hr />
      <Link to="/">Back to home</Link>
    </>
  );
}
