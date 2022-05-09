import React, { Component } from "react";
import type { ReactElement } from "react";

export interface Props {
  children: ReactElement;
  onError?: (error: Error) => void;
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
    if (error) {
      return <h1>Error: {error.message}</h1>;
    }

    return this.props.children;
  }
}
