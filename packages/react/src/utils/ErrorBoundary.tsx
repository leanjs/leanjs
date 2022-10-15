import React, { Component } from "react";
import type { ReactElement } from "react";

import { ErrorComponent } from "../types";
import { DefaultError } from "./DefaultError";

export interface Props {
  children: ReactElement | JSX.Element[];
  onError?: (error: Error) => void;
  errorComponent?: ErrorComponent | null;
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
    const { errorComponent } = this.props;

    if (error) {
      if (errorComponent === null) {
        return null;
      } else {
        const ErrorComponent = errorComponent ?? DefaultError;
        return <ErrorComponent error={error} />;
      }
    }

    return this.props.children;
  }
}
