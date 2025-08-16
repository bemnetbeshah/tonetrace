import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface PageErrorBoundaryProps {
  children: React.ReactNode;
  pageName?: string;
}

/**
 * PageErrorBoundary Component
 * Specialized error boundary for wrapping page routes with enhanced error context
 */
export const PageErrorBoundary: React.FC<PageErrorBoundaryProps> = ({ 
  children, 
  pageName = 'this page' 
}) => {
  // Custom fallback UI for page-level errors
  const PageErrorFallback = () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">
            Page Error
          </h2>
          <p className="text-slate-600 mb-4">
            {pageName} encountered an unexpected error.
          </p>
          <p className="text-slate-600 mb-6">
            Please try refreshing the page or contact support if the problem persists.
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-[#6C5CE7] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            Refresh Page
          </button>
          <button
            onClick={() => window.history.back()}
            className="w-full bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary fallback={<PageErrorFallback />}>
      {children}
    </ErrorBoundary>
  );
};

export default PageErrorBoundary; 