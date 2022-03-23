import React from "react";
import { useGetter } from "@my-org/react-runtime";

export function App() {
  const [username] = useGetter("username");

  return (
    <>
      <h2>Activity feed</h2>
      <p>
        <strong>{username}</strong> ✅ completed "slides for CityJS"
      </p>
      <p>
        <strong>Ana</strong> 👀 is watching "after-work yoga class"
      </p>
      <p>
        <strong>{username}</strong> ✅ completed "book holidays in Tenerife"
      </p>
      <p>
        <strong>Richard</strong> ❌ cancelled "read alexlobera.com latest post"
      </p>
    </>
  );
}
