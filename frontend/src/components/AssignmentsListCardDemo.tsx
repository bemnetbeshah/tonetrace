import React from 'react';
import AssignmentsListCard from './AssignmentsListCard';

const AssignmentsListCardDemo: React.FC = () => {
  const sampleAssignments = [
    {
      id: '1',
      title: 'Essay Analysis - Shakespeare',
      status: 'submitted' as const,
      submittedCount: 15,
      dueDate: '2024-01-15'
    },
    {
      id: '2',
      title: 'Research Paper - Modern Literature',
      status: 'pending' as const,
      submittedCount: 8,
      dueDate: '2024-01-22'
    },
    {
      id: '3',
      title: 'Creative Writing Assignment',
      status: 'graded' as const,
      submittedCount: 20,
      dueDate: '2024-01-08'
    },
    {
      id: '4',
      title: 'Grammar Review Exercise',
      status: 'submitted' as const,
      submittedCount: 12,
      dueDate: '2024-01-20'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AssignmentsListCard Component Demo</h3>
        <p className="text-gray-600 mb-6">
          Displays a list of assignments with status indicators and submission counts.
        </p>
        
        <div className="mb-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Sample Assignments</h4>
          <AssignmentsListCard assignments={sampleAssignments} />
        </div>

        <div className="border-t pt-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Empty State</h4>
          <AssignmentsListCard assignments={[]} />
        </div>
      </div>
    </div>
  );
};

export default AssignmentsListCardDemo; 