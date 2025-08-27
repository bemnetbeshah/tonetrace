import React from 'react';

export interface RowSkeletonProps {
  className?: string;
  count?: number;
}

export const RowSkeleton: React.FC<RowSkeletonProps> = ({ 
  className = '', 
  count = 1 
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`h-10 bg-slate-100 animate-pulse ${className}`}
          data-testid="row-skeleton"
        />
      ))}
    </>
  );
};

export default RowSkeleton; 