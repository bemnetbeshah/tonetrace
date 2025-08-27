import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye } from 'lucide-react';
import { getStudents } from '../api/mockApi';
import { Student } from '../types';
import { cn } from '../lib/ui';

export const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [readabilityFilter, setReadabilityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const data = await getStudents();
        setStudents(data);
        setFilteredStudents(data);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    let filtered = students;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply risk filter
    if (riskFilter !== 'all') {
      filtered = filtered.filter(student => student.riskLevel === riskFilter);
    }

    // Apply readability filter (mock data - in real app this would come from analysis results)
    if (readabilityFilter !== 'all') {
      // Mock readability scores for demonstration
      const mockReadabilityScores: Record<string, number> = {
        '1': 8.5, '2': 7.2, '3': 9.1, '4': 6.8, '5': 8.9,
        '6': 7.5, '7': 8.2, '8': 6.5, '9': 7.8, '10': 8.7,
        '11': 9.2, '12': 7.9
      };

      filtered = filtered.filter(student => {
        const score = mockReadabilityScores[student.id];
        if (readabilityFilter === 'low') return score < 7.0;
        if (readabilityFilter === 'medium') return score >= 7.0 && score < 8.5;
        if (readabilityFilter === 'high') return score >= 8.5;
        return true;
      });
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, riskFilter, readabilityFilter]);

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getReadabilityLevel = (studentId: string) => {
    const mockScores: Record<string, number> = {
      '1': 8.5, '2': 7.2, '3': 9.1, '4': 6.8, '5': 8.9,
      '6': 7.5, '7': 8.2, '8': 6.5, '9': 7.8, '10': 8.7,
      '11': 9.2, '12': 7.9
    };
    const score = mockScores[studentId];
    if (score < 7.0) return { level: 'Low', color: 'text-red-600' };
    if (score < 8.5) return { level: 'Medium', color: 'text-yellow-600' };
    return { level: 'High', color: 'text-green-600' };
  };

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <span className="text-sm text-gray-500">
            {filteredStudents.length} of {students.length} students
          </span>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            {/* Risk Filter */}
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>

            {/* Readability Filter */}
            <select
              value={readabilityFilter}
              onChange={(e) => setReadabilityFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            >
              <option value="all">All Readability Levels</option>
              <option value="low">Low Readability</option>
              <option value="medium">Medium Readability</option>
              <option value="high">High Readability</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setRiskFilter('all');
                setReadabilityFilter('all');
              }}
              className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Readability
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Assignment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => {
                  const readability = getReadabilityLevel(student.id);
                  return (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-brand-700">
                                {student.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium", getRiskLevelColor(student.riskLevel))}>
                          {student.riskLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn("text-sm font-medium", readability.color)}>
                          {readability.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Argumentative Essay
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => window.location.href = `/students/${student.id}`}
                          className="text-brand-600 hover:text-brand-900 flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No students found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
