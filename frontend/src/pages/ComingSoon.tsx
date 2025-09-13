import React from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

/**
 * Coming Soon Page Component
 * Displays a placeholder page for upcoming features
 */
export const ComingSoon: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary-soft rounded-full flex items-center justify-center">
            <ClockIcon className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Coming Soon
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          We're working hard to bring you new features and improvements. 
          This page will be available soon!
        </p>

        {/* Additional Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">
            Stay tuned for updates and exciting new functionality.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
