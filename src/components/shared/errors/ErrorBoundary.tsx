import React, { ReactNode } from "react";
import { MdOutlineHome } from "react-icons/md";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center px-4">
          <div className="max-w-3xl w-full">
            {/* Main Content */}
            <div className="text-center">
              {/* Animated Crash Icon */}
              <div className="mb-8 relative">
                <h1 className="text-9xl font-bold text-red-200/40 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
                  OOPS
                </h1>
                <div className="relative z-10 flex items-center justify-center gap-4">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center animate-bounce">
                    <span className="text-4xl">💥</span>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              <h2 className="text-4xl font-Jost font-bold text-gray-900 mb-3">
                Something Went Wrong
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed font-Jost">
                We encountered an unexpected error while processing your
                request. Our team has been notified and is looking into it.
              </p>

              {/* Decorative Line */}
              <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-pink-400 mx-auto mb-8 rounded-full"></div>

              {/* Error Details Box - Only show in development */}
              {import.meta.env.NODE_ENV === "development" &&
                this.state.error && (
                  <div className="bg-red-50 rounded-lg border border-red-300 p-6 mb-8 text-left max-h-96 overflow-y-auto">
                    <details className="cursor-pointer">
                      <summary className="font-semibold text-red-900 hover:text-red-700 transition-colors mb-4">
                        Error Details (Development Only)
                      </summary>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-Inter text-red-800 font-semibold mb-2">
                            Error Message:
                          </p>
                          <code className="block bg-red-100 text-red-900 p-3 rounded text-xs font-mono overflow-x-auto">
                            {this.state.error.toString()}
                          </code>
                        </div>
                        {this.state.errorInfo && (
                          <div>
                            <p className="text-xs font-Inter text-red-800 font-semibold mb-2">
                              Component Stack:
                            </p>
                            <code className="block bg-red-100 text-red-900 p-3 rounded text-xs font-mono overflow-x-auto">
                              {this.state.errorInfo.componentStack}
                            </code>
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-Inter text-red-800 font-semibold mb-2">
                            Stack Trace:
                          </p>
                          <code className="block bg-red-100 text-red-900 p-3 rounded text-xs font-mono overflow-x-auto">
                            {this.state.error.stack}
                          </code>
                        </div>
                      </div>
                    </details>
                  </div>
                )}

              {/* Suggestions Box */}
              <div className="bg-white rounded-lg border-l-4 border-red-500 p-6 mb-8 text-left shadow-md">
                <p className="font-semibold text-gray-900 mb-3">
                  What you can try:
                </p>
                <ul className="space-y-2 text-sm text-gray-600 font-Inter">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold mt-1">•</span>
                    <span>Refresh the page and try again</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold mt-1">•</span>
                    <span>Clear your browser cache and cookies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold mt-1">•</span>
                    <span>Try opening the page in a different browser</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold mt-1">•</span>
                    <span>Contact support if the problem persists</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={this.handleReset}
                  className="group flex items-center justify-center gap-2 px-8 py-3 bg-ug-blue text-white font-Jost font-semibold rounded-lg hover:bg-blue-900 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <MdOutlineHome className="size-5" />
                  Return to Home
                </button>

                <button
                  onClick={() => window.location.reload()}
                  className="group flex items-center justify-center gap-2 px-8 py-3 bg-gray-200 text-gray-800 font-Jost font-semibold rounded-lg hover:bg-gray-300 transition-all duration-300 transform hover:scale-105"
                >
                  <span>🔄</span>
                  Refresh Page
                </button>
              </div>
            </div>

            {/* Footer Message */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 font-Inter">
                Need assistance? Please{" "}
                <a
                  href="mailto:support@example.com"
                  className="text-ug-blue hover:underline font-semibold"
                >
                  contact our support team
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
