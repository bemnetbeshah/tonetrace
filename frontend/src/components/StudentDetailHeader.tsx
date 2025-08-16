import React from 'react';
import KPICard from './KPICard';

export interface StudentDetailHeaderProps {
  student: {
    id: string;
    name: string;
    email?: string;
  };
  performance?: {
    avgFormality: number;
    avgComplexity: number;
    avgReadability: number;
    avgGrammarIssues: number;
  };
  profile?: {
    baselineFormality: number;
    baselineComplexity: number;
    fingerprintStability: number;
  };
  onActionClick?: (action: string) => void;
  className?: string;
}

export const StudentDetailHeader: React.FC<StudentDetailHeaderProps> = ({
  student,
  performance,
  profile,
  onActionClick,
  className = ''
}) => {
  const handleActionClick = (action: string) => {
    if (onActionClick) {
      onActionClick(action);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Student Identity Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center space-x-4">
          {/* Avatar Placeholder */}
          <div 
            className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xl font-semibold"
            data-testid="student-avatar"
          >
            {student.name.charAt(0).toUpperCase()}
          </div>
          
          {/* Student Info */}
          <div className="flex-1">
            <h1 
              className="text-2xl font-bold text-gray-900"
              data-testid="student-name"
            >
              {student.name}
            </h1>
            {student.email && (
              <p className="text-gray-600 mt-1">
                {student.email}
              </p>
            )}
          </div>
          
          {/* Actions Row */}
          <div className="flex space-x-2">
            <button
              onClick={() => handleActionClick('edit')}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => handleActionClick('export')}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Export
            </button>
          </div>
        </div>
      </div>

      {/* KPI Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div data-testid="student-kpi-formality">
          <KPICard
            title="Baseline Formality"
            value={profile?.baselineFormality !== undefined ? `${profile.baselineFormality.toFixed(1)}` : 'Loading...'}
            hint="0-100 scale"
            state={profile?.baselineFormality !== undefined ? 'ready' : 'loading'}
          />
        </div>
        
        <div data-testid="student-kpi-complexity">
          <KPICard
            title="Baseline Complexity"
            value={profile?.baselineComplexity !== undefined ? `${profile.baselineComplexity.toFixed(1)}` : 'Loading...'}
            hint="0-100 scale"
            state={profile?.baselineComplexity !== undefined ? 'ready' : 'loading'}
          />
        </div>
        
        <div data-testid="student-kpi-stability">
          <KPICard
            title="Fingerprint Stability %"
            value={profile?.fingerprintStability !== undefined ? `${(profile.fingerprintStability * 100).toFixed(1)}%` : 'Loading...'}
            hint="Higher is more stable"
            state={profile?.fingerprintStability !== undefined ? 'ready' : 'loading'}
          />
        </div>
        
        <div data-testid="student-kpi-grammar">
          <KPICard
            title="Avg Grammar Issues"
            value={performance?.avgGrammarIssues !== undefined ? performance.avgGrammarIssues.toFixed(1) : 'Loading...'}
            hint="Per submission"
            state={performance?.avgGrammarIssues !== undefined ? 'ready' : 'loading'}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentDetailHeader; 