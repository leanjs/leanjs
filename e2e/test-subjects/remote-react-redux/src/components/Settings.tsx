import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRuntime } from "@leanjs/e2e-test-subjects-package-runtime-react";

export function Settings() {
  const locale = useSelector((state: any) => state.settings?.locale);
  const dispatch = useDispatch();
  const runtime = useRuntime();

  return (
    <>
      <p>
        Current locale in Redux is <strong>{locale}</strong>
      </p>

      <p>
        Current locale in shared runtime is{" "}
        <strong>{runtime.state.locale}</strong>
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
