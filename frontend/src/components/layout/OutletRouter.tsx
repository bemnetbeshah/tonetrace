import React, { useState } from 'react';
import { KPICard } from '../KPICard';
import KPICardDemo from '../KPICardDemo';
import { TrendlineChart } from '../TrendlineChart';
import TrendlineChartDemo from '../TrendlineChartDemo';
import { TonePieChart } from '../TonePieChart';
import TonePieChartDemo from '../TonePieChartDemo';
import { UserGroupIcon, ChartBarIcon, AcademicCapIcon, ClockIcon } from '@heroicons/react/24/outline';

/**
 * OutletRouter Component
 * Showcases our complete component library - KPICard, TrendlineChart, and TonePieChart
 */
export const OutletRouter: React.FC = () => {
  const [showDemo, setShowDemo] = useState<'kpi' | 'trendline' | 'tone-pie' | 'all'>('all');

  // Sample data for trendline chart
  const sampleData = [
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
  ];

  // Sample tone data
  const toneData = [
    { name: 'Formal', value: 45 },
    { name: 'Neutral', value: 30 },
    { name: 'Objective', value: 15 },
    { name: 'Technical', value: 10 }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">ToneTrace Component Library</h1>
        <p className="text-gray-600 mb-6">
          Welcome to our modular component library! Below you'll find our three main components in action.
        </p>
        
        {/* Component Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button 
            onClick={() => setShowDemo('kpi')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              showDemo === 'kpi' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            KPI Cards
          </button>
          <button 
            onClick={() => setShowDemo('trendline')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              showDemo === 'trendline' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Trendline Charts
          </button>
          <button 
            onClick={() => setShowDemo('tone-pie')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              showDemo === 'tone-pie' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Tone Pie Charts
          </button>
          <button 
            onClick={() => setShowDemo('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              showDemo === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Components
          </button>
        </div>
      </div>

      {/* KPI Cards Section */}
      {(showDemo === 'kpi' || showDemo === 'all') && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">KPI Cards Component</h2>
            <p className="text-gray-600 mb-6">
              Modular summary tiles used across pages to display key performance indicators and metrics.
            </p>
            
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <KPICard
                title="Total Students"
                value="1,247"
                icon={<UserGroupIcon className="w-5 h-5" />}
                hint="Active enrollments"
              />
              <KPICard
                title="Average Score"
                value="87.3%"
                icon={<ChartBarIcon className="w-5 h-5" />}
                hint="Last 30 days"
              />
              <KPICard
                title="Assignments"
                value="24"
                icon={<AcademicCapIcon className="w-5 h-5" />}
                hint="This semester"
              />
              <KPICard
                title="Response Time"
                value="2.4h"
                icon={<ClockIcon className="w-5 h-5" />}
                hint="Average feedback"
              />
            </div>

            {/* Interactive Demo */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Demo</h3>
              <KPICardDemo />
            </div>
          </div>
        </div>
      )}

      {/* Trendline Charts Section */}
      {(showDemo === 'trendline' || showDemo === 'all') && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Trendline Charts Component</h2>
            <p className="text-gray-600 mb-6">
              Line charts for time series data like formality trends, sentiment analysis, and readability metrics.
            </p>
            
            {/* Sample Chart */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Formality Trend</h3>
              <TrendlineChart
                data={sampleData}
                label="Formality Trend Over Time"
                height={300}
              />
            </div>

            {/* Interactive Demo */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Demo</h3>
              <TrendlineChartDemo />
            </div>
          </div>
        </div>
      )}

      {/* Tone Pie Charts Section */}
      {(showDemo === 'tone-pie' || showDemo === 'all') && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tone Pie Charts Component</h2>
            <p className="text-gray-600 mb-6">
              Pie charts showing tone distribution in writing analysis with interactive legends and tooltips.
            </p>
            
            {/* Sample Chart */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Tone Distribution</h3>
              <TonePieChart
                data={toneData}
                className="max-w-2xl mx-auto"
              />
            </div>

            {/* Interactive Demo */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Demo</h3>
              <TonePieChartDemo />
            </div>
          </div>
        </div>
      )}

      {/* Component Documentation */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Component Library Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">KPI Cards</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Three states: Loading, Error, Ready</li>
              <li>• Flexible layout with title, icon, value, and hint</li>
              <li>• Full accessibility support</li>
              <li>• Responsive design</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Trendline Charts</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Time series visualization</li>
              <li>• Interactive tooltips</li>
              <li>• Loading and empty states</li>
              <li>• Built with Recharts</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tone Pie Charts</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Tone distribution visualization</li>
              <li>• Right-side legend with colors</li>
              <li>• Interactive tooltips</li>
              <li>• Empty state handling</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}; 