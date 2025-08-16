import React from 'react';

interface CardSkeletonProps {
  className?: string;
  count?: number;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ 
  className = '', 
  count = 1 
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`h-28 rounded-xl bg-slate-100 animate-pulse ${className}`}
          data-testid="card-skeleton"
        />
      ))}
    </>
  );
};

export default CardSkeleton; 