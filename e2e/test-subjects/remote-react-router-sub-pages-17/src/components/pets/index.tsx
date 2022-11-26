import React from "react";
import { Link } from "react-router-dom";

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
