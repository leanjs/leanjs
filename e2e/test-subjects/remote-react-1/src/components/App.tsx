import React from "react";
import { Link } from "react-router-dom";

export function App() {
  return (
    <>
      <h1>React micro-app 1</h1>
      <Link to="/vue">Go to Vue page</Link>
    </>
  );
}
