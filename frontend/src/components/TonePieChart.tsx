import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

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

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const total = data.payload.value;
      const percentage = ((data.payload.value / data.payload.total) * 100).toFixed(1);
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-600 text-sm">{`Tone: ${data.name}`}</p>
          <p className="text-gray-900 font-medium">{`Value: ${total}`}</p>
          <p className="text-gray-700 text-sm">{`Percentage: ${percentage}%`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom legend component
  const CustomLegend = ({ payload }: any) => {
    if (!payload) return null;

    return (
      <div className="space-y-2" data-testid="tone-legend">
        {payload.map((entry: any, index: number) => (
          <div key={entry.value} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-700">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  // Calculate total for percentage calculations
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Add total to each data point for tooltip calculations
  const chartData = data.map(item => ({ ...item, total }));

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}
      role="img"
      aria-label="Tone distribution pie chart"
      data-testid="tone-pie-chart"
    >
      <div className="flex items-start space-x-6">
        {/* Pie Chart */}
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex-shrink-0">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Tone Distribution</h3>
          <CustomLegend payload={chartData.map((entry, index) => ({
            value: entry.name,
            color: COLORS[index % COLORS.length]
          }))} />
        </div>
      </div>
    </div>
  );
};

export default TonePieChart; 