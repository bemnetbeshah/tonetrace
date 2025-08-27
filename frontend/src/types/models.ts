export interface Student {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  riskLevel: 'low' | 'medium' | 'high';
  baselineStyleProfile?: StyleProfile;
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

export interface AnalysisMetrics {
  id: string;
  submissionId: string;
  studentId: string;
  assignmentId: string;
  
  // Formality and complexity
  formality: number; // 0-1 scale
  complexity: number; // 0-1 scale
  
  // Sentiment analysis
  sentiment: {
    polarity: number; // -1 to 1
    subjectivity: number; // 0-1 scale
    bucket: 'positive' | 'neutral' | 'negative';
  };
  
  // Writing quality metrics
  passivePercent: number; // 0-100
  lexicalDiversity: number; // 0-1 scale
  zipfRichness: number; // 1-7 scale
  
  // Readability scores
  readability: {
    fkGrade: number; // Flesch-Kincaid Grade Level
    smog: number; // SMOG Index
    fog: number; // Gunning Fog Index
    daleChall: number; // Dale-Chall Score
    eduLevel: 'elementary' | 'middle' | 'high' | 'college';
  };
  
  // Grammar analysis
  grammar: {
    byType: Record<string, number>; // Map of issue type to count
    quality: 'excellent' | 'good' | 'fair' | 'poor';
  };
  
  // Hedging analysis
  hedging: {
    density: number; // 0-1 scale
    assertiveness: number; // 0-1 scale
  };
  
  // Style metrics
  styleMetrics: {
    avgSentenceLength: number;
    wordCount: number;
    sentenceCount: number;
  };
  
  // Tone analysis
  tone: {
    primary: string;
    secondary: string;
    distribution: Record<string, number>; // Map of tone to percentage
  };
  
  // Anomaly detection
  anomaly: {
    deviationScore: number; // 0-1 scale, higher = more anomalous
    fingerprintStability: number; // 0-1 scale
  };
  
  // Performance metrics
  performance: {
    durationMs: number;
    success: boolean;
  };
  
  // Metadata
  timestamps: {
    createdAt: string;
    updatedAt: string;
  };
  analyzerVersions: Record<string, string>; // Map of analyzer name to version
  
  createdAt: string;
}

export interface GrammarIssueBreakdown {
  spelling: number;
  punctuation: number;
  grammar: number;
  style: number;
  total: number;
}

export interface ReadabilityScores {
  fkGrade: number;
  smog: number;
  fog: number;
  daleChall: number;
  eduLevel: string;
}

export interface ToneSnapshot {
  primary: string;
  secondary: string;
  distribution: Record<string, number>;
}

export interface AnomalyReport {
  deviationScore: number;
  fingerprintStability: number;
  flaggedIssues: string[];
  confidence: number;
}

export interface StyleProfile {
  studentId: string;
  baselineFormality: number;
  baselineComplexity: number;
  baselineLexical: number;
  fingerprintStability: number;
  strengths: string[];
  weaknesses: string[];
}

export interface ClassAggregates {
  classAverages: {
    readability: number;
    grammarQuality: number;
    formality: number;
    complexity: number;
  };
  submissionRate: number;
  anomaliesCount: number;
  strugglingStudents: Student[];
  missingSubmissions: Submission[];
}
