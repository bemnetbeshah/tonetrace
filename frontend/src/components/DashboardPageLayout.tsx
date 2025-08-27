import React, { useState, useEffect } from 'react';
import KPICard from './KPICard';
import TrendlineChart from './TrendlineChart';
import TonePieChart from './TonePieChart';
import IssuesBar from './IssuesBar';
import AssignmentsListCard from './AssignmentsListCard';
import { api } from '../services/api';

export interface DashboardPageLayoutProps {
  className?: string;
}

interface DashboardData {
  kpis: {
    avgFormality: number;
    avgComplexity: number;
    avgReadability: number;
    assignmentsSubmitted: number;
    aiUseAlerts: number;
  };
  trendData: Array<{ date: string; value: number }>;
  toneData: Array<{ label: string; pct: number }>;
  grammarIssues: Array<{ type: string; count: number }>;
  assignments: Array<any>;
  hasStudents: boolean;
}

export const DashboardPageLayout: React.FC<DashboardPageLayoutProps> = ({
  className = ''
}) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load all data in parallel
        const [students, assignments, analyses] = await Promise.all([
          api.listStudents(),
          api.listAssignments(),
          api.listAnalyses()
        ]);

        if (students.length === 0) {
          setData({
            kpis: {
              avgFormality: 0,
              avgComplexity: 0,
              avgReadability: 0,
              assignmentsSubmitted: 0,
              aiUseAlerts: 0
            },
            trendData: [],
            toneData: [],
            grammarIssues: [],
            assignments: [],
            hasStudents: false
          });
          return;
        }

        // Calculate KPI values
        const avgFormality = analyses.length > 0 
          ? analyses.reduce((sum, analysis) => sum + (analysis.formality || 0), 0) / analyses.length 
          : 0;
        
        const avgComplexity = analyses.length > 0 
          ? analyses.reduce((sum, analysis) => sum + (analysis.complexity || 0), 0) / analyses.length 
          : 0;
        
        const avgReadability = analyses.length > 0 
          ? analyses.reduce((sum, analysis) => sum + (analysis.readability?.fk || 0), 0) / analyses.length 
          : 0;

        const assignmentsSubmitted = assignments.reduce((sum, assignment) => 
          sum + (assignment.submittedCount || 0), 0
        );

        // Placeholder for AI use alerts - would come from anomaly detection
        const aiUseAlerts = 2; // Placeholder value

        // Get trend data from first student's history
        const firstStudentHistory = await api.history(students[0].id, 10);
        const trendData = firstStudentHistory.map(analysis => ({
          date: analysis.createdAt,
          value: analysis.formality || 0
        }));

        // Get latest analysis data for tone and grammar
        const latestAnalysis = analyses.length > 0 ? analyses[0] : null;
        const toneData = latestAnalysis?.toneDistribution || [];
        const grammarIssues = latestAnalysis?.grammarIssues || [];

        setData({
          kpis: {
            avgFormality,
            avgComplexity,
            avgReadability,
            assignmentsSubmitted,
            aiUseAlerts
          },
          trendData,
          toneData,
          grammarIssues,
          assignments,
          hasStudents: true
        });
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard data loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className={`p-6 space-y-6 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data?.hasStudents) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="text-center max-w-md mx-auto">
          <div className="text-gray-500 text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Students Yet</h2>
          <p className="text-gray-600 mb-6">
            Get started by adding your first student to begin tracking their writing progress.
          </p>
          <a
            href="/students"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Students Page
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 space-y-6 ${className}`}>
      {/* KPI Row */}
      <div data-testid="dashboard-kpi-row" className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <KPICard
          title="Average Formality"
          value={data.kpis.avgFormality.toFixed(1)}
          hint="0-100 scale"
          state="ready"
        />
        
        <KPICard
          title="Average Complexity"
          value={data.kpis.avgComplexity.toFixed(1)}
          hint="0-100 scale"
          state="ready"
        />
        
        <KPICard
          title="Average Readability (FK)"
          value={data.kpis.avgReadability.toFixed(1)}
          hint="Flesch-Kincaid grade level"
          state="ready"
        />
        
        <KPICard
          title="Assignments Submitted"
          value={Math.round(data.kpis.assignmentsSubmitted).toString()}
          hint="Total submissions"
          state="ready"
        />
        
        <KPICard
          title="AI Use Alerts"
          value={data.kpis.aiUseAlerts.toString()}
          hint="Potential anomalies"
          state="ready"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div data-testid="dashboard-trend-card" className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Class Progress Trends</h3>
          <TrendlineChart
            data={data.trendData}
            height={200}
            label="Formality Score"
          />
        </div>
        
        <div data-testid="dashboard-tone-card" className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Tone Distribution</h3>
          <TonePieChart data={data.toneData} />
        </div>
      </div>

      {/* Insights Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div data-testid="dashboard-issues-card" className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Common Grammar Issues</h3>
          <IssuesBar issues={data.grammarIssues} />
        </div>
        
        <div data-testid="dashboard-assignments-card" className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Assignments Status</h3>
          <AssignmentsListCard assignments={data.assignments} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPageLayout; 