import React from 'react';

export interface IssuesBarProps {
  issues: Array<{ type: string; count: number }>;
  className?: string;
}

const IssuesBar: React.FC<IssuesBarProps> = ({ issues, className = '' }) => {
  if (!issues || issues.length === 0) {
    return (
      <div className={`bg-gray-50 rounded-lg p-4 text-center text-gray-500 ${className}`}>
        No grammar issues found
      </div>
    );
  }

  const maxCount = Math.max(...issues.map(issue => issue.count));

  return (
    <div className={`space-y-3 ${className}`}>
      {issues.map((issue, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-700 capitalize">
                {issue.type.replace(/_/g, ' ')}
              </span>
              <span className="text-gray-500">{issue.count}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(issue.count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IssuesBar; 