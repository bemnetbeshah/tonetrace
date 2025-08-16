import React from 'react';
import AssignmentsPage from '../pages/AssignmentsPage';

export default function AssignmentsPageDemo() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto">
        <div className="py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Assignments Page Demo</h1>
          <p className="text-gray-600 mb-8">
            This demo showcases the assignments page with mock data. Click "Run Analysis" on any assignment to see the mocked behavior.
          </p>
        </div>
        
        <AssignmentsPage />
      </div>
    </div>
  );
} 