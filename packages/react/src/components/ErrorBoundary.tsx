import React, { Component } from "react";
import type { ReactElement } from "react";
import type { AppError, RuntimeContext, LogAnyError } from "@leanjs/core";
import { _ as CoreUtils } from "@leanjs/core";

import { ReactRuntimeContext } from "../core";

const { createAppError } = CoreUtils;

export type ErrorFallbackComponent = (props: {
  error: AppError;
}) => React.ReactElement;

export interface Props {
  children: ReactElement | JSX.Element[];
  onError?: (error: AppError, options?: RuntimeContext) => void;
  fallback?: ErrorFallbackComponent;
}

export interface State {
  error?: AppError;
}

export class ErrorBoundary extends Component<Props, State> {
  static contextType = ReactRuntimeContext;
  context: React.ContextType<typeof ReactRuntimeContext> = {};

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
      this.context.runtime?.logError(error, {
        appName: error.appName || "",
        version: error.version,
      });
    }
  }

  public render() {
    const { error } = this.state;
    const { fallback: Fallback, onError } = this.props;

    if (!onError && !this.context.runtime?.logError) {
      return (
        <h1>
          🚨 ErrorBoundary disabled. Provide an onError prop or add a
          HostProvider.
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

interface GetErrorBoundaryProps {
  isSelfHosted?: boolean;
  onError: LogAnyError;
  appName: string;
  version?: string;
}
export const getErrorBoundaryProps = ({
  isSelfHosted,
  onError,
  appName,
  version,
}: GetErrorBoundaryProps) => ({
  fallback: isSelfHosted
    ? ({ error }: { error: AppError }) => <h1>Error: {error.message}</h1>
    : undefined,
  onError: (error: any) =>
    onError(createAppError({ appName, error, version }), { appName, version }),
});
