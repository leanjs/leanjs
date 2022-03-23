import React from "react";
import Link from "next/link";
import { useGetter } from "@my-org/react-runtime";

export function Nav() {
  const [username = "", loading] = useGetter("username", () =>
    fetch("/api/user")
      .then((response) => response.json())
      .then((data) => data.username)
  );

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
        {loading ? "..." : username}
      </Link>
    </nav>
  );
}
