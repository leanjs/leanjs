import React, { Component } from "react";
import type { ReactElement } from "react";

export type ErrorComponent = (props: { error: Error }) => React.ReactElement;

export interface Props {
  children: ReactElement | JSX.Element[];
  onError?: (error: Error) => void;
  errorComponent?: ErrorComponent;
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
      if (ErrorComponent) {
        return <ErrorComponent error={error} />;
      } else {
        return null;
      }
    }

    return this.props.children;
  }
}
