import React, { useState } from 'react';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  AcademicCapIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';
import { KPICard } from './KPICard';

export const KPICardDemo: React.FC = () => {
  const [demoState, setDemoState] = useState<'loading' | 'error' | 'ready'>('ready');

  const demoCards = [
    {
      title: 'Total Students',
      value: '1,247',
      icon: <UserGroupIcon className="w-5 h-5" />,
      hint: 'Active enrollments'
    },
    {
      title: 'Average Score',
      value: '87.3%',
      icon: <ChartBarIcon className="w-5 h-5" />,
      hint: 'Last 30 days'
    },
    {
      title: 'Assignments',
      value: '24',
      icon: <AcademicCapIcon className="w-5 h-5" />,
      hint: 'This semester'
    },
    {
      title: 'Response Time',
      value: '2.4h',
      icon: <ClockIcon className="w-5 h-5" />,
      hint: 'Average feedback'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">KPI Card Component Demo</h2>
        
        {/* State Controls */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setDemoState('ready')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              demoState === 'ready' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Ready
          </button>
          <button
            onClick={() => setDemoState('loading')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              demoState === 'loading' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Loading
          </button>
          <button
            onClick={() => setDemoState('error')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              demoState === 'error' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Error
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {demoCards.map((card, index) => (
          <KPICard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            hint={card.hint}
            state={demoState}
          />
        ))}
      </div>

      {/* Documentation */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Component Features</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• <strong>States:</strong> Loading (skeleton), Error (error badge), Ready (normal display)</li>
          <li>• <strong>Layout:</strong> Title top-left, icon top-right, value large below, hint at bottom</li>
          <li>• <strong>Accessibility:</strong> role="region", aria-label, proper test IDs</li>
          <li>• <strong>Responsive:</strong> Adapts to different screen sizes</li>
          <li>• <strong>Interactive:</strong> Hover effects and smooth transitions</li>
        </ul>
      </div>
    </div>
  );
};

export default KPICardDemo; 