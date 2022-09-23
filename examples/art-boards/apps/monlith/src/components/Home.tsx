import React from "react";
import { Link } from "react-router-dom";

import routes from "../routes";

export default function Home() {
  return (
    <div className="page">
      <Link to="/test">test</Link>
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
