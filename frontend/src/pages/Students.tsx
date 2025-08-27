import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, Badge, Input } from '../components/primitives';
import { fetchStudentsPage } from '../data/adapters';
import type { Student } from '../types/models';

export const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        const data = await fetchStudentsPage();
        setStudents(data.students);
      } catch (error) {
        console.error('Failed to load students:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'danger';
      default:
        return 'muted';
    }
  };

  const handleViewStudent = (studentId: string) => {
    navigate(`/students/${studentId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="h-12 bg-gray-200 rounded w-96 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Students</h1>
            <p className="text-gray-600 mt-2">Manage and monitor student performance</p>
          </div>
          <div className="flex items-center gap-4">
            <Input
              type="search"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
        </div>

        {/* Student Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <Card 
              key={student.id} 
              className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => handleViewStudent(student.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{student.email}</p>
                  </div>
                  <Badge tone={getRiskLevelColor(student.riskLevel)}>
                    {student.riskLevel}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {student.baselineStyleProfile && (
                    <>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Strengths</h4>
                        <div className="flex flex-wrap gap-1">
                          {student.baselineStyleProfile.strengths.slice(0, 2).map((strength, index) => (
                            <span
                              key={index}
                              className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full"
                            >
                              {strength}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Areas for Improvement</h4>
                        <div className="flex flex-wrap gap-1">
                          {student.baselineStyleProfile.weaknesses.slice(0, 2).map((weakness, index) => (
                            <span
                              key={index}
                              className="inline-block px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full"
                            >
                              {weakness}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  <div className="pt-2 border-t border-gray-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewStudent(student.id);
                      }}
                      className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-600">
              {searchTerm ? `No students match "${searchTerm}"` : 'No students available'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
