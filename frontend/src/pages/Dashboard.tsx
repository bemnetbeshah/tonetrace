import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardHero } from '../components/DashboardHero';
import { KpiCard } from '../components/KpiCard';
import { NotificationsPanel } from '../components/NotificationsPanel';
import { StudentPerformanceTable } from '../components/StudentPerformanceTable';
import { AssignmentTracker } from '../components/AssignmentTracker';
import { SectionHeader } from '../components/SectionHeader';
import { Card, CardHeader, CardTitle, CardContent, Section } from '../components/primitives';
import { LineChart, BarChart, DonutChart } from '../components/charts';
import { fetchClassSummary } from '../data/adapters';
import type { Student, Assignment, Submission, AnalysisMetrics, ClassAggregates } from '../types/models';
import type { DashboardSummary } from '../types';

interface DashboardData {
  students: Student[];
  assignments: Assignment[];
  submissions: Submission[];
  analyses: AnalysisMetrics[];
  aggregates: ClassAggregates;
}

export const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasFetchedRef.current) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchClassSummary();
        setDashboardData(data);
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
    navigate(`/students/${studentId}`);
  };

  if (loading) {
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

  const { students, assignments, submissions, analyses, aggregates } = dashboardData;

  // Debug logging
  console.log('Dashboard: Students data:', students);
  console.log('Dashboard: Students length:', students?.length);
  console.log('Dashboard: Aggregates:', aggregates);

  // Create DashboardSummary object for DashboardHero
  const dashboardSummary: DashboardSummary = {
    kpis: [
      {
        title: 'Average Readability',
        value: aggregates.classAverages.readability.toFixed(1),
        sublabel: 'Grade Level',
        trend: { direction: 'up', value: 0.3, percentage: false },
        icon: 'BookOpen',
      },
      {
        title: 'Grammar Accuracy',
        value: `${aggregates.classAverages.grammarQuality.toFixed(1)}%`,
        sublabel: 'Class Average',
        trend: { direction: 'up', value: 2.1, percentage: true },
        icon: 'CheckCircle',
      },
      {
        title: 'Writing Improvement',
        value: '+12.3%',
        sublabel: 'vs. Last Month',
        trend: { direction: 'up', value: 12.3, percentage: true },
        icon: 'TrendingUp',
      },
    ],
    trends: {
      readability: { name: 'Readability', data: [], color: '#3B82F6' },
      grammarErrors: { name: 'Grammar Errors', data: [], color: '#EF4444' },
      toneDistribution: { name: 'Tone Distribution', data: [], color: '#10B981' },
      sentiment: { name: 'Sentiment', data: [], color: '#F59E0B' },
      formality: { name: 'Formality', data: [], color: '#8B5CF6' },
      lexicalDiversity: { name: 'Lexical Diversity', data: [], color: '#06B6D4' },
    },
    recentNotifications: [
      {
        id: '1',
        type: 'struggling',
        title: 'Struggling Students',
        message: `${aggregates.strugglingStudents.length} students need support`,
        count: aggregates.strugglingStudents.length,
        priority: 'high',
        createdAt: new Date().toISOString(),
        actionUrl: '/students'
      },
      {
        id: '2',
        type: 'anomaly',
        title: 'Anomalous Submissions',
        message: `${aggregates.anomaliesCount} submissions flagged`,
        count: aggregates.anomaliesCount,
        priority: 'medium',
        createdAt: new Date().toISOString(),
        actionUrl: '/reports'
      },
      {
        id: '3',
        type: 'missing',
        title: 'Missing Submissions',
        message: `${aggregates.missingSubmissions.length} assignments not submitted`,
        count: aggregates.missingSubmissions.length,
        priority: 'medium',
        createdAt: new Date().toISOString(),
        actionUrl: '/assignments'
      }
    ],
    classInfo: {
      name: 'Advanced English Composition',
      term: 'Spring 2024',
      studentCount: students.length,
      latestAssignment: {
        title: assignments[0]?.title || 'No assignments',
        dueDate: assignments[0]?.dueDate || '',
        submissionRate: aggregates.submissionRate
      },
    },
  };

  // Prepare data for charts
  const readabilityTrendData = analyses
    .filter(a => a.readability.fkGrade > 0)
    .map((a, i) => ({ x: `Assignment ${i + 1}`, y: a.readability.fkGrade }))
    .slice(-8);

  const grammarIssuesData = [
    { label: 'Spelling', values: [{ series: 'Issues', value: analyses.reduce((sum, a) => sum + (a.grammar.byType.spelling || 0), 0) }] },
    { label: 'Punctuation', values: [{ series: 'Issues', value: analyses.reduce((sum, a) => sum + (a.grammar.byType.punctuation || 0), 0) }] },
    { label: 'Grammar', values: [{ series: 'Issues', value: analyses.reduce((sum, a) => sum + (a.grammar.byType.grammar || 0), 0) }] },
    { label: 'Style', values: [{ series: 'Issues', value: analyses.reduce((sum, a) => sum + (a.grammar.byType.style || 0), 0) }] }
  ];

  const toneDistributionData = Object.entries(
    analyses.reduce((acc, a) => {
      Object.entries(a.tone.distribution).forEach(([tone, value]) => {
        acc[tone] = (acc[tone] || 0) + value;
      });
      return acc;
    }, {} as Record<string, number>)
  )
    .map(([tone, value]) => ({ label: tone, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hero Section */}
        <DashboardHero data={dashboardSummary} students={students} />
        
        {/* KPI and Notifications Row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* KPI Cards - Left side */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <KpiCard
              title="Average Readability"
              value={aggregates.classAverages.readability.toFixed(1)}
              sublabel="Grade Level"
              trend={{ direction: 'up', value: 0.3, percentage: false }}
              icon="BookOpen"
            />
            <KpiCard
              title="Grammar Accuracy"
              value={`${aggregates.classAverages.grammarQuality.toFixed(1)}%`}
              sublabel="Class Average"
              trend={{ direction: 'up', value: 2.1, percentage: true }}
              icon="CheckCircle"
            />
            <KpiCard
              title="Writing Improvement"
              value="+12.3%"
              sublabel="vs. Last Month"
              trend={{ direction: 'up', value: 12.3, percentage: true }}
              icon="TrendingUp"
            />
          </div>

          {/* Notifications Panel - Right side */}
          <div className="lg:col-span-1">
            <NotificationsPanel 
              items={dashboardSummary.recentNotifications}
            />
          </div>
        </div>

        {/* Assignment Tracker */}
        {assignments && assignments.length > 0 && (
          <AssignmentTracker
            assignments={assignments}
            onCreateAssignment={() => console.log('Create assignment clicked')}
          />
        )}

        {/* Trends and Visualization */}
        {analyses && analyses.length > 0 && (
          <Section title="Trends and Visualization">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Readability Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Average Readability Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <LineChart
                    data={readabilityTrendData}
                    height={300}
                    width={400}
                    color="#3B82F6"
                  />
                </CardContent>
              </Card>

              {/* Grammar Issues */}
              <Card>
                <CardHeader>
                  <CardTitle>Grammar Issues by Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChart
                    data={grammarIssuesData}
                    height={300}
                    width={400}
                    colors={['#EF4444', '#F59E0B', '#10B981', '#3B82F6']}
                  />
                </CardContent>
              </Card>

              {/* Tone Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Tone Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <DonutChart
                    data={toneDistributionData}
                    height={300}
                    width={400}
                    innerRadiusRatio={0.6}
                  />
                </CardContent>
              </Card>
            </div>
          </Section>
        )}

        {/* Student Performance Table */}
        {students && students.length > 0 && (
          <Section title="Student Performance">
            <StudentPerformanceTable
              students={students}
              onViewStudent={handleViewStudent}
            />
          </Section>
        )}
      </div>
    </div>
  );
};
