import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => window.location.reload();
  handleGoHome = () => window.location.assign('/');

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto" aria-hidden />
            <h1 className="text-xl font-semibold text-gray-900">Something went wrong</h1>
            <p className="text-gray-600 text-sm">
              An unexpected error occurred. You can try reloading the page or go back home.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={this.handleReload} variant="default" className="inline-flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Reload page
              </Button>
              <Button onClick={this.handleGoHome} variant="outline" className="inline-flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go home
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
