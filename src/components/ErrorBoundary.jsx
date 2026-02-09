import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
    
    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-forest-50 dark:bg-forest-950 px-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white dark:bg-forest-800 rounded-2xl shadow-xl border border-forest-200 dark:border-forest-700 p-8">
              {/* Error Icon */}
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-error-100 dark:bg-error-900/30 rounded-full">
                  <AlertTriangle className="w-12 h-12 text-error-600 dark:text-error-400" />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-forest-800 dark:text-forest-100 text-center mb-4">
                Oops! Something went wrong
              </h1>

              {/* Description */}
              <p className="text-forest-600 dark:text-forest-400 text-center mb-6">
                We encountered an unexpected error. Don't worry, it's not your fault!
              </p>

              {/* Error Message (Development Mode) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg p-4 mb-6">
                  <h3 className="text-sm font-semibold text-error-800 dark:text-error-200 mb-2">
                    Error Details (Dev Mode):
                  </h3>
                  <pre className="text-xs text-error-700 dark:text-error-300 overflow-x-auto">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="text-xs text-error-600 dark:text-error-400 cursor-pointer hover:text-error-800">
                        Component Stack
                      </summary>
                      <pre className="text-xs text-error-600 dark:text-error-400 mt-2 overflow-x-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={this.handleReload}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-forest-gradient text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  <RefreshCw className="w-5 h-5" />
                  Reload Page
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-forest-300 dark:border-forest-600 text-forest-700 dark:text-forest-300 font-semibold rounded-lg hover:bg-forest-50 dark:hover:bg-forest-700 transition-colors"
                >
                  <Home className="w-5 h-5" />
                  Go to Home
                </button>
              </div>

              {/* Help Text */}
              <p className="text-sm text-forest-600 dark:text-forest-400 text-center mt-6">
                If this problem persists, please contact support or try clearing your browser cache.
              </p>
            </div>

            {/* Debug Info (Development Only) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 text-center">
                <p className="text-xs text-forest-500 dark:text-forest-400">
                  💡 This detailed error view is only visible in development mode
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
