import React from 'react';
import { RowSkeleton } from './RowSkeleton';

export const RowSkeletonDemo: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Single Row Skeleton</h3>
        <RowSkeleton />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Multiple Row Skeletons</h3>
        <div className="space-y-2">
          <RowSkeleton count={5} />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Table-like Layout</h3>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="space-y-2">
            <RowSkeleton count={4} className="rounded" />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Styling</h3>
        <div className="space-y-2">
          <RowSkeleton className="bg-blue-100 rounded" />
          <RowSkeleton className="bg-green-100 rounded" />
          <RowSkeleton className="bg-purple-100 rounded" />
        </div>
      </div>
    </div>
  );
};

export default RowSkeletonDemo; 