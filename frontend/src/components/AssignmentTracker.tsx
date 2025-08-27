import React, { useState } from 'react';
import { Plus, AlertTriangle, CheckCircle } from 'lucide-react';
import { Assignment } from '../types';
import { SectionHeader } from './SectionHeader';
import { cn } from '../lib/ui';

interface AssignmentTrackerProps {
  assignments: Assignment[];
  onCreateAssignment: () => void;
}

export const AssignmentTracker: React.FC<AssignmentTrackerProps> = ({
  assignments,
  onCreateAssignment,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getSubmissionRate = (assignment: Assignment) => {
    return Math.round((assignment.submittedCount / assignment.totalCount) * 100);
  };

  const getSubmissionRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getClassAverageColor = (average: number) => {
    if (average >= 80) return 'text-green-600';
    if (average >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Assignment Tracker"
        actionSlot={
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create New Assignment
          </button>
        }
      />

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submission %
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class Average
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {assignment.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={cn(
                            "h-2 rounded-full transition-all",
                            getSubmissionRateColor(getSubmissionRate(assignment)) === 'text-green-600' ? 'bg-green-500' :
                            getSubmissionRateColor(getSubmissionRate(assignment)) === 'text-yellow-600' ? 'bg-yellow-500' : 'bg-red-500'
                          )}
                          style={{ width: `${getSubmissionRate(assignment)}%` }}
                        />
                      </div>
                      <span className={cn("text-sm font-medium", getSubmissionRateColor(getSubmissionRate(assignment)))}>
                        {getSubmissionRate(assignment)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn("text-sm font-medium", getClassAverageColor(assignment.classAverage))}>
                      {assignment.classAverage.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {assignment.hasOutliers ? (
                        <div className="flex items-center gap-1 text-amber-600">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-xs font-medium">Outliers</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs font-medium">Normal</span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {assignments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No assignments found.</p>
          </div>
        )}
      </div>

      {/* Create Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Create New Assignment
            </h3>
            <p className="text-gray-600 mb-6">
              Assignment creation functionality will be implemented here.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  onCreateAssignment();
                }}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
