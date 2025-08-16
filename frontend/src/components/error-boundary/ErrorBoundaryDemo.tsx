import React, { useState } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { Button } from '../primitives/Button';

// Component that intentionally throws an error
const BuggyComponent: React.FC = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('This is a simulated error for demonstration purposes');
  }

  return (
    <div className="p-6 bg-white rounded-lg border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Buggy Component Demo
      </h3>
      <p className="text-slate-600 mb-4">
        This component can be made to throw an error to demonstrate the ErrorBoundary.
      </p>
      <Button
        variant="secondary"
        onClick={() => setShouldThrow(true)}
        className="bg-red-500 hover:bg-red-600 text-white border-red-500"
      >
        Trigger Error
      </Button>
    </div>
  );
};

export const ErrorBoundaryDemo: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Error Boundary Demo
        </h1>
        <p className="text-slate-600">
          This demonstrates how the ErrorBoundary component catches rendering errors and displays a user-friendly fallback UI.
        </p>
      </div>

      <div className="grid gap-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Normal Component (No Error)
          </h2>
          <ErrorBoundary>
            <BuggyComponent />
          </ErrorBoundary>
        </div>

        <div className="p-4 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            How it works:
          </h3>
          <ul className="text-slate-600 space-y-1 text-sm">
            <li>• Click "Trigger Error" to simulate a component error</li>
            <li>• The ErrorBoundary catches the error and shows a fallback UI</li>
            <li>• Users can click "Try again" to reload the page</li>
            <li>• The boundary logs errors to the console for debugging</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundaryDemo; 