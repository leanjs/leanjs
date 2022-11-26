import React from "react";
import { Link, useParams } from "react-router-dom";

import data from "./data";

export const Pet = () => {
  const { id } = useParams();

  if (!id) {
    return <h1>Pet not found</h1>;
  }

  const { name, type } = data[Number(id)];

  return (
    <>
      <h2>
        {name} is a {type}
      </h2>
      <Link to="/">Back to list</Link>
    </>
  );
};
