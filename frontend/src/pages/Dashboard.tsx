import React, { useState, useEffect, useRef } from 'react';
import { DashboardHero } from '../components/DashboardHero';
import { KpiCard } from '../components/KpiCard';
import { NotificationsPanel } from '../components/NotificationsPanel';
import { StudentPerformanceTable } from '../components/StudentPerformanceTable';
import { AssignmentTracker } from '../components/AssignmentTracker';
import { TrendsAndVisualization } from '../components/TrendsAndVisualization';
import { SectionHeader } from '../components/SectionHeader';
import { getDashboardSummary, getStudents, getAssignments } from '../api/mockApi';
import { DashboardSummary, Student, Assignment } from '../types';

export const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Prevent double fetching in React StrictMode
    if (hasFetchedRef.current) {
      return;
    }
    
    console.log('Dashboard: useEffect triggered');
    const fetchData = async () => {
      try {
        console.log('Dashboard: Starting to fetch data');
        setLoading(true);
        const [summaryData, studentsData, assignmentsData] = await Promise.all([
          getDashboardSummary(),
          getStudents(),
          getAssignments(),
        ]);
        console.log('Dashboard: Data fetched successfully', { summaryData, studentsData, assignmentsData });
        setDashboardData(summaryData);
        setStudents(studentsData);
        setAssignments(assignmentsData);
        hasFetchedRef.current = true;
      } catch (err) {
        console.error('Dashboard: Error fetching data', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewStudent = (studentId: string) => {
    // Navigate to student detail page
    window.location.href = `/students/${studentId}`;
  };

  console.log('Dashboard: Rendering with state:', { loading, error, dashboardData, students, assignments });

  if (loading) {
    console.log('Dashboard: Rendering loading state');
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-xl mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    console.log('Dashboard: Rendering error state', { error, dashboardData });
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h2>
            <p className="text-red-600 mb-4">{error || 'Failed to load dashboard data'}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log('Dashboard: Rendering main content');
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hero Section - Test with just this first */}
        <DashboardHero data={dashboardData} students={students} />
        
        {/* Test message to see if we get this far */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <h2 className="text-lg font-semibold text-green-800 mb-2">✅ DashboardHero Rendered Successfully!</h2>
          <p className="text-green-600">If you can see this message, the DashboardHero component is working.</p>
        </div>

        {/* KPI and Notifications Row - Adding back to test */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* KPI Cards - Left side */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardData.kpis.map((kpi, index) => (
              <KpiCard
                key={index}
                title={kpi.title}
                value={kpi.value}
                sublabel={kpi.sublabel}
                icon={kpi.icon}
                trend={kpi.trend}
              />
            ))}
          </div>

          {/* Notifications Panel - Right side */}
          <div className="lg:col-span-1">
            <NotificationsPanel items={dashboardData.recentNotifications} />
          </div>
        </div>

        {/* Success message for KPI and Notifications */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">✅ KPI Cards & Notifications Rendered Successfully!</h2>
          <p className="text-blue-600">If you can see this message, the KPI and Notifications components are working.</p>
        </div>

        {/* Assignment Tracker - Adding back to test */}
        <AssignmentTracker
          assignments={assignments}
          onCreateAssignment={() => console.log('Create assignment clicked')}
        />

        {/* Success message for Assignment Tracker */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
          <h2 className="text-lg font-semibold text-purple-800 mb-2">✅ Assignment Tracker Rendered Successfully!</h2>
          <p className="text-purple-600">If you can see this message, the Assignment Tracker component is working.</p>
        </div>

        {/* Trends and Visualization - Adding back to test */}
        <TrendsAndVisualization trends={dashboardData.trends} />

        {/* Success message for Trends and Visualization */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center">
          <h2 className="text-lg font-semibold text-orange-800 mb-2">✅ Trends & Visualization Rendered Successfully!</h2>
          <p className="text-orange-600">If you can see this message, the Trends & Visualization component is working.</p>
        </div>

        {/* Temporarily comment out all other components to isolate the issue */}
        {/* 
        <div>
          <SectionHeader title="Student Performance" />
          <StudentPerformanceTable
            students={students}
            onViewStudent={handleViewStudent}
          />
        </div>
        */}
      </div>
    </div>
  );
};
