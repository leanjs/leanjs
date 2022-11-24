import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetter } from "@leanjs/e2e-test-package-leanjs-react-17";

export function Settings() {
  const locale = useSelector((state: any) => state.settings?.locale);
  const dispatch = useDispatch();
  const runtimeLocale = useGetter("locale");

  return (
    <>
      <p>
        Current locale in Redux is <strong>{locale}</strong>
      </p>

      <p>
        Current locale in shared runtime is <strong>{runtimeLocale}</strong>
      </p>
      <p>
        Select:
        <select
          value={locale}
          onChange={(e) =>
            dispatch({ type: "UPDATE_LOCALE", payload: e.target.value })
          }
        >
          <option value="en">en</option>
          <option value="es">es</option>
        </select>
      </p>
    </>
  );
}
