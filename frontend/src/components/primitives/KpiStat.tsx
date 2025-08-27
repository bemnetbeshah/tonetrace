import React from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

interface KpiStatProps {
  label: string;
  value: string | number;
  delta?: {
    value: number;
    direction: 'up' | 'down';
  };
  className?: string;
}

export const KpiStat: React.FC<KpiStatProps> = ({
  label,
  value,
  delta,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        {delta && (
          <div className={`flex items-center text-sm font-medium ${
            delta.direction === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {delta.direction === 'up' ? (
              <ChevronUpIcon className="w-4 h-4 mr-1" />
            ) : (
              <ChevronDownIcon className="w-4 h-4 mr-1" />
            )}
            {delta.value}
          </div>
        )}
      </div>
    </div>
  );
};
