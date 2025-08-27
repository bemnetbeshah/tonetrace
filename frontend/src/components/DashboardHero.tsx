import React from 'react';
import { DashboardSummary, Student } from '../types';

interface DashboardHeroProps {
  data: DashboardSummary;
  students: Student[];
}

export const DashboardHero: React.FC<DashboardHeroProps> = ({ data, students }) => {
  // Add null checks to prevent crashes
  if (!data || !data.classInfo) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded mb-4"></div>
            <div className="h-6 bg-white/20 rounded mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-white/20 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { classInfo } = data;
  
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="mb-6 lg:mb-0">
          <h1 className="text-3xl font-bold mb-2">{classInfo.name || 'Class Dashboard'}</h1>
          <p className="text-blue-100 text-lg mb-4">{classInfo.term || 'Current Term'}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm text-center">
              <div className="text-2xl font-bold">{classInfo.studentCount || 0}</div>
              <div className="text-blue-100 text-sm">Total Students</div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm text-center">
              <div className="text-2xl font-bold">{data.kpis?.length || 0}</div>
              <div className="text-blue-100 text-sm">Key Metrics</div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm text-center">
              <div className="text-2xl font-bold">
                {Math.round(classInfo.latestAssignment?.submissionRate || 0)}%
              </div>
              <div className="text-blue-100 text-sm">Latest Assignment</div>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-2">Latest Assignment</h3>
            <p className="text-blue-100 mb-1">{classInfo.latestAssignment?.title || 'No assignments'}</p>
            <p className="text-blue-200 text-sm">
              Due: {classInfo.latestAssignment?.dueDate ? new Date(classInfo.latestAssignment.dueDate).toLocaleDateString() : 'TBD'}
            </p>
            <div className="mt-3">
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.round(classInfo.latestAssignment?.submissionRate || 0)}%` }}
                ></div>
              </div>
              <p className="text-blue-100 text-sm mt-1">
                {Math.round(classInfo.latestAssignment?.submissionRate || 0)}% submitted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
