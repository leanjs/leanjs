import React from "react";
import { useGetter } from "@my-org/react-runtime";
import { fetchUsername } from "@my-org/user-api";

export function App() {
  const [username = ""] = useGetter("username");

  return (
    <>
      <h2>Activity feed</h2>
      <p>
        ✅ &nbsp; <strong>{username}</strong> completed{" "}
        <em>"slides for CityJS"</em>
      </p>
      <p>
        ✅ &nbsp; <strong>{username}</strong> completed{" "}
        <em> "book holidays in Tenerife"</em>
      </p>
      <p>
        ❌ &nbsp; <strong>Richard</strong> cancelled{" "}
        <em>"read alexlobera.com latest post"</em>
      </p>
    </>
  );
}
