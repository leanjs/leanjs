import React from "react";
import { Link, Route, Routes } from "react-router-dom";

import { PetList } from "./pets";
import { Pet } from "./pets/Pet";

export function App() {
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
