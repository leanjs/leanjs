import { ErrorComponent } from "@leanjs/react";

export const CustomError: ErrorComponent = ({ error }) => {
  return <>Your app failed: {error.message}</>;
};
