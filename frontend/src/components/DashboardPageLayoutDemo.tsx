import React, { useState } from 'react';
import DashboardPageLayout from './DashboardPageLayout';

export const DashboardPageLayoutDemo: React.FC = () => {
  const [demoMode, setDemoMode] = useState<'normal' | 'loading' | 'error' | 'empty'>('normal');

  const handleDemoModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDemoMode(event.target.value as 'normal' | 'loading' | 'error' | 'empty');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Page Layout Demo</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive teacher dashboard with KPI metrics, charts, and insights
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Demo Controls */}
        <div className="p-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Demo Controls</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <div>
                <label htmlFor="demo-mode" className="block text-sm font-medium text-gray-700 mb-1">
                  Demo Mode:
                </label>
                <select
                  id="demo-mode"
                  value={demoMode}
                  onChange={handleDemoModeChange}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="normal">Normal Dashboard</option>
                  <option value="loading">Loading State</option>
                  <option value="error">Error State</option>
                  <option value="empty">Empty State (No Students)</option>
                </select>
              </div>
              
              <div className="text-sm text-gray-600">
                <strong>Current Mode:</strong> {demoMode.charAt(0).toUpperCase() + demoMode.slice(1)}
              </div>
            </div>
          </div>

          {/* Demo Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Dashboard Features:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-medium mb-2">📊 KPI Row (5 columns)</h4>
                <ul className="space-y-1">
                  <li>• Average Formality (0-100 scale)</li>
                  <li>• Average Complexity (0-100 scale)</li>
                  <li>• Average Readability (FK grade level)</li>
                  <li>• Assignments Submitted (total count)</li>
                  <li>• AI Use Alerts (anomaly count)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">📈 Charts Row (2 columns)</h4>
                <ul className="space-y-1">
                  <li>• Class Progress Trends (TrendlineChart)</li>
                  <li>• Tone Distribution (TonePieChart)</li>
                </ul>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-medium mb-2">🔍 Insights Row (2 columns)</h4>
              <ul className="space-y-1 text-sm">
                <li>• Common Grammar Issues (IssuesBar)</li>
                <li>• Assignments Status (AssignmentsListCard)</li>
              </ul>
            </div>
          </div>

          {/* Responsive Layout Info */}
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-900 mb-2">Responsive Layout:</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• <strong>Mobile:</strong> Single column layout for all sections</li>
              <li>• <strong>Medium+ (md+):</strong> KPI row shows 5 columns, charts/insights show 2 columns</li>
              <li>• <strong>Gaps:</strong> 4-unit gaps for KPI row, 6-unit gaps for other rows</li>
              <li>• <strong>Padding:</strong> 6-unit outer padding, 4-unit card padding</li>
            </ul>
          </div>

          {/* Integration Info */}
          <div className="bg-amber-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-amber-900 mb-2">Data Sources & Integration:</h3>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• <strong>KPI Values:</strong> Calculated from analysis history and assignments data</li>
              <li>• <strong>Trend Data:</strong> Uses first student's history (api.history)</li>
              <li>• <strong>Charts:</strong> Latest analysis data for tone and grammar</li>
              <li>• <strong>Assignments:</strong> Full assignments list from api.listAssignments()</li>
              <li>• <strong>Future:</strong> Ready for real API endpoints and anomaly detection</li>
            </ul>
          </div>
        </div>

        {/* Dashboard Component */}
        <div className={demoMode === 'loading' ? 'opacity-50 pointer-events-none' : ''}>
          <DashboardPageLayout
            key={demoMode}
            className="demo-dashboard"
          />
        </div>

        {/* Demo State Overlays */}
        {demoMode === 'loading' && (
          <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg font-medium text-gray-900">Loading Demo Dashboard...</p>
            </div>
          </div>
        )}

        {demoMode === 'error' && (
          <div className="fixed inset-0 bg-red-50 bg-opacity-75 flex items-center justify-center z-50">
            <div className="text-center bg-white p-6 rounded-lg shadow-lg">
              <div className="text-red-600 text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Demo Error Mode</h3>
              <p className="text-gray-600 mb-4">
                This simulates error states in the dashboard. Try switching back to "Normal" mode.
              </p>
              <button
                onClick={() => setDemoMode('normal')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Return to Normal Mode
              </button>
            </div>
          </div>
        )}

        {demoMode === 'empty' && (
          <div className="fixed inset-0 bg-gray-50 bg-opacity-75 flex items-center justify-center z-50">
            <div className="text-center bg-white p-6 rounded-lg shadow-lg">
              <div className="text-gray-500 text-4xl mb-4">📚</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Demo Empty State</h3>
              <p className="text-gray-600 mb-4">
                This shows the empty state when there are no students. Try switching back to "Normal" mode.
              </p>
              <button
                onClick={() => setDemoMode('normal')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Return to Normal Mode
              </button>
            </div>
          </div>
        )}

        {/* Test IDs Info */}
        <div className="p-6">
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900 mb-2">Test IDs Available:</h3>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• <code>dashboard-kpi-row</code> - KPI metrics row container</li>
              <li>• <code>dashboard-trend-card</code> - Class progress trends chart</li>
              <li>• <code>dashboard-tone-card</code> - Tone distribution chart</li>
              <li>• <code>dashboard-issues-card</code> - Common grammar issues</li>
              <li>• <code>dashboard-assignments-card</code> - Assignments status</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPageLayoutDemo; 