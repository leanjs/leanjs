import React from "react";
import { ErrorComponent } from "../types";

export const DefaultError: ErrorComponent = ({ error }) => (
  <>Error: {error?.message}</>
);
