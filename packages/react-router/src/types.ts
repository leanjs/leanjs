import type { BrowserHistory, MemoryHistory } from "history";

export type UniversalHistory = MemoryHistory | BrowserHistory;

export interface UniversalRouterProps {
  basename?: string;
  children?: React.ReactElement | React.ReactElement[];
  history?: UniversalHistory;
}
