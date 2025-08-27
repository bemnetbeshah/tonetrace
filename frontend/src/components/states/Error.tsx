import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title: string;
  message: string;
  onRetry?: () => void;
  actionSlot?: React.ReactNode;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ title, message, onRetry, actionSlot }) => {
  return (
    <div className="text-center py-12">
      <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
      
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </button>
        )}
        
        {actionSlot && (
          <div className="flex justify-center">
            {actionSlot}
          </div>
        )}
      </div>
    </div>
  );
};
