import React from 'react';
import { DonutChart } from './charts/DonutChart';

export interface ToneDataPoint {
  name: string;
  value: number;
}

export interface TonePieChartProps {
  data: ToneDataPoint[];
  className?: string;
}

export const TonePieChart: React.FC<TonePieChartProps> = ({
  data,
  className = ''
}) => {
  // Color palette for different tones
  const COLORS = [
    '#6C5CE7', // Primary purple
    '#A78BFA', // Light purple
    '#10B981', // Success green
    '#F59E0B', // Warning orange
    '#EF4444', // Danger red
    '#3B82F6', // Blue
    '#8B5CF6', // Violet
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316'  // Orange
  ];

  // Empty state - show message when no data
  if (!data || data.length === 0) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 h-64 ${className}`}
        role="img"
        aria-label="Tone distribution pie chart - no data"
        data-testid="tone-pie-chart"
      >
        <p className="text-gray-500 text-sm">No tone data</p>
      </div>
    );
  }

  // Transform data for our DonutChart
  const chartData = data.map(item => ({
    label: item.name,
    value: item.value
  }));

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}
      role="img"
      aria-label="Tone distribution pie chart"
      data-testid="tone-pie-chart"
    >
      <div className="flex items-start space-x-6">
        {/* Donut Chart */}
        <div className="flex-1">
          <div className="flex items-center justify-center h-48">
            <DonutChart
              data={chartData}
              height={180}
              width={180}
              innerRadiusRatio={0.6}
              colors={COLORS}
            />
          </div>
        </div>

        {/* Legend */}
        <div className="flex-shrink-0">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Tone Distribution</h4>
          <div className="space-y-2" data-testid="tone-legend">
            {chartData.map((item, index) => (
              <div key={item.label} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TonePieChart; 