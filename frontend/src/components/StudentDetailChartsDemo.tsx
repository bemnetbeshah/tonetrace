import React, { useState } from 'react';
import StudentDetailCharts from './StudentDetailCharts';

export const StudentDetailChartsDemo: React.FC = () => {
  const [selectedStudentId, setSelectedStudentId] = useState('student-1');
  const [demoMode, setDemoMode] = useState<'normal' | 'loading' | 'error'>('normal');

  const demoStudents = [
    { id: 'student-1', name: 'Alex Johnson' },
    { id: 'student-2', name: 'Sarah Chen' },
    { id: 'student-3', name: 'Marcus Rodriguez' }
  ];

  const handleStudentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStudentId(event.target.value);
  };

  const handleDemoModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDemoMode(event.target.value as 'normal' | 'loading' | 'error');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Student Detail Charts Demo
          </h2>
          
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label htmlFor="student-select" className="block text-sm font-medium text-gray-700 mb-1">
                Select Student:
              </label>
              <select
                id="student-select"
                value={selectedStudentId}
                onChange={handleStudentChange}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                {demoStudents.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>
            
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
                <option value="normal">Normal</option>
                <option value="loading">Loading</option>
                <option value="error">Error</option>
              </select>
            </div>
          </div>
        </div>

        {/* Demo Controls Info */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Demo Features:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Formality Trend:</strong> Line chart showing formality scores over time</li>
            <li>• <strong>Tone Distribution:</strong> Pie chart showing tone analysis breakdown</li>
            <li>• <strong>Grammar Issues:</strong> Bar chart of common grammar problems</li>
            <li>• <strong>Strengths & Weaknesses:</strong> Lists from student profile analysis</li>
            <li>• <strong>Loading States:</strong> Skeleton placeholders while data loads</li>
            <li>• <strong>Error Handling:</strong> Error messages with retry buttons</li>
            <li>• <strong>Responsive Layout:</strong> Adapts from 1 column (mobile) to 2 columns (desktop)</li>
          </ul>
        </div>

        {/* Charts Component */}
        <div className={demoMode === 'loading' ? 'opacity-50 pointer-events-none' : ''}>
          <StudentDetailCharts
            studentId={selectedStudentId}
            key={`${selectedStudentId}-${demoMode}`}
          />
        </div>

        {/* Demo State Overlay for Loading/Error */}
        {demoMode === 'loading' && (
          <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg font-medium text-gray-900">Loading Demo Data...</p>
            </div>
          </div>
        )}

        {demoMode === 'error' && (
          <div className="fixed inset-0 bg-red-50 bg-opacity-75 flex items-center justify-center z-50">
            <div className="text-center bg-white p-6 rounded-lg shadow-lg">
              <div className="text-red-600 text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Demo Error Mode</h3>
              <p className="text-gray-600 mb-4">
                This simulates error states in the charts. Try switching back to "Normal" mode.
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

        {/* Integration Info */}
        <div className="mt-8 p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-2">Integration Points:</h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• <strong>Formality Trend:</strong> Uses <code>api.history(id)</code> for trend data</li>
            <li>• <strong>Tone Distribution:</strong> Uses latest analysis <code>toneDistribution</code></li>
            <li>• <strong>Grammar Issues:</strong> Uses latest analysis <code>grammarIssues</code></li>
            <li>• <strong>Profile Data:</strong> Uses <code>api.profile(id)</code> for strengths/weaknesses</li>
            <li>• <strong>Future:</strong> Ready for real GET endpoints <code>/profile/*</code> and <code>/analyze/history/*</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailChartsDemo; 