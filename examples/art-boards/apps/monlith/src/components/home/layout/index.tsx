import React from "react";
import { useDispatch } from "react-redux";

import "./layout.css";
import { toggleDisplayAuthor } from "../slice";

export function Layout() {
  const dispatch = useDispatch();

  return (
    <header className="layout-selector">
      Author{" "}
      <input
        onChange={() => dispatch(toggleDisplayAuthor())}
        type="checkbox"
      ></input>
    </header>
  );
}
