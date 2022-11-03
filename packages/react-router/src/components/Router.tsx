import React from "react";
import { Router as ReactRouter } from "react-router-dom";
import { createBrowserHistory } from "history";

import type { RouterProps } from "../types";

export function Router({
  basename,
  children,
  history: defaultHistory,
}: RouterProps) {
  const history = React.useMemo(
    () => defaultHistory || createBrowserHistory(),
    [defaultHistory]
  );
  const [state, setState] = React.useState({
    location: history.location,
    action: history.action,
  });

  React.useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <ReactRouter
      basename={basename}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    >
      {children}
    </ReactRouter>
  );
}
