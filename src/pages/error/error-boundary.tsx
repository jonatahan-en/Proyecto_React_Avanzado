import { Button } from "@/components/ui/button";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
          <div className="max-w-md rounded-lg bg-white p-8 text-center shadow-xl">
            <h1 className="mb-4 text-6xl font-bold text-red-500">Oops!</h1>
            <div className="mb-8">
              <div className="mx-auto my-4 h-1 w-16 bg-red-500"></div>
              <h2 className="mb-4 text-2xl font-semibold text-gray-700">
                Something went wrong
              </h2>
              <p className="mb-4 text-gray-600">
                An unexpected error has occurred. Our team has been notified.
              </p>
              {this.state.error && (
                <p className="mb-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                  {this.state.error.message}
                </p>
              )}
            </div>
            <div className="space-x-4">
              <Button onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
