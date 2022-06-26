import React from "react";
import Link from "next/link";

import {
  useGetter,
  useSetter,
} from "@leanjs/e2e-test-subjects-package-runtime-react";

export function Nav() {
  const locale = useGetter("locale");
  const setLocale = useSetter("locale");

  return (
    <ul>
      <li>
        <Link href="/">React page</Link>
      </li>
      <li>
        <Link href="/vue">Vue page</Link>
      </li>
      <li>
        <Link href="/react-sub-pages">React sub page</Link>
      </li>
      <li>
        <Link href="/vue-sub-pages">Vue sub page</Link>
      </li>
      <li>
        <Link href="/react-error">React error page</Link>
      </li>
      <li>
        <Link href="/react-redux">React Redux page</Link>
      </li>
      <li>
        Shell locale:{" "}
        <select value={locale} onChange={(e) => setLocale(e.target.value)}>
          <option>EN</option>
          <option>ES</option>
        </select>
      </li>
    </ul>
  );
}
