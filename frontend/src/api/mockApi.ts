import { 
  Student, 
  Assignment, 
  NotificationItem, 
  DashboardSummary,
  TrendPoint 
} from '../types';

// Simulate API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Seeded data
const students: Student[] = [
  { id: '1', name: 'Emma Thompson', email: 'emma.thompson@school.edu', createdAt: '2024-01-15', riskLevel: 'low' },
  { id: '2', name: 'James Wilson', email: 'james.wilson@school.edu', createdAt: '2024-01-15', riskLevel: 'medium' },
  { id: '3', name: 'Sophia Chen', email: 'sophia.chen@school.edu', createdAt: '2024-01-15', riskLevel: 'low' },
  { id: '4', name: 'Michael Rodriguez', email: 'michael.rodriguez@school.edu', createdAt: '2024-01-15', riskLevel: 'high' },
  { id: '5', name: 'Olivia Davis', email: 'olivia.davis@school.edu', createdAt: '2024-01-15', riskLevel: 'low' },
  { id: '6', name: 'William Brown', email: 'william.brown@school.edu', createdAt: '2024-01-15', riskLevel: 'medium' },
  { id: '7', name: 'Ava Johnson', email: 'ava.johnson@school.edu', createdAt: '2024-01-15', riskLevel: 'low' },
  { id: '8', name: 'Ethan Miller', email: 'ethan.miller@school.edu', createdAt: '2024-01-15', riskLevel: 'high' },
  { id: '9', name: 'Isabella Garcia', email: 'isabella.garcia@school.edu', createdAt: '2024-01-15', riskLevel: 'medium' },
  { id: '10', name: 'Noah Martinez', email: 'noah.martinez@school.edu', createdAt: '2024-01-15', riskLevel: 'low' },
  { id: '11', name: 'Mia Anderson', email: 'mia.anderson@school.edu', createdAt: '2024-01-15', riskLevel: 'low' },
  { id: '12', name: 'Lucas Taylor', email: 'lucas.taylor@school.edu', createdAt: '2024-01-15', riskLevel: 'medium' },
];

const assignments: Assignment[] = [
  { id: '1', title: 'Argumentative Essay on Climate Change', dueDate: '2024-02-15', submittedCount: 10, totalCount: 12, classAverage: 78.5, hasOutliers: true },
  { id: '2', title: 'Literary Analysis: Shakespeare Sonnets', dueDate: '2024-02-20', submittedCount: 11, totalCount: 12, classAverage: 82.3, hasOutliers: false },
  { id: '3', title: 'Research Paper: Historical Events', dueDate: '2024-02-25', submittedCount: 8, totalCount: 12, classAverage: 75.8, hasOutliers: true },
  { id: '4', title: 'Creative Writing: Personal Narrative', dueDate: '2024-03-01', submittedCount: 12, totalCount: 12, classAverage: 88.2, hasOutliers: false },
];

// Analysis results would be populated from real data in production

