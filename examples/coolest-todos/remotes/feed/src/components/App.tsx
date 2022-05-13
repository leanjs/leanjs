import React from "react";
import { useGetter } from "@my-org/runtime-react";
import { fetchUsername } from "@my-org/user";

export function App() {
  const username = useGetter("username", fetchUsername);
  //const username = "you";

  return (
    <>
      <h2>Activity feed</h2>
      <p>
        ✅ &nbsp; <strong>{username.current}</strong> completed{" "}
        <em>"slides for CityJS"</em>
      </p>
      <p>
        ✅ &nbsp; <strong>{username.current}</strong> completed{" "}
        <em> "book holidays in Tenerife"</em>
      </p>
    </>
  );
}
