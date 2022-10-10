import React, { useState, useEffect } from "react";
import { useSetter, useGetter } from "@my-org/runtime-react";
import { fetchUsername } from "@my-org/user";

import { Input } from "./Input";
import { Button } from "./Button";

export function ProfileApp() {
  const shareUsername = useSetter("username");
  // TODO replace useEffect and useState with a useWatchState hook from @leanjs/react
  const sharedUsername = useGetter("username", fetchUsername);
  const [username = "", setUsername] = useState(sharedUsername.current);

  useEffect(() => {
    setUsername(sharedUsername.current);
  }, [sharedUsername.current]);

  return (
    <>
      <h2>User profile</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const previous = sharedUsername.current;
          if (previous !== username) {
            shareUsername({
              ...shareUsername,
              current: username,
              previous,
            });
          }
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
