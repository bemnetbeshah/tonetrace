import React, { useState } from 'react';
import { TonePieChart, ToneDataPoint } from './TonePieChart';

export const TonePieChartDemo: React.FC = () => {
  const [selectedDataset, setSelectedDataset] = useState<'academic' | 'business' | 'creative' | 'empty'>('academic');

  // Sample tone datasets
  const toneDatasets: Record<string, ToneDataPoint[]> = {
    academic: [
      { name: 'Formal', value: 45 },
      { name: 'Neutral', value: 30 },
      { name: 'Objective', value: 15 },
      { name: 'Technical', value: 10 }
    ],
    business: [
      { name: 'Professional', value: 40 },
      { name: 'Confident', value: 25 },
      { name: 'Friendly', value: 20 },
      { name: 'Assertive', value: 15 }
    ],
    creative: [
      { name: 'Enthusiastic', value: 35 },
      { name: 'Playful', value: 25 },
      { name: 'Inspirational', value: 20 },
      { name: 'Casual', value: 15 },
      { name: 'Humorous', value: 5 }
    ],
    empty: []
  };

  const getDatasetDescription = (dataset: string) => {
    switch (dataset) {
      case 'academic':
        return 'Academic writing typically shows formal, objective tones with technical language.';
      case 'business':
        return 'Business communication emphasizes professional, confident tones for credibility.';
      case 'creative':
        return 'Creative content uses enthusiastic, playful tones to engage and inspire.';
      case 'empty':
        return 'Empty dataset to demonstrate the "No tone data" state.';
      default:
        return '';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tone Pie Chart Component Demo</h2>
        
        {/* Dataset Selector */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSelectedDataset('academic')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              selectedDataset === 'academic' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Academic
          </button>
          <button
            onClick={() => setSelectedDataset('business')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              selectedDataset === 'business' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Business
          </button>
          <button
            onClick={() => setSelectedDataset('creative')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              selectedDataset === 'creative' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Creative
          </button>
          <button
            onClick={() => setSelectedDataset('empty')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              selectedDataset === 'empty' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Empty
          </button>
        </div>

        {/* Dataset Description */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {selectedDataset.charAt(0).toUpperCase() + selectedDataset.slice(1)} Writing Tones
          </h3>
          <p className="text-gray-700 text-sm">
            {getDatasetDescription(selectedDataset)}
          </p>
        </div>
      </div>

      {/* Chart Display */}
      <div className="space-y-6">
        <TonePieChart
          data={toneDatasets[selectedDataset]}
          className="max-w-4xl mx-auto"
        />
        
        {/* Data Table */}
        {selectedDataset !== 'empty' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {toneDatasets[selectedDataset].map((item, index) => {
                    const total = toneDatasets[selectedDataset].reduce((sum, i) => sum + i.value, 0);
                    const percentage = ((item.value / total) * 100).toFixed(1);
                    
                    return (
                      <tr key={item.name}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-3"
                              style={{ 
                                backgroundColor: [
                                  '#6C5CE7', '#A78BFA', '#10B981', '#F59E0B', 
                                  '#EF4444', '#3B82F6', '#8B5CF6', '#06B6D4', 
                                  '#84CC16', '#F97316'
                                ][index % 10] 
                              }}
                            />
                            <span className="text-sm font-medium text-gray-900">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.value}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {percentage}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Documentation */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Component Features</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• <strong>Pie Chart Visualization:</strong> Shows tone distribution with custom colors</li>
          <li>• <strong>Right Side Legend:</strong> Colored dots with tone labels</li>
          <li>• <strong>Interactive Tooltips:</strong> Hover to see tone details and percentages</li>
          <li>• <strong>Empty State:</strong> Shows "No tone data" message when no data</li>
          <li>• <strong>Accessibility:</strong> role="img", aria-label, proper test IDs</li>
          <li>• <strong>Responsive Design:</strong> Adapts to container width</li>
        </ul>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Integration Points</h4>
          <p className="text-sm text-blue-800">
            Ready for integration with <code className="bg-blue-100 px-1 rounded">api.profileHistory('tone')</code> or{' '}
            <code className="bg-blue-100 px-1 rounded">toneDistribution</code> from latest analysis.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TonePieChartDemo; 