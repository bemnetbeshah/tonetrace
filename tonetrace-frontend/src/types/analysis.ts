export type ToneLabel = 'optimistic'|'neutral'|'emotional'|'frustrated'|'joy'|'sad'|'anger'|'fear'|'surprise'|'disgust'|'other';

export interface ReadabilityScores { 
  fk: number; 
  smog: number; 
  gunningFog: number; 
  daleChall: number; 
}

export interface GrammarIssue { 
  type: string; 
  count: number; 
}

export interface AnalysisResult {
  id: string;
  studentId: string;
  createdAt: string;
  formality: number;
  complexity: number;
  sentiment: number; // -1 to 1
  passiveVoicePct: number;
  lexicalDiversity: number; // 0 to 1
  lexicalRichnessZipf: number; // 1 to 7
  readability: ReadabilityScores;
  grammarIssues: GrammarIssue[];
  toneDistribution: { label: ToneLabel; pct: number }[];
  anomalyScore: number; // 0 to 1
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