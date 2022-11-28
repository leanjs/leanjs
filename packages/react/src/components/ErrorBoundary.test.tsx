import { configureRuntime } from "@leanjs/core";
import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";

import { createRuntimeBindings } from "../17/createRuntimeBindings";
import { ErrorBoundary, getErrorBoundaryProps } from "./ErrorBoundary";

const defaultState = {
  locale: "en",
};

const { createRuntime } = configureRuntime(defaultState)({
  onError: () => {
    // empty
  },
});

const { HostProvider } = createRuntimeBindings(createRuntime);

describe("ErrorBoundary", () => {
  it("calls the onError function passed to createRuntime if the ErrorBoundary catches an error and no onError prop is passed to the ErrorBoundary", () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation();
    const onError = jest.fn();
    const { createRuntime } = configureRuntime(defaultState)({
      onError,
    });
    const runtime = createRuntime({ context: { appName: "TestApp" } });
    const randomErrorMessage = Math.random().toString();
    const error = new Error(randomErrorMessage);
    const ThrowError = () => {
      throw error;
    };
    const Component = () => {
      return (
        <HostProvider runtime={runtime}>
          <ErrorBoundary>
            <ThrowError />
          </ErrorBoundary>
        </HostProvider>
      );
    };

    expect(onError).not.toHaveBeenCalled();
    render(<Component />);
    expect(onError).toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it("calls the onError function passed to the ErrorBoundary instead of the onError from createRuntime if the ErrorBoundary catches an error", () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation();
    const onRuntimeError = jest.fn();
    const { createRuntime } = configureRuntime(defaultState)({
      onError: onRuntimeError,
    });
    const runtime = createRuntime({ context: { appName: "TestApp" } });
    const onBoundaryError = jest.fn();
    const randomErrorMessage = Math.random().toString();
    const error = new Error(randomErrorMessage);
    const ThrowError = () => {
      throw error;
    };
    const Component = () => {
      return (
        <HostProvider runtime={runtime}>
          <ErrorBoundary onError={onBoundaryError}>
            <ThrowError />
          </ErrorBoundary>
        </HostProvider>
      );
    };

    expect(onRuntimeError).not.toHaveBeenCalled();
    expect(onBoundaryError).not.toHaveBeenCalled();
    render(<Component />);

    expect(onRuntimeError).not.toHaveBeenCalled();
    expect(onBoundaryError).toHaveBeenCalledWith(error);

    consoleError.mockRestore();
  });

  it("shows a message instead of the children prop if no onError function is passed to the ErrorBoundary and no runtime is found in the context", async () => {
    const Component = () => (
      <ErrorBoundary>
        <h1>Hello</h1>
      </ErrorBoundary>
    );

    render(<Component />);

    expect(
      await screen.findByText(
        "🚨 ErrorBoundary disabled. Provide an onError prop or add a HostProvider."
      )
    ).toBeVisible();
  });
});

describe("getErrorBoundaryProps", () => {
  it("returns a fallback if it's self hosted", () => {
    const isSelfHosted = true;
    const onError = jest.fn();
    const appName = Math.random().toString();
    const version = undefined;
    const errorMessage = Math.random().toString();
    const props = getErrorBoundaryProps({
      isSelfHosted,
      onError,
      appName,
      version,
    });

    expect(props.fallback?.({ error: new Error(errorMessage) })).toEqual(
      <h1>Error: {errorMessage}</h1>
    );
  });

  it("doesn't return a fallback if it's not self hosted", () => {
    const isSelfHosted = false;
    const onError = jest.fn();
    const appName = Math.random().toString();
    const version = undefined;
    const errorMessage = Math.random().toString();
    const props = getErrorBoundaryProps({
      isSelfHosted,
      onError,
      appName,
      version,
    });

    expect(props.fallback?.({ error: new Error(errorMessage) })).toEqual(
      undefined
    );
  });

  it("returns an onError function", () => {
    const isSelfHosted = false;
    const onError = jest.fn();
    const appName = Math.random().toString();
    const version = undefined;
    const props = getErrorBoundaryProps({
      isSelfHosted,
      onError,
      appName,
      version,
    });

    expect(typeof props.onError).toEqual("function");
  });
});
