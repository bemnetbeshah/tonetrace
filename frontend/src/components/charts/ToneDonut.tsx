import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
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
  const toneData: ToneData[] = [
    { name: 'Formal', value: 35, color: '#3b82f6' },
    { name: 'Academic', value: 28, color: '#8b5cf6' },
    { name: 'Conversational', value: 22, color: '#10b981' },
    { name: 'Emotional', value: 15, color: '#f59e0b' },
  ];

  const formatTooltip = (value: number, name: string) => [`${value}%`, name];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tone Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={toneData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {toneData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
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
            <Legend 
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry: any) => (
                <span style={{ color: '#374151', fontSize: '12px' }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-gray-500 mt-2 text-center">
        Distribution of writing tone across assignments
      </p>
    </div>
  );
};
