import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // You can log to an error reporting service here
    // e.g., Sentry, LogRocket, etc.
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#1C1C1C] rounded-lg p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-[#F2F2F2] mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-[#D9D9D9] mb-6">
              We're sorry for the inconvenience. The application encountered an unexpected error.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#00C2A8] text-white px-6 py-3 rounded-lg hover:bg-[#00A693] transition-colors font-medium"
            >
              Reload Application
            </button>
            {this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-[#B0B0B0] cursor-pointer hover:text-[#D9D9D9] text-sm">
                  Technical Details
                </summary>
                <pre className="mt-2 p-4 bg-[#121212] rounded text-xs text-red-400 overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
