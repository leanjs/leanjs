import React, { Component } from "react";
import type { ReactElement } from "react";
import { AppError, LogErrorOptions } from "@leanjs/core";

import { RuntimeContext } from "../runtime";

export type ErrorFallbackComponent = (props: {
  error: AppError;
}) => React.ReactElement;

export interface Props {
  children: ReactElement | JSX.Element[];
  onError?: (error: AppError, options?: LogErrorOptions) => void;
  fallback?: ErrorFallbackComponent;
}

export interface State {
  error?: AppError;
}

export class ErrorBoundary extends Component<Props, State> {
  static contextType = RuntimeContext;
  context: React.ContextType<typeof RuntimeContext>;

  public state: State = {
    error: undefined,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  public componentDidCatch(error: AppError) {
    const { onError } = this.props;
    if (onError) {
      onError(error);
    } else {
      this.context?.logError(error, {
        appName: error.appName,
        version: error.version,
      });
    }
  }

  public render() {
    const { error } = this.state;
    const { fallback: Fallback, onError } = this.props;

    if (!onError && !this.context?.logError) {
      return (
        <h1>
          🚨 <code>ErrorBoundary</code> disabled. Provide an{" "}
          <code>onError</code> prop or add a <code>HostProvider</code>
        </h1>
      );
    }

    if (error) {
      if (Fallback) {
        return <Fallback error={error} />;
      } else {
        return null;
      }
    }

    return this.props.children;
  }
}
