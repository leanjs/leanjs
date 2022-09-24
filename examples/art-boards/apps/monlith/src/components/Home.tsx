import React from "react";
import { Link } from "react-router-dom";

import routes from "../routes";

export default function Home() {
  return (
    <div className="page">
      <ul>
        {routes.map(({ title, pathname }) => (
          <li key={pathname}>
            <Link to={pathname}>{title} </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
