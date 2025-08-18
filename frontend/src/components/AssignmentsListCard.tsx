import React from 'react';

export interface Assignment {
  id: string;
  title: string;
  status: 'pending' | 'submitted' | 'graded';
  submittedCount?: number;
  dueDate?: string;
}

export interface AssignmentsListCardProps {
  assignments: Assignment[];
  className?: string;
}

const AssignmentsListCard: React.FC<AssignmentsListCardProps> = ({ assignments, className = '' }) => {
  if (!assignments || assignments.length === 0) {
    return (
      <div className={`bg-gray-50 rounded-lg p-4 text-center text-gray-500 ${className}`}>
        No assignments available
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'graded':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Assignments</h3>
      <div className="space-y-3">
        {assignments.slice(0, 5).map((assignment) => (
          <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {assignment.title}
              </h4>
              {assignment.dueDate && (
                <p className="text-xs text-gray-500 mt-1">
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {assignment.submittedCount !== undefined && (
                <span className="text-xs text-gray-500">
                  {assignment.submittedCount} submitted
                </span>
              )}
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(assignment.status)}`}>
                {getStatusText(assignment.status)}
              </span>
            </div>
          </div>
        ))}
      </div>
      {assignments.length > 5 && (
        <div className="mt-4 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View all assignments
          </button>
        </div>
      )}
    </div>
  );
};

export default AssignmentsListCard; 