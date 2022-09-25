import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="page">
      <ul>
        <li>
          <Link to="/zima-blue">Zima Blue</Link>
        </li>
      </ul>
    </div>
  );
}
