import React, { useState, useMemo } from 'react';
import { Search, TrendingUp, TrendingDown, Minus, Eye } from 'lucide-react';
import { Student } from '../types/models';
import { cn } from '../lib/ui';

interface StudentPerformanceTableProps {
  students: Student[];
  onViewStudent: (studentId: string) => void;
}

interface StudentWithMetrics extends Student {
  latestAssignment: string;
  growth: 'up' | 'down' | 'flat';
  formality: number;
  complexity: number;
  alerts: string[];
}

// Mock data for demonstration - in real app this would come from analysis results
const mockStudentMetrics: Record<string, Omit<StudentWithMetrics, keyof Student>> = {
  '1': { latestAssignment: 'Argumentative Essay', growth: 'up', formality: 0.85, complexity: 0.72, alerts: [] },
  '2': { latestAssignment: 'Argumentative Essay', growth: 'flat', formality: 0.78, complexity: 0.68, alerts: [] },
  '3': { latestAssignment: 'Argumentative Essay', growth: 'up', formality: 0.82, complexity: 0.75, alerts: [] },
  '4': { latestAssignment: 'Argumentative Essay', growth: 'down', formality: 0.65, complexity: 0.58, alerts: ['Anomaly'] },
  '5': { latestAssignment: 'Argumentative Essay', growth: 'up', formality: 0.88, complexity: 0.79, alerts: [] },
  '6': { latestAssignment: 'Argumentative Essay', growth: 'flat', formality: 0.76, complexity: 0.71, alerts: [] },
  '7': { latestAssignment: 'Argumentative Essay', growth: 'up', formality: 0.81, complexity: 0.74, alerts: [] },
  '8': { latestAssignment: 'Argumentative Essay', growth: 'down', formality: 0.62, complexity: 0.55, alerts: ['Struggling'] },
  '9': { latestAssignment: 'Argumentative Essay', growth: 'flat', formality: 0.79, complexity: 0.70, alerts: [] },
  '10': { latestAssignment: 'Argumentative Essay', growth: 'up', formality: 0.84, complexity: 0.77, alerts: [] },
  '11': { latestAssignment: 'Argumentative Essay', growth: 'up', formality: 0.86, complexity: 0.78, alerts: [] },
  '12': { latestAssignment: 'Argumentative Essay', growth: 'flat', formality: 0.77, complexity: 0.69, alerts: [] },
  '13': { latestAssignment: 'Argumentative Essay', growth: 'up', formality: 0.83, complexity: 0.76, alerts: [] },
  '14': { latestAssignment: 'Argumentative Essay', growth: 'flat', formality: 0.75, complexity: 0.67, alerts: [] },
  '15': { latestAssignment: 'Argumentative Essay', growth: 'up', formality: 0.87, complexity: 0.80, alerts: [] },
  '16': { latestAssignment: 'Argumentative Essay', growth: 'down', formality: 0.63, complexity: 0.56, alerts: ['Late'] },
  '17': { latestAssignment: 'Argumentative Essay', growth: 'up', formality: 0.89, complexity: 0.81, alerts: [] },
  '18': { latestAssignment: 'Argumentative Essay', growth: 'flat', formality: 0.74, complexity: 0.66, alerts: [] },
  '19': { latestAssignment: 'Argumentative Essay', growth: 'up', formality: 0.90, complexity: 0.82, alerts: [] },
  '20': { latestAssignment: 'Argumentative Essay', growth: 'down', formality: 0.61, complexity: 0.54, alerts: ['Anomaly'] },
  '21': { latestAssignment: 'Argumentative Essay', growth: 'up', formality: 0.85, complexity: 0.78, alerts: [] },
  '22': { latestAssignment: 'Argumentative Essay', growth: 'flat', formality: 0.73, complexity: 0.65, alerts: [] },
  '23': { latestAssignment: 'Argumentative Essay', growth: 'up', formality: 0.88, complexity: 0.79, alerts: [] },
  '24': { latestAssignment: 'Argumentative Essay', growth: 'flat', formality: 0.76, complexity: 0.68, alerts: [] },
};

export const StudentPerformanceTable: React.FC<StudentPerformanceTableProps> = ({
  students,
  onViewStudent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof StudentWithMetrics>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Debug logging
  console.log('StudentPerformanceTable: Received students:', students);
  console.log('StudentPerformanceTable: Students length:', students?.length);

  // Early return if no students
  if (!students || students.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center py-8 text-gray-500">
          <p>No students available.</p>
        </div>
      </div>
    );
  }

  const studentsWithMetrics: StudentWithMetrics[] = useMemo(() => {
    if (!students || students.length === 0) {
      console.log('StudentPerformanceTable: No students provided');
      return [];
    }

    const result = students.map(student => ({
      ...student,
      ...mockStudentMetrics[student.id],
      // Ensure all required properties have default values
      latestAssignment: mockStudentMetrics[student.id]?.latestAssignment || 'No Assignment',
      growth: mockStudentMetrics[student.id]?.growth || 'flat',
      formality: mockStudentMetrics[student.id]?.formality || 0.5,
      complexity: mockStudentMetrics[student.id]?.complexity || 0.5,
      alerts: mockStudentMetrics[student.id]?.alerts || [],
    }));

    console.log('StudentPerformanceTable: Students with metrics:', result);
    return result;
  }, [students]);

  const filteredAndSortedStudents = useMemo(() => {
    const filtered = studentsWithMetrics.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle undefined values
      if (aValue === undefined) aValue = '';
      if (bValue === undefined) bValue = '';

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [studentsWithMetrics, searchTerm, sortField, sortDirection]);

  const handleSort = (field: keyof StudentWithMetrics) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getGrowthIcon = (growth: 'up' | 'down' | 'flat') => {
    switch (growth) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'flat':
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

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

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Search and Controls */}
      <div className="p-6 border-b border-gray-200">
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
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                Name
                {sortField === 'name' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Latest Assignment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Growth
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('formality')}
              >
                Formality
                {sortField === 'formality' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('complexity')}
              >
                Complexity
                {sortField === 'complexity' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alerts
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center">
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.latestAssignment}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getGrowthIcon(student.growth)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {(student.formality * 100).toFixed(0)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {(student.complexity * 100).toFixed(0)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    <span className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium", getRiskLevelColor(student.riskLevel))}>
                      {student.riskLevel}
                    </span>
                    {(student.alerts || []).map((alert, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {alert}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onViewStudent(student.id)}
                    className="text-brand-600 hover:text-brand-900 flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedStudents.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No students found matching your search.</p>
        </div>
      )}
    </div>
  );
};
