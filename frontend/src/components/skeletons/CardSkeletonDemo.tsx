import React from 'react';
import { CardSkeleton } from './CardSkeleton';

export const CardSkeletonDemo: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Single Card Skeleton</h3>
        <CardSkeleton />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Multiple Card Skeletons</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CardSkeleton count={3} />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Styling</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CardSkeleton className="bg-blue-100" />
          <CardSkeleton className="bg-green-100" />
        </div>
      </div>
    </div>
  );
};

export default CardSkeletonDemo; 