const generateTrendData = (baseValue: number, variance: number, count: number): TrendPoint[] => {
  return Array.from({ length: count }, (_, i) => ({
    date: new Date(2024, 0, 15 + i * 7).toISOString().split('T')[0],
    value: Math.max(0, Math.min(100, baseValue + (Math.random() - 0.5) * variance)),
    label: `Week ${i + 1}`,
  }));
};

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  await delay(300 + Math.random() * 300); // 300-600ms latency
  
  return {
    kpis: [
      {
        title: 'Average Readability',
        value: '8.2',
        sublabel: 'Grade Level',
        trend: { direction: 'up', value: 0.3, percentage: false },
        icon: 'BookOpen',
      },
      {
        title: 'Grammar Accuracy',
        value: '87.5%',
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
      {
        title: 'Anomalies Detected',
        value: '3',
        sublabel: 'This Week',
        trend: { direction: 'down', value: 2, percentage: false },
        icon: 'AlertTriangle',
      },
      {
        title: 'Submission Rate',
        value: '91.7%',
        sublabel: 'Current Assignment',
        trend: { direction: 'up', value: 5.2, percentage: true },
        icon: 'FileText',
      },
    ],
    trends: {
      readability: {
        name: 'Readability Score',
        data: generateTrendData(8.2, 1.5, 8),
        color: '#3B82F6',
      },
      grammarErrors: {
        name: 'Grammar Errors',
        data: generateTrendData(12.5, 3.0, 8),
        color: '#EF4444',
      },
      toneDistribution: {
        name: 'Formal Tone Usage',
        data: generateTrendData(75.0, 8.0, 8),
        color: '#10B981',
      },
      sentiment: {
        name: 'Sentiment Polarity',
        data: generateTrendData(0.3, 0.4, 8),
        color: '#F59E0B',
      },
      formality: {
        name: 'Formality Score',
        data: generateTrendData(78.0, 6.0, 8),
        color: '#8B5CF6',
      },
      lexicalDiversity: {
        name: 'Lexical Diversity',
        data: generateTrendData(0.72, 0.08, 8),
        color: '#06B6D4',
      },
    },
    recentNotifications: [
      {
        id: '1',
        type: 'missing',
        title: 'Missing Submissions',
        message: '2 students have not submitted their latest assignment',
        count: 2,
        priority: 'medium',
        createdAt: '2024-02-15T14:30:00Z',
        actionUrl: '/assignments',
      },
      {
        id: '2',
        type: 'anomaly',
        title: 'Writing Anomaly Detected',
        message: 'Michael Rodriguez\'s latest submission shows unusual patterns',
        studentName: 'Michael Rodriguez',
        priority: 'high',
        createdAt: '2024-02-15T13:15:00Z',
        actionUrl: '/students/4',
      },
      {
        id: '3',
        type: 'struggling',
        title: 'Student Needs Support',
        message: 'Ethan Miller is showing declining performance trends',
        studentName: 'Ethan Miller',
        priority: 'high',
        createdAt: '2024-02-15T12:00:00Z',
        actionUrl: '/students/8',
      },
    ],
    classInfo: {
      name: 'Advanced English Composition',
      term: 'Spring 2024',
      studentCount: 12,
      latestAssignment: {
        title: 'Argumentative Essay on Climate Change',
        dueDate: '2024-02-15',
        submissionRate: 91.7,
      },
    },
  };
};

export const getStudents = async (): Promise<Student[]> => {
  await delay(300 + Math.random() * 300);
  return students;
};

export const getStudentById = async (id: string): Promise<Student | null> => {
  await delay(300 + Math.random() * 300);
  return students.find(student => student.id === id) || null;
};

export const getAssignments = async (): Promise<Assignment[]> => {
  await delay(300 + Math.random() * 300);
  return assignments;
};

export const getNotifications = async (): Promise<NotificationItem[]> => {
  await delay(300 + Math.random() * 300);
  return [
    {
      id: '1',
      type: 'missing',
      title: 'Missing Submissions',
      message: '2 students have not submitted their latest assignment',
      count: 2,
      priority: 'medium',
      createdAt: '2024-02-15T14:30:00Z',
      actionUrl: '/assignments',
    },
    {
      id: '2',
      type: 'anomaly',
      title: 'Writing Anomaly Detected',
      message: 'Michael Rodriguez\'s latest submission shows unusual patterns',
      studentName: 'Michael Rodriguez',
      priority: 'high',
      createdAt: '2024-02-15T13:15:00Z',
      actionUrl: '/students/4',
    },
    {
      id: '3',
      type: 'struggling',
      title: 'Student Needs Support',
      message: 'Ethan Miller is showing declining performance trends',
      studentName: 'Ethan Miller',
      priority: 'high',
      createdAt: '2024-02-15T12:00:00Z',
      actionUrl: '/students/8',
    },
    {
      id: '4',
      type: 'improvement',
      title: 'Student Progress',
      message: 'Emma Thompson shows significant improvement in grammar',
      studentName: 'Emma Thompson',
      priority: 'low',
      createdAt: '2024-02-15T11:45:00Z',
      actionUrl: '/students/1',
    },
  ];
};
