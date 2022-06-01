import path from "path";

export const getOutputPath = (target: "web" = "web") =>
  `${path.join(process.cwd(), "dist")}/${target}`;
