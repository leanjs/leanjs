import type { BrowserHistory, MemoryHistory } from "history";

export interface RouterProps {
  basename?: string;
  children?: JSX.Element | JSX.Element[];
  history?: MemoryHistory | BrowserHistory;
}
