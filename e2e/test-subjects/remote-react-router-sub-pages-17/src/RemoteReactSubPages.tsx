import React from "react";
import { Link, Route, Routes } from "react-router-dom";

import { PetList } from "./components/pets";
import { Pet } from "./components/pets/Pet";

export function RemoteReactSubPages() {
  return (
    <>
      <Routes>
        <Route path="/" element={<PetList />}></Route>
        <Route path="/:id" element={<Pet />}></Route>
      </Routes>
      <hr />
      <Link to="/">Back to home</Link>
    </>
  );
}
