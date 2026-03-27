import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './UI';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-rose-50 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-rose-100 mb-6">
            <AlertCircle className="text-rose-500" size={40} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">Something went wrong</h1>
          <p className="text-slate-600 mb-8 max-w-xs mx-auto text-sm font-medium leading-relaxed">
            We're sorry for the inconvenience. Our AI doctor is looking into it.
          </p>
          <Button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-8 py-4 bg-rose-500 text-white rounded-full font-bold shadow-lg shadow-rose-500/20"
          >
            <RefreshCw size={20} />
            Reload Application
          </Button>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-8 p-4 bg-slate-900 text-rose-300 text-left text-xs rounded-xl overflow-auto max-w-full">
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
