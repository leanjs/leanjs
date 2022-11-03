import React, { Component } from "react";
import type { ReactNode } from "react";

export type ErrorComponent = (props: { error: Error }) => React.ReactElement;

export interface Props {
  children: ReactNode | ReactNode[];
  onError?: (error: Error) => void;
  errorComponent: ErrorComponent;
}

export interface State {
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    error: undefined,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  public componentDidCatch(error: Error) {
    this.props.onError?.(error);
  }

  public render() {
    const { error } = this.state;
    const { errorComponent: ErrorComponent } = this.props;

    if (error) {
      return <ErrorComponent error={error} />;
    } else {
      return this.props.children;
    }
  }
}
