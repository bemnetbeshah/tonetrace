import React from 'react';
import { LineChart } from './charts/LineChart';

export interface TrendlineDataPoint {
  date: string;
  value: number;
}

export interface TrendlineChartProps {
  data: TrendlineDataPoint[];
  height?: number;
  label?: string;
  loading?: boolean;
  className?: string;
}

export const TrendlineChart: React.FC<TrendlineChartProps> = ({
  data,
  height = 192,
  label,
  loading = false,
  className = ''
}) => {
  // Loading state - grey block skeleton
  if (loading) {
    return (
      <div
        className={`bg-gray-200 rounded-lg animate-pulse ${className}`}
        style={{ height: `${height}px` }}
        role="img"
        aria-label="Trend over time loading"
      />
    );
  }

  // Empty state - show muted message
  if (!data || data.length === 0) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 ${className}`}
        style={{ height: `${height}px` }}
        role="img"
        aria-label="Trend over time - no data"
      >
        <p className="text-gray-500 text-sm">No data yet</p>
      </div>
    );
  }

  // Transform data for our LineChart
  const chartData = data.map(point => ({
    x: new Date(point.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }),
    y: point.value
  }));

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}
      role="img"
      aria-label="Trend over time"
      data-testid="trendline-chart"
    >
      {label && (
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          {label}
        </h3>
      )}
      
      <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
        <LineChart
          data={chartData}
          height={height - 40}
          width={300}
          color="#3b82f6"
          strokeWidth={2}
        />
      </div>
    </div>
  );
};

export default TrendlineChart; 