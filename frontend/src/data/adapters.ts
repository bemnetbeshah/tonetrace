import { buildMockDataset, computeClassAggregates } from './mock';
import type { Student, Assignment, Submission, AnalysisMetrics, ClassAggregates } from '../types/models';

// Placeholder async functions that will be replaced with real API calls later
export async function fetchClassSummary(): Promise<{
  students: Student[];
  assignments: Assignment[];
  submissions: Submission[];
  analyses: AnalysisMetrics[];
  aggregates: ClassAggregates;
}> {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 300));
  
  const dataset = buildMockDataset(24, 5);
  const aggregates = computeClassAggregates(dataset);
  
  return {
    ...dataset,
    aggregates
  };
}

export async function fetchStudentsPage(page = 1, limit = 20): Promise<{
  students: Student[];
  total: number;
  page: number;
  limit: number;
}> {
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 200));
  
  const dataset = buildMockDataset(24, 5);
  const start = (page - 1) * limit;
  const end = start + limit;
  
  return {
    students: dataset.students.slice(start, end),
    total: dataset.students.length,
    page,
    limit
  };
}

export async function fetchAssignments(): Promise<Assignment[]> {
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 200));
  
  const dataset = buildMockDataset(24, 5);
  return dataset.assignments;
}

export async function fetchTrends(): Promise<{
  readability: { date: string; value: number }[];
  grammarErrors: { date: string; value: number }[];
  toneDistribution: { date: string; value: number }[];
}> {
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 200));
  
  // Generate trend data over time
  const generateTrendData = (baseValue: number, variance: number, count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      date: new Date(2024, 0, 15 + i * 7).toISOString().split('T')[0],
      value: Math.max(0, Math.min(100, baseValue + (Math.random() - 0.5) * variance))
    }));
  };
  
  return {
    readability: generateTrendData(8.2, 1.5, 8),
    grammarErrors: generateTrendData(12.5, 3.0, 8),
    toneDistribution: generateTrendData(75.0, 8.0, 8)
  };
}

export async function fetchStudentDetail(studentId: string): Promise<{
  student: Student;
  submissions: Submission[];
  analyses: AnalysisMetrics[];
}> {
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 300));
  
  const dataset = buildMockDataset(24, 5);
  const student = dataset.students.find(s => s.id === studentId);
  
  if (!student) {
    throw new Error('Student not found');
  }
  
  const studentSubmissions = dataset.submissions.filter(s => s.studentId === studentId);
  const studentAnalyses = dataset.analyses.filter(a => a.studentId === studentId);
  
  return {
    student,
    submissions: studentSubmissions,
    analyses: studentAnalyses
  };
}

export async function fetchAssignmentDetail(assignmentId: string): Promise<{
  assignment: Assignment;
  submissions: Submission[];
  analyses: AnalysisMetrics[];
}> {
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 300));
  
  const dataset = buildMockDataset(24, 5);
  const assignment = dataset.assignments.find(a => a.id === assignmentId);
  
  if (!assignment) {
    throw new Error('Assignment not found');
  }
  
  const assignmentSubmissions = dataset.submissions.filter(s => s.assignmentId === assignmentId);
  const assignmentAnalyses = dataset.analyses.filter(a => a.assignmentId === assignmentId);
  
  return {
    assignment,
    submissions: assignmentSubmissions,
    analyses: assignmentAnalyses
  };
}
