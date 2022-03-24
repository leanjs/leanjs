import React from "react";
import Link from "next/link";
import { useGetter, useLoading } from "@my-org/react-runtime";
import { fetchUsername } from "@my-org/user-api";

export function Nav() {
  const username = useGetter("username", fetchUsername);
  const loading = useLoading("username");

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
