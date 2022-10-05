import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import "./item.css";
import { RootState } from "../../../../store";

export const ListItem = () => {
  const { displayAuthor } = useSelector(({ home }: RootState) => home);

  return (
    <li className="list-item">
      <Link to="/zima-blue">Zima Blue</Link>
      {displayAuthor ? " by Alex Lobera" : null}
    </li>
  );
};
