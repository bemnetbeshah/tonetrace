import React, { useState } from 'react';
import { KPICard } from '../KPICard';
import KPICardDemo from '../KPICardDemo';
import { TrendlineChart } from '../TrendlineChart';
import TrendlineChartDemo from '../TrendlineChartDemo';
import { TonePieChart } from '../TonePieChart';
import TonePieChartDemo from '../TonePieChartDemo';
import AssignmentsPageDemo from '../AssignmentsPageDemo';
import SkeletonsDemo from '../skeletons/SkeletonsDemo';
import PrimitivesDemo from '../primitives/PrimitivesDemo';
import ErrorBoundaryDemo from '../error-boundary/ErrorBoundaryDemo';
import RoutingDemo from '../../routing/RoutingDemo';
import AccessibilityDemo from '../../accessibility/AccessibilityDemo';
import ContractsDemo from '../../contracts/ContractsDemo';
// import ToastDemo from '../toast/ToastDemo';
import { UserGroupIcon, ChartBarIcon, AcademicCapIcon, ClockIcon } from '@heroicons/react/24/outline';

/**
 * OutletRouter Component
 * Showcases our complete component library - KPICard, TrendlineChart, TonePieChart, AssignmentsPage, Skeletons, Primitives, and Toast
 */
export const OutletRouter: React.FC = () => {
  const [showDemo, setShowDemo] = useState<'kpi' | 'trendline' | 'tone-pie' | 'assignments' | 'skeletons' | 'primitives' | 'toast' | 'error-boundary' | 'routing' | 'accessibility' | 'contracts' | 'all'>('all');

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
          Welcome to our modular component library! Below you'll find our main components in action.
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
            onClick={() => setShowDemo('assignments')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              showDemo === 'assignments' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Assignments Page
          </button>
          <button 
            onClick={() => setShowDemo('skeletons')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              showDemo === 'skeletons' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Skeletons
          </button>
          <button 
            onClick={() => setShowDemo('primitives')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              showDemo === 'primitives' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Primitives
          </button>
          <button 
            onClick={() => setShowDemo('toast')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              showDemo === 'toast' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Toast
          </button>
          <button 
            onClick={() => setShowDemo('error-boundary')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              showDemo === 'error-boundary' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Error Boundary
          </button>
          <button 
            onClick={() => setShowDemo('routing')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              showDemo === 'routing' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Routing
          </button>
          <button 
            onClick={() => setShowDemo('accessibility')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              showDemo === 'accessibility' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Accessibility
          </button>
          <button 
            onClick={() => setShowDemo('contracts')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              showDemo === 'contracts' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Contracts
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

      {/* Assignments Page Section */}
      {(showDemo === 'assignments' || showDemo === 'all') && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Assignments Page Component</h2>
            <p className="text-gray-600 mb-6">
              A dedicated page for managing assignments with per-row analysis actions and clean, modular design.
            </p>
            
            {/* Interactive Demo */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Demo</h3>
              <AssignmentsPageDemo />
            </div>
          </div>
        </div>
      )}

      {/* Skeletons Section */}
      {(showDemo === 'skeletons' || showDemo === 'all') && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Skeleton Components</h2>
            <p className="text-gray-600 mb-6">
              Consistent loading placeholders that provide better user experience while data is being fetched.
            </p>
            
            {/* Interactive Demo */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Demo</h3>
              <SkeletonsDemo />
            </div>
          </div>
        </div>
      )}

      {/* Primitives Section */}
      {(showDemo === 'primitives' || showDemo === 'all') && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Primitive Components</h2>
            <p className="text-gray-600 mb-6">
              Small, reusable components used across the application for consistent UI patterns.
            </p>
            
            {/* Interactive Demo */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Demo</h3>
              <PrimitivesDemo />
            </div>
          </div>
        </div>
      )}

      {/* Toast Section */}
      {(showDemo === 'toast' || showDemo === 'all') && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Toast Notifications</h2>
            <p className="text-gray-600 mb-6">
              Non-blocking feedback system for user actions with auto-dismiss functionality.
            </p>
            
            {/* Interactive Demo */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Demo</h3>
              {/* <ToastDemo /> */}
            </div>
          </div>
        </div>
      )}

      {/* Error Boundary Section */}
      {(showDemo === 'error-boundary' || showDemo === 'all') && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Error Boundary Component</h2>
            <p className="text-gray-600 mb-6">
              Catches rendering errors and shows a friendly message with recovery options.
            </p>
            
            {/* Interactive Demo */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Demo</h3>
              <ErrorBoundaryDemo />
            </div>
          </div>
        </div>
      )}

      {/* Routing Section */}
      {(showDemo === 'routing' || showDemo === 'all') && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Routing System</h2>
            <p className="text-gray-600 mb-6">
              Centralized routing configuration with automatic page title updates.
            </p>
            
            {/* Interactive Demo */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Demo</h3>
              <RoutingDemo />
            </div>
          </div>
        </div>
      )}

      {/* Accessibility Section */}
      {(showDemo === 'accessibility' || showDemo === 'all') && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Accessibility & Keyboard Navigation</h2>
            <p className="text-gray-600 mb-6">
              Consistent patterns for keyboard and ARIA support across all components.
            </p>
            
            {/* Interactive Demo */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Demo</h3>
              <AccessibilityDemo />
            </div>
          </div>
        </div>
      )}

      {/* Contracts Section */}
      {(showDemo === 'contracts' || showDemo === 'all') && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Contracts & API Migration</h2>
            <p className="text-gray-600 mb-6">
              Document what each page expects from the service layer so swapping mocks to real APIs is risk-free.
            </p>
            
            {/* Interactive Demo */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Demo</h3>
              <ContractsDemo />
            </div>
          </div>
        </div>
      )}

      {/* Component Documentation */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Component Library Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
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
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Assignments Page</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Dedicated assignments management</li>
              <li>• Per-row analysis actions</li>
              <li>• Loading states and empty handling</li>
              <li>• Modular component design</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Skeletons</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Consistent loading placeholders</li>
              <li>• Card, row, and chart variants</li>
              <li>• Customizable styling and counts</li>
              <li>• Smooth pulse animations</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Primitives</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Button with variants and sizes</li>
              <li>• Badge with semantic tones</li>
              <li>• Consistent styling patterns</li>
              <li>• Full accessibility support</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Toast</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Non-blocking notifications</li>
              <li>• Info, success, and error types</li>
              <li>• Auto-dismiss with manual control</li>
              <li>• Top-right positioning</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Error Boundary</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Catches rendering errors gracefully</li>
              <li>• User-friendly fallback UI</li>
              <li>• Retry functionality with route reload</li>
              <li>• Customizable error handling</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Routing System</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Single source for routes and titles</li>
              <li>• Automatic page title updates</li>
              <li>• Dynamic route support</li>
              <li>• Centralized navigation config</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Accessibility</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Keyboard navigation support</li>
              <li>• ARIA labels and roles</li>
              <li>• Focus management</li>
              <li>• Screen reader support</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Contracts</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• API endpoint documentation</li>
              <li>• Data transformation utilities</li>
              <li>• Migration validation</li>
              <li>• Risk-free API swapping</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}; 