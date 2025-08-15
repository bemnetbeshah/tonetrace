import React from 'react';
import { tokens } from '../design-system/tokens';

export interface KPICardProps {
  title: string;
  value: string | number | React.ReactNode;
  icon?: React.ReactNode;
  hint?: string;
  state?: 'loading' | 'error' | 'ready';
  className?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon,
  hint,
  state = 'ready',
  className = ''
}) => {
  const renderContent = () => {
    switch (state) {
      case 'loading':
        return (
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2"></div>
            {hint && <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>}
          </div>
        );
      
      case 'error':
        return (
          <div className="space-y-3">
            <div className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded-md inline-block">
              Error loading data
            </div>
            <div className="h-8 bg-gray-100 rounded flex items-center justify-center text-gray-400">
              —
            </div>
          </div>
        );
      
      case 'ready':
      default:
        return (
          <div className="space-y-2">
            <div className="text-2xl font-bold text-gray-900">
              {value}
            </div>
            {hint && (
              <div className="text-xs text-gray-500">
                {hint}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div
      className={`
        bg-white rounded-lg border border-gray-200 p-4 shadow-sm
        hover:shadow-md transition-shadow duration-200
        ${className}
      `}
      role="region"
      aria-label={`Summary card ${title}`}
    >
      {/* Header with title and icon */}
      <div className="flex items-start justify-between mb-3">
        <h3 
          className="text-sm font-medium text-gray-700 truncate"
          data-testid="kpi-title"
        >
          {title}
        </h3>
        {icon && (
          <div className="flex-shrink-0 ml-2 text-gray-400">
            {icon}
          </div>
        )}
      </div>
      
      {/* Main content area */}
      <div data-testid="kpi-value">
        {renderContent()}
      </div>
    </div>
  );
};

export default KPICard; 