import React from 'react';
import { CardSkeleton } from './CardSkeleton';
import { RowSkeleton } from './RowSkeleton';
import { ChartSkeleton } from './ChartSkeleton';

export const SkeletonsDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Skeleton Components</h1>
        <p className="text-lg text-gray-600">
          Consistent loading placeholders for better user experience
        </p>
      </div>

      {/* Card Skeletons Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Card Skeletons</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>

      {/* Row Skeletons Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Row Skeletons</h2>
        <div className="space-y-2">
          <RowSkeleton count={6} />
        </div>
      </div>

      {/* Chart Skeletons Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Chart Skeletons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>

      {/* Combined Layout Example */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Combined Layout Example</h2>
        <div className="space-y-6">
          {/* Header with cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
          
          {/* Content area with chart and rows */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <ChartSkeleton />
            </div>
            <div className="space-y-2">
              <RowSkeleton count={4} />
            </div>
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Usage Instructions</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>• <strong>CardSkeleton</strong>: Use for loading states of card components</p>
          <p>• <strong>RowSkeleton</strong>: Use for loading states of table rows or list items</p>
          <p>• <strong>ChartSkeleton</strong>: Use for loading states of charts and graphs</p>
          <p>• All skeletons support custom className and count props for flexibility</p>
          <p>• Skeletons automatically show while api.* mock methods await the fake delay</p>
        </div>
      </div>
    </div>
  );
};

export default SkeletonsDemo; 