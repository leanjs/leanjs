import React from "react";
import { Link } from "react-router-dom";

import routes from "../routes.json";

export default function Home() {
  return (
    <ul>
      {routes.map(({ title, filepath }) => (
        <li key={filepath}>
          <Link to={`/${filepath}`}>{title} </Link>
        </li>
      ))}
    </ul>
  );
}
