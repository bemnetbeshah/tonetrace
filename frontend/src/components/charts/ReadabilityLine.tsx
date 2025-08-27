import React from 'react';
import { LineChart } from './LineChart';
import { TrendPoint } from '../../types';

interface ReadabilityLineProps {
  data: TrendPoint[];
}

export const ReadabilityLine: React.FC<ReadabilityLineProps> = ({ data }) => {
  console.log('ReadabilityLine: Received data:', data);
  
  try {
    // Validate data
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.warn('ReadabilityLine: Invalid or empty data:', data);
      return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Readability Trends</h3>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">No data available</p>
          </div>
        </div>
      );
    }

    // Transform data for our LineChart
    const chartData = data.map(item => ({
      x: item.label,
      y: item.value
    }));

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Readability Trends</h3>
        <div className="h-64 flex items-center justify-center">
          <LineChart
            data={chartData}
            height={200}
            width={300}
            color="#3b82f6"
            strokeWidth={3}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2 text-center">
          Flesch-Kincaid Grade Level over time
        </p>
      </div>
    );
  } catch (error) {
    console.error('ReadabilityLine: Error rendering chart:', error);
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Readability Trends</h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-red-500">Error rendering chart</p>
        </div>
      </div>
    );
  }
};
