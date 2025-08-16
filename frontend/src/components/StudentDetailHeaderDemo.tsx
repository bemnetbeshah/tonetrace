import React, { useState, useEffect } from 'react';
import StudentDetailHeader from './StudentDetailHeader';
import { api } from '../services/api';

export const StudentDetailHeaderDemo: React.FC = () => {
  const [student, setStudent] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [performance, setPerformance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate loading a specific student (using first available)
        const students = await api.listStudents();
        if (students.length > 0) {
          const studentData = students[0];
          setStudent(studentData);
          
          // Load profile and performance data
          try {
            const profileData = await api.profile(studentData.id);
            setProfile(profileData);
          } catch (error) {
            console.log('Profile not available, using mock data');
            setProfile({
              baselineFormality: 75.2,
              baselineComplexity: 68.9,
              fingerprintStability: 0.87
            });
          }
          
          try {
            const performanceData = await api.performance(studentData.id);
            setPerformance(performanceData);
          } catch (error) {
            console.log('Performance not available, using mock data');
            setPerformance({
              avgFormality: 72.1,
              avgComplexity: 65.3,
              avgReadability: 12.4,
              avgGrammarIssues: 2.1
            });
          }
        }
      } catch (error) {
        console.error('Error loading demo data:', error);
        // Fallback mock data
        setStudent({
          id: 'demo-1',
          name: 'Alex Johnson',
          email: 'alex.johnson@university.edu'
        });
        setProfile({
          baselineFormality: 75.2,
          baselineComplexity: 68.9,
          fingerprintStability: 0.87
        });
        setPerformance({
          avgFormality: 72.1,
          avgComplexity: 65.3,
          avgReadability: 12.4,
          avgGrammarIssues: 2.1
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleActionClick = (action: string) => {
    console.log(`Action clicked: ${action}`);
    alert(`Action: ${action} - This would trigger the actual functionality in production`);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Student Detail Header Demo
        </h2>
        
        <StudentDetailHeader
          student={student}
          profile={profile}
          performance={performance}
          onActionClick={handleActionClick}
        />
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Demo Features:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Student identity with avatar placeholder and contact info</li>
            <li>• Action buttons (Edit/Export) with click handlers</li>
            <li>• 4 KPI cards showing baseline metrics and performance data</li>
            <li>• Responsive grid layout (1 col on mobile, 2 on tablet, 4 on desktop)</li>
            <li>• Loading states and error handling</li>
            <li>• Integration with existing KPICard component</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailHeaderDemo; 