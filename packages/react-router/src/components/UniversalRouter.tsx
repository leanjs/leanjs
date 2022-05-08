import React from "react";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";

import type { UniversalHistory, UniversalRouterProps } from "../types";

const HistoryContext = React.createContext<UniversalHistory | undefined>(
  undefined
);

export function UniversalRouter({
  basename,
  children,
  history: defaultHistory,
}: UniversalRouterProps) {
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
    <HistoryContext.Provider value={history}>
      <Router
        basename={basename}
        location={state.location}
        navigationType={state.action}
        navigator={history}
      >
        {children}
      </Router>
    </HistoryContext.Provider>
  );
}

const useHistory = () => {
  const history = React.useContext(HistoryContext);

  if (!history) {
    throw new Error(
      `You must add a UniversalRouter component at the root of the component tree`
    );
  }

  return history;
};

export const useListen = () => useHistory().listen;
export const useNavigate = () => useHistory().push;
