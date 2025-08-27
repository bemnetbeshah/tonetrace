import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getStudentById } from '../api/mockApi';
import { Student } from '../types';
import { cn } from '../lib/ui';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

export const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchStudent = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getStudentById(id);
        setStudent(data);
      } catch (error) {
        console.error('Failed to fetch student:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Student Not Found</h2>
            <p className="text-red-600">The requested student could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  const tabs: Tab[] = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Info</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Name:</span>
                  <p className="text-gray-900 font-medium">{student.name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Email:</span>
                  <p className="text-gray-900 font-medium">{student.email}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Risk Level:</span>
                  <span className={cn(
                    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2",
                    student.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                    student.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  )}>
                    {student.riskLevel}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Metrics</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Formality:</span>
                  <p className="text-gray-900 font-medium">85%</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Complexity:</span>
                  <p className="text-gray-900 font-medium">72%</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Grammar Quality:</span>
                  <p className="text-gray-900 font-medium">87.5%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mini Trend</h3>
              <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 text-sm">Trend chart will be implemented here</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'history',
      label: 'History',
      content: (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Writing History</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Argumentative Essay</p>
                <p className="text-sm text-gray-500">Submitted: Feb 15, 2024</p>
              </div>
              <span className="text-sm text-gray-600">Score: 87.5%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Literary Analysis</p>
                <p className="text-sm text-gray-500">Submitted: Feb 10, 2024</p>
              </div>
              <span className="text-sm text-gray-600">Score: 82.3%</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'grammar',
      label: 'Grammar',
      content: (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Grammar Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Issue Counts</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Spelling:</span>
                  <span className="text-sm font-medium">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Punctuation:</span>
                  <span className="text-sm font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Grammar:</span>
                  <span className="text-sm font-medium">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Style:</span>
                  <span className="text-sm font-medium">2</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Quality Score</h4>
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-600">87.5%</div>
                <p className="text-sm text-gray-500">Overall Grammar Quality</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'tone',
      label: 'Tone',
      content: (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tone Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Distribution</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Formal:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Academic:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Conversational:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Top Emotions</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Analytical</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Confident</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Thoughtful</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'readability',
      label: 'Readability',
      content: (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Readability Scores</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">All Four Scores</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">FKGL:</span>
                  <span className="text-sm font-medium">12.5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">SMOG:</span>
                  <span className="text-sm font-medium">11.8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Fog:</span>
                  <span className="text-sm font-medium">13.2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Dale-Chall:</span>
                  <span className="text-sm font-medium">8.5</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Education Level</h4>
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-600">High School</div>
                <p className="text-sm text-gray-500">Recommended Level</p>
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    This student's writing is appropriate for high school level readers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'submissions',
      label: 'Submissions',
      content: (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Submissions</h3>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h5 className="font-medium">Argumentative Essay on Climate Change</h5>
                <span className="text-sm text-gray-500">Feb 15, 2024</span>
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                Climate change represents one of the most pressing challenges facing humanity today. The scientific consensus is clear: human activities, particularly the burning of fossil fuels, are driving unprecedented changes in our planet's climate system...
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>Words: 1,247</span>
                <span>Score: 87.5%</span>
                <span>Analysis: Complete</span>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h5 className="font-medium">Literary Analysis: Shakespeare Sonnets</h5>
                <span className="text-sm text-gray-500">Feb 10, 2024</span>
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                Shakespeare's sonnets explore themes of love, time, and mortality with remarkable depth and complexity. Through his masterful use of language and poetic devices, he creates works that continue to resonate with readers centuries later...
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>Words: 892</span>
                <span>Score: 82.3%</span>
                <span>Analysis: Complete</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-brand-700">
                {student.name.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
              <p className="text-gray-600">{student.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={cn(
                  "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                  student.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                  student.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                )}>
                  {student.riskLevel} Risk
                </span>
                <span className="text-sm text-gray-500">• Joined {new Date(student.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                    activeTab === tab.id
                      ? 'border-brand-500 text-brand-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {tabs.find(tab => tab.id === activeTab)?.content}
          </div>
        </div>
      </div>
    </div>
  );
};
