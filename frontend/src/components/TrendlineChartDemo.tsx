import React, { useState } from 'react';
import { TrendlineChart, TrendlineDataPoint } from './TrendlineChart';

export const TrendlineChartDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataType, setDataType] = useState<'formality' | 'sentiment' | 'readability'>('formality');

  // Sample data for different metrics
  const sampleData: Record<string, TrendlineDataPoint[]> = {
    formality: [
      { date: '2024-01-01', value: 0.65 },
      { date: '2024-01-08', value: 0.72 },
      { date: '2024-01-15', value: 0.68 },
      { date: '2024-01-22', value: 0.75 },
      { date: '2024-01-29', value: 0.71 },
      { date: '2024-02-05', value: 0.78 },
      { date: '2024-02-12', value: 0.82 },
      { date: '2024-02-19', value: 0.79 },
      { date: '2024-02-26', value: 0.85 },
      { date: '2024-03-05', value: 0.88 }
    ],
    sentiment: [
      { date: '2024-01-01', value: 0.45 },
      { date: '2024-01-08', value: 0.52 },
      { date: '2024-01-15', value: 0.48 },
      { date: '2024-01-22', value: 0.61 },
      { date: '2024-01-29', value: 0.58 },
      { date: '2024-02-05', value: 0.67 },
      { date: '2024-02-12', value: 0.71 },
      { date: '2024-02-19', value: 0.69 },
      { date: '2024-02-26', value: 0.74 },
      { date: '2024-03-05', value: 0.76 }
    ],
    readability: [
      { date: '2024-01-01', value: 0.78 },
      { date: '2024-01-08', value: 0.82 },
      { date: '2024-01-15', value: 0.79 },
      { date: '2024-01-22', value: 0.85 },
      { date: '2024-01-29', value: 0.83 },
      { date: '2024-02-05', value: 0.87 },
      { date: '2024-02-12', value: 0.89 },
      { date: '2024-02-19', value: 0.86 },
      { date: '2024-02-26', value: 0.91 },
      { date: '2024-03-05', value: 0.93 }
    ]
  };

  const getLabel = (type: string) => {
    switch (type) {
      case 'formality': return 'Formality Trend';
      case 'sentiment': return 'Sentiment Trend';
      case 'readability': return 'Readability Trend';
      default: return 'Trend';
    }
  };

  const handleLoadingToggle = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Trendline Chart Component Demo</h2>
        
        {/* Controls */}
        <div className="flex gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Type
            </label>
            <select
              value={dataType}
              onChange={(e) => setDataType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="formality">Formality</option>
              <option value="sentiment">Sentiment</option>
              <option value="readability">Readability</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Actions
            </label>
            <button
              onClick={handleLoadingToggle}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
            >
              Simulate Loading
            </button>
          </div>
        </div>
      </div>

      {/* Chart Display */}
      <div className="space-y-6">
        <TrendlineChart
          data={sampleData[dataType]}
          label={getLabel(dataType)}
          height={300}
          loading={loading}
        />
        
        {/* Empty State Demo */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Empty State Demo</h3>
          <TrendlineChart
            data={[]}
            label="No Data Example"
            height={200}
          />
        </div>
      </div>

      {/* Documentation */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Component Features</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• <strong>Data Visualization:</strong> Line chart for time series data</li>
          <li>• <strong>States:</strong> Loading (skeleton), Empty (no data message), Ready (chart display)</li>
          <li>• <strong>Interactions:</strong> Hover tooltip shows date and value</li>
          <li>• <strong>Accessibility:</strong> role="img", aria-label, proper test IDs</li>
          <li>• <strong>Responsive:</strong> Adapts to container width</li>
          <li>• <strong>Customizable:</strong> Height, label, and styling options</li>
        </ul>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Integration Points</h4>
          <p className="text-sm text-blue-800">
            Ready for integration with <code className="bg-blue-100 px-1 rounded">api.history</code> or{' '}
            <code className="bg-blue-100 px-1 rounded">api.profileHistory('formality')</code> to supply the data array.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrendlineChartDemo; 