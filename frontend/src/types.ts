export interface Student {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  submittedCount: number;
  totalCount: number;
  classAverage: number;
  hasOutliers: boolean;
}

export interface Submission {
  id: string;
  studentId: string;
  assignmentId: string;
  text: string;
  submittedAt: string;
  analysisResultId: string;
}

export interface AnalysisResult {
  id: string;
  submissionId: string;
  studentId: string;
  assignmentId: string;
  
  // Formality and complexity
  formality: number; // 0-1 scale
  complexity: {
    lexicalDensity: number; // 0-1 scale
    avgSentenceLen: number;
  };
  
  // Sentiment analysis
  sentiment: {
    polarity: number; // -1 to 1
    subjectivity: number; // 0-1 scale
  };
  
  // Writing quality metrics
  passiveVoicePct: number; // 0-100
  lexicalDiversity: number; // 0-1 scale
  lexicalRichness: {
    zipfAvg: number; // 1-7 scale
  };
  
  // Readability scores
  readability: {
    fkgl: number; // Flesch-Kincaid Grade Level
    smog: number; // SMOG Index
    fog: number; // Gunning Fog Index
    daleChall: number; // Dale-Chall Score
    eduLevel: string; // 'elementary' | 'middle' | 'high' | 'college'
  };
  
  // Grammar analysis
  grammarIssues: {
    spelling: number;
    punctuation: number;
    grammar: number;
    style: number;
  };
  grammarQuality: number; // 0-100
  
  // Style and tone
  hedgingDensity: number; // 0-1 scale
  styleMetrics: {
    sentenceVariety: number; // 0-1 scale
    wordChoice: number; // 0-1 scale
    flow: number; // 0-1 scale
  };
  toneDistribution: {
    formal: number; // 0-1 scale
    academic: number; // 0-1 scale
    conversational: number; // 0-1 scale
    emotional: number; // 0-1 scale
  };
  
  // Anomaly detection
  anomalyScore: number; // 0-1 scale, higher = more anomalous
  
  createdAt: string;
}

export interface KPI {
  title: string;
  value: string | number;
  sublabel: string;
  trend: {
    direction: 'up' | 'down' | 'flat';
    value: number;
    percentage: boolean;
  };
  icon: string;
}

export interface NotificationItem {
  id: string;
  type: 'missing' | 'anomaly' | 'struggling' | 'improvement' | 'alert';
  title: string;
  message: string;
  count?: number;
  studentName?: string;
  assignmentTitle?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  actionUrl?: string;
}

export interface TrendPoint {
  date: string;
  value: number;
  label: string;
}

export interface TrendSeries {
  name: string;
  data: TrendPoint[];
  color: string;
}

export interface DashboardSummary {
  kpis: KPI[];
  trends: {
    readability: TrendSeries;
    grammarErrors: TrendSeries;
    toneDistribution: TrendSeries;
    sentiment: TrendSeries;
    formality: TrendSeries;
    lexicalDiversity: TrendSeries;
  };
  recentNotifications: NotificationItem[];
  classInfo: {
    name: string;
    term: string;
    studentCount: number;
    latestAssignment: {
      title: string;
      dueDate: string;
      submissionRate: number;
    };
  };
}
