import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendPoint } from '../../types';

interface ReadabilityLineProps {
  data: TrendPoint[];
}

export const ReadabilityLine: React.FC<ReadabilityLineProps> = ({ data }) => {
  console.log('ReadabilityLine: Received data:', data);
  
  const formatTooltip = (value: number) => [`Grade ${value.toFixed(1)}`, 'Readability'];

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

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Readability Trends</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="label" 
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
                domain={[0, 'dataMax + 2']}
                tickFormatter={(value) => `Grade ${value}`}
              />
              <Tooltip 
                formatter={formatTooltip}
                labelStyle={{ color: '#374151' }}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
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
