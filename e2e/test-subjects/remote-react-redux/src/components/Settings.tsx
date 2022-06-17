import React from "react";
import { useDispatch, useSelector } from "react-redux";

export function Settings() {
  const locale = useSelector((state: any) => state.settings?.locale);
  const dispatch = useDispatch();

  return (
    <p>
      Redux locale{" "}
      <select
        value={locale}
        onChange={(e) =>
          dispatch({ type: "UPDATE_LOCALE", payload: e.target.value })
        }
      >
        <option>EN</option>
        <option>ES</option>
      </select>
    </p>
  );
}
