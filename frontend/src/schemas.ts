import { z } from 'zod';

export const StudentSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.string(),
  riskLevel: z.enum(['low', 'medium', 'high']),
});

export const AssignmentSchema = z.object({
  id: z.string(),
  title: z.string(),
  dueDate: z.string(),
  submittedCount: z.number().int().min(0),
  totalCount: z.number().int().min(0),
  classAverage: z.number().min(0).max(100),
  hasOutliers: z.boolean(),
});

export const SubmissionSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  assignmentId: z.string(),
  text: z.string(),
  submittedAt: z.string(),
  analysisResultId: z.string(),
});

export const ComplexitySchema = z.object({
  lexicalDensity: z.number().min(0).max(1),
  avgSentenceLen: z.number().min(0),
});

export const SentimentSchema = z.object({
  polarity: z.number().min(-1).max(1),
  subjectivity: z.number().min(0).max(1),
});

export const LexicalRichnessSchema = z.object({
  zipfAvg: z.number().min(1).max(7),
});

export const ReadabilitySchema = z.object({
  fkgl: z.number().min(0),
  smog: z.number().min(0),
  fog: z.number().min(0),
  daleChall: z.number().min(0),
  eduLevel: z.enum(['elementary', 'middle', 'high', 'college']),
});

export const GrammarIssuesSchema = z.object({
  spelling: z.number().int().min(0),
  punctuation: z.number().int().min(0),
  grammar: z.number().int().min(0),
  style: z.number().int().min(0),
});

export const StyleMetricsSchema = z.object({
  sentenceVariety: z.number().min(0).max(1),
  wordChoice: z.number().min(0).max(1),
  flow: z.number().min(0).max(1),
});

export const ToneDistributionSchema = z.object({
  formal: z.number().min(0).max(1),
  academic: z.number().min(0).max(1),
  conversational: z.number().min(0).max(1),
  emotional: z.number().min(0).max(1),
});

export const AnalysisResultSchema = z.object({
  id: z.string(),
  submissionId: z.string(),
  studentId: z.string(),
  assignmentId: z.string(),
  formality: z.number().min(0).max(1),
  complexity: ComplexitySchema,
  sentiment: SentimentSchema,
  passiveVoicePct: z.number().min(0).max(100),
  lexicalDiversity: z.number().min(0).max(1),
  lexicalRichness: LexicalRichnessSchema,
  readability: ReadabilitySchema,
  grammarIssues: GrammarIssuesSchema,
  grammarQuality: z.number().min(0).max(100),
  hedgingDensity: z.number().min(0).max(1),
  styleMetrics: StyleMetricsSchema,
  toneDistribution: ToneDistributionSchema,
  anomalyScore: z.number().min(0).max(1),
  createdAt: z.string(),
});

export const TrendPointSchema = z.object({
  date: z.string(),
  value: z.number(),
  label: z.string(),
});

export const TrendSeriesSchema = z.object({
  name: z.string(),
  data: z.array(TrendPointSchema),
  color: z.string(),
});

export const TrendSchema = z.object({
  readability: TrendSeriesSchema,
  grammarErrors: TrendSeriesSchema,
  toneDistribution: TrendSeriesSchema,
  sentiment: TrendSeriesSchema,
  formality: TrendSeriesSchema,
  lexicalDiversity: TrendSeriesSchema,
});

export const KPISchema = z.object({
  title: z.string(),
  value: z.union([z.string(), z.number()]),
  sublabel: z.string(),
  trend: z.object({
    direction: z.enum(['up', 'down', 'flat']),
    value: z.number(),
    percentage: z.boolean(),
  }),
  icon: z.string(),
});

export const NotificationItemSchema = z.object({
  id: z.string(),
  type: z.enum(['missing', 'anomaly', 'struggling', 'improvement', 'alert']),
  title: z.string(),
  message: z.string(),
  count: z.number().optional(),
  studentName: z.string().optional(),
  assignmentTitle: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  createdAt: z.string(),
  actionUrl: z.string().optional(),
});

export const DashboardSummarySchema = z.object({
  kpis: z.array(KPISchema),
  trends: TrendSchema,
  recentNotifications: z.array(NotificationItemSchema),
  classInfo: z.object({
    name: z.string(),
    term: z.string(),
    studentCount: z.number().int().min(0),
    latestAssignment: z.object({
      title: z.string(),
      dueDate: z.string(),
      submissionRate: z.number().min(0).max(100),
    }),
  }),
});

// Export types from schemas
export type Student = z.infer<typeof StudentSchema>;
export type Assignment = z.infer<typeof AssignmentSchema>;
export type Submission = z.infer<typeof SubmissionSchema>;
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
export type KPI = z.infer<typeof KPISchema>;
export type NotificationItem = z.infer<typeof NotificationItemSchema>;
export type DashboardSummary = z.infer<typeof DashboardSummarySchema>;
export type TrendSeries = z.infer<typeof TrendSeriesSchema>;
