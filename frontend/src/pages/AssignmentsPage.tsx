import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { RowSkeleton } from '../components/skeletons';
import type { Assignment } from '../types/student';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState<string | null>(null);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const data = await api.listAssignments();
      setAssignments(data);
    } catch (error) {
      console.error('Failed to load assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeClick = async (id: string) => {
    if (analyzing) return; // Prevent multiple simultaneous analyses
    
    try {
      setAnalyzing(id);
      // PLACEHOLDER_API: Future behavior will be batch POST /analyze for the assignment
      // For now, show mocked behavior
      alert('mocked');
      
      // Simulate analysis process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Future: Show success toast here
      console.log(`Analysis completed for assignment ${id}`);
    } catch (error) {
      console.error('Analysis failed:', error);
      // Future: Show error toast here
    } finally {
      setAnalyzing(null);
    }
  };

  const handleNewAssignment = () => {
    // Stub for future implementation
    alert('New Assignment button clicked - stub implementation');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6" data-testid="assignments-page">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
            <button
              onClick={handleNewAssignment}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              New Assignment
            </button>
          </div>
        </div>

        {/* Loading Skeletons */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Assignments</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <RowSkeleton className="h-6 w-3/4" />
                    <div className="flex space-x-4">
                      <RowSkeleton className="h-4 w-24" />
                      <RowSkeleton className="h-4 w-32" />
                    </div>
                  </div>
                  <RowSkeleton className="h-10 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6" data-testid="assignments-page">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
          <button
            onClick={handleNewAssignment}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            New Assignment
          </button>
        </div>
      </div>

      {/* Assignments List */}
      {assignments.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Assignments</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{assignment.title}</h3>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>Due: {new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</span>
                      <span>
                        {assignment.submittedCount} of {assignment.totalCount} submitted
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleAnalyzeClick(assignment.id)}
                      disabled={analyzing === assignment.id}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        analyzing === assignment.id
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                      data-testid="assignments-run-analysis"
                    >
                      {analyzing === assignment.id ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Analyzing...</span>
                        </div>
                      ) : (
                        'Run Analysis'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
          <p className="text-gray-500">Get started by creating your first assignment.</p>
        </div>
      )}
    </div>
  );
} 