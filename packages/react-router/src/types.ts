import type { BrowserHistory, MemoryHistory } from "history";

export type UniversalHistory = MemoryHistory | BrowserHistory;

export interface UniversalRouterProps {
  basename?: string;
  // children?: React.ReactElement | React.ReactElement[];
  children?: JSX.Element | JSX.Element[];
  history?: UniversalHistory;
}
