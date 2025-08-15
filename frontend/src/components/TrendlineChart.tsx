import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

  // Format data for Recharts
  const chartData = data.map(point => ({
    ...point,
    // Ensure date is properly formatted for display
    formattedDate: new Date(point.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }));

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-600 text-sm">{`Date: ${label}`}</p>
          <p className="text-gray-900 font-medium">{`Value: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

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
      
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="formattedDate"
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => value.toFixed(1)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#6c5ce7"
            strokeWidth={2}
            dot={{ fill: '#6c5ce7', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#6c5ce7', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendlineChart; 