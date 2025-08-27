import React from 'react';
import { DonutChart } from './DonutChart';
import { TrendPoint } from '../../types';

interface ToneData {
  name: string;
  value: number;
  color: string;
}

interface ToneDonutProps {
  data: TrendPoint[];
}

export const ToneDonut: React.FC<ToneDonutProps> = ({ data }) => {
  // Transform the data to show tone distribution
  const toneData: { label: string; value: number }[] = [
    { label: 'Formal', value: 35 },
    { label: 'Academic', value: 28 },
    { label: 'Conversational', value: 22 },
    { label: 'Emotional', value: 15 },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tone Distribution</h3>
      <div className="h-64 flex items-center justify-center">
        <DonutChart
          data={toneData}
          height={200}
          width={200}
          innerRadiusRatio={0.6}
          colors={['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b']}
        />
      </div>
      <p className="text-sm text-gray-500 mt-2 text-center">
        Distribution of writing tone across assignments
      </p>
    </div>
  );
};
