import React from 'react';

export interface ChartSkeletonProps {
  className?: string;
  count?: number;
}

export const ChartSkeleton: React.FC<ChartSkeletonProps> = ({ 
  className = '', 
  count = 1 
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`h-48 bg-slate-100 animate-pulse ${className}`}
          data-testid="chart-skeleton"
        />
      ))}
    </>
  );
};

export default ChartSkeleton; 