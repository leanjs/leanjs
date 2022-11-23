import React from "react";
import Link from "next/link";

import { useGetter, useSetter } from "@leanjs/e2e-test-package-leanjs-react-18";

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
        <Link href="/react-router-sub-pages">React sub pages</Link>
        <ul>
          <li>
            <Link href="/react-router-sub-pages/0">Page Lola</Link>
          </li>
        </ul>
      </li>
      <li>
        <Link href="/vue-sub-pages">Vue sub pages</Link>
        <ul>
          <li>
            <Link href="/vue-sub-pages/about">Page about Vue</Link>
          </li>
        </ul>
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
          <option value="en">EN</option>
          <option value="es">ES</option>
        </select>
      </li>
    </ul>
  );
}
