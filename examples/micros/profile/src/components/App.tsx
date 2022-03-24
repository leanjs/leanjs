import React, { useState } from "react";
import { useSetter, useGetter } from "@my-org/react-runtime";
import { fetchUsername } from "@my-org/user-api";

import { Input } from "./Input";
import { Button } from "./Button";

export function App() {
  const shareUsername = useSetter("username");
  const sharedUsername = useGetter("username");
  const [username, setUsername] = useState(sharedUsername);

  return (
    <>
      <h2>User profile</h2>
      <form
        style={{ display: "inline" }}
        onSubmit={(e) => {
          e.preventDefault();
          shareUsername(username);
        }}
      >
        <Input
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUsername(e.target.value)
          }
        />
        <Button />
      </form>
    </>
  );
}
