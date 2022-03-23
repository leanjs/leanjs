import React from "react";
import Link from "next/link";
import { useGetter } from "@my-org/react-runtime";

export function Nav() {
  const [username] = useGetter("username");

  return (
    <nav>
      <Link shallow href="/">
        Home
      </Link>{" "}
      |{" "}
      <Link shallow href="/todos">
        ToDos
      </Link>{" "}
      |{" "}
      <Link shallow href="/profile">
        {username}
      </Link>
    </nav>
  );
}
