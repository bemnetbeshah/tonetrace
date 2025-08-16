import React from 'react';
import { ChartSkeleton } from './ChartSkeleton';

export const ChartSkeletonDemo: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Single Chart Skeleton</h3>
        <ChartSkeleton />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Multiple Chart Skeletons</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartSkeleton count={2} />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Layout</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ChartSkeleton className="rounded-lg" />
          <ChartSkeleton className="rounded-lg" />
          <ChartSkeleton className="rounded-lg" />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Styling</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartSkeleton className="bg-blue-100 rounded-lg" />
          <ChartSkeleton className="bg-green-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default ChartSkeletonDemo; 