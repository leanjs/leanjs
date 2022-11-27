import React from "react";
import { Link } from "@leanjs/e2e-test-package-leanjs-react-17";

import data from "./data";

export const PetList = () => {
  return (
    <>
      <h2>Pets</h2>
      <ul>
        {data.map(({ name }, id) => (
          <li key={id}>
            <Link to={`/${id}`}>{name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};
