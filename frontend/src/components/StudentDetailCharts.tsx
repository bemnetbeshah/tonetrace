import React, { useState, useEffect } from 'react';
import TrendlineChart from './TrendlineChart';
import TonePieChart from './TonePieChart';
import IssuesBar from './IssuesBar';
import { api } from '../services/api';

export interface StudentDetailChartsProps {
  studentId: string;
  className?: string;
}

interface StrengthsWeaknessesProps {
  strengths: string[];
  weaknesses: string[];
  title: string;
  className?: string;
}

const StrengthsWeaknesses: React.FC<StrengthsWeaknessesProps> = ({ 
  strengths, 
  weaknesses, 
  title, 
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm ${className}`}>
      <h3 className="text-sm font-medium text-gray-700 mb-3">{title}</h3>
      <div className="space-y-4">
        {strengths.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-green-700 mb-2">Strengths</h4>
            <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
              {strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>
        )}
        {weaknesses.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-amber-700 mb-2">Areas for Improvement</h4>
            <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
              {weaknesses.map((weakness, index) => (
                <li key={index}>{weakness}</li>
              ))}
            </ul>
          </div>
        )}
        {strengths.length === 0 && weaknesses.length === 0 && (
          <p className="text-xs text-gray-500">No analysis data available yet.</p>
        )}
      </div>
    </div>
  );
};

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ 
  title, 
  children, 
  loading = false, 
  error, 
  onRetry, 
  className = '' 
}) => {
  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm ${className}`}>
        <h3 className="text-sm font-medium text-gray-700 mb-3">{title}</h3>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm ${className}`}>
        <h3 className="text-sm font-medium text-gray-700 mb-3">{title}</h3>
        <div className="flex flex-col items-center justify-center h-32 space-y-3">
          <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
            {error}
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm ${className}`}>
      <h3 className="text-sm font-medium text-gray-700 mb-3">{title}</h3>
      {children}
    </div>
  );
};

export const StudentDetailCharts: React.FC<StudentDetailChartsProps> = ({
  studentId,
  className = ''
}) => {
  const [formalityData, setFormalityData] = useState<any[]>([]);
  const [toneData, setToneData] = useState<any[]>([]);
  const [grammarIssues, setGrammarIssues] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  
  const [loading, setLoading] = useState({
    formality: true,
    tone: true,
    grammar: true,
    profile: true
  });
  
  const [errors, setErrors] = useState({
    formality: '',
    tone: '',
    grammar: '',
    profile: ''
  });

  const loadFormalityData = async () => {
    try {
      setLoading(prev => ({ ...prev, formality: true }));
      setErrors(prev => ({ ...prev, formality: '' }));
      
      const history = await api.history(studentId, 20);
      const formalityTrend = history.map(analysis => ({
        date: analysis.createdAt,
        value: analysis.formality
      }));
      setFormalityData(formalityTrend);
    } catch (error) {
      setErrors(prev => ({ ...prev, formality: 'Failed to load formality data' }));
    } finally {
      setLoading(prev => ({ ...prev, formality: false }));
    }
  };

  const loadToneData = async () => {
    try {
      setLoading(prev => ({ ...prev, tone: true }));
      setErrors(prev => ({ ...prev, tone: '' }));
      
      const history = await api.history(studentId, 1);
      if (history.length > 0) {
        setToneData(history[0].toneDistribution);
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, tone: 'Failed to load tone data' }));
    } finally {
      setLoading(prev => ({ ...prev, tone: false }));
    }
  };

  const loadGrammarIssues = async () => {
    try {
      setLoading(prev => ({ ...prev, grammar: true }));
      setErrors(prev => ({ ...prev, grammar: '' }));
      
      const history = await api.history(studentId, 1);
      if (history.length > 0) {
        setGrammarIssues(history[0].grammarIssues);
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, grammar: 'Failed to load grammar data' }));
    } finally {
      setLoading(prev => ({ ...prev, grammar: false }));
    }
  };

  const loadProfile = async () => {
    try {
      setLoading(prev => ({ ...prev, profile: true }));
      setErrors(prev => ({ ...prev, profile: '' }));
      
      const profileData = await api.profile(studentId);
      setProfile(profileData);
    } catch (error) {
      setErrors(prev => ({ ...prev, profile: 'Failed to load profile data' }));
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  useEffect(() => {
    if (studentId) {
      loadFormalityData();
      loadToneData();
      loadGrammarIssues();
      loadProfile();
    }
  }, [studentId]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* First Row: Formality Trend + Tone Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div data-testid="student-trendline">
          <ChartCard
            title="Formality Trend"
            loading={loading.formality}
            error={errors.formality}
            onRetry={loadFormalityData}
          >
            <TrendlineChart
              data={formalityData}
              height={200}
              label="Formality Score"
            />
          </ChartCard>
        </div>
        
        <div data-testid="student-tonepie">
          <ChartCard
            title="Tone Distribution"
            loading={loading.tone}
            error={errors.tone}
            onRetry={loadToneData}
          >
            <TonePieChart data={toneData} />
          </ChartCard>
        </div>
      </div>

      {/* Second Row: Grammar Issues + Strengths/Weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div data-testid="student-issuesbar">
          <ChartCard
            title="Common Grammar Issues"
            loading={loading.grammar}
            error={errors.grammar}
            onRetry={loadGrammarIssues}
          >
            <IssuesBar issues={grammarIssues} />
          </ChartCard>
        </div>
        
        <ChartCard
          title="Strengths and Weaknesses"
          loading={loading.profile}
          error={errors.profile}
          onRetry={loadProfile}
        >
          <StrengthsWeaknesses
            strengths={profile?.strengths || []}
            weaknesses={profile?.weaknesses || []}
            title="Analysis Summary"
          />
        </ChartCard>
      </div>
    </div>
  );
};

export default StudentDetailCharts; 