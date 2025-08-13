import { students, assignments, analyses, profiles, sleep } from '../mocks/mockData';
import type { AnalysisResult, StyleProfile } from '../types/analysis';
import type { Student } from '../types/student';

const FAKE_LATENCY = 450;

export const api = {
  // GET / - Root welcome
  async root(): Promise<{message:string}> {
    await sleep(FAKE_LATENCY);
    // PLACEHOLDER_API: replace with fetch('/')
    return { message: 'You are now using tonetrace API (mocked client)' };
  },

  // POST /analyze
  async analyze(_text: string, _studentId: string): Promise<AnalysisResult> {
    await sleep(FAKE_LATENCY);
    // PLACEHOLDER_API: POST to /analyze with {text, student_id}
    return analyses[0];
  },

  // POST /analyze/grammar
  async analyzeGrammar(_text: string) {
    await sleep(FAKE_LATENCY);
    // PLACEHOLDER_API: POST /analyze/grammar
    return analyses[1].grammarIssues;
  },

  // POST /analyze/readability
  async analyzeReadability(_text: string) {
    await sleep(FAKE_LATENCY);
    // PLACEHOLDER_API: POST /analyze/readability
    return analyses[2].readability;
  },

  // POST /analyze/lexical-richness
  async analyzeLexicalRichness(_text: string) {
    await sleep(FAKE_LATENCY);
    // PLACEHOLDER_API: POST /analyze/lexical-richness
    return { zipf: analyses[3].lexicalRichnessZipf };
  },

  // GET /analyze/history/{student_id}
  async history(studentId: string, limit=10): Promise<AnalysisResult[]> {
    await sleep(FAKE_LATENCY);
    // PLACEHOLDER_API: GET /analyze/history/{studentId}?limit=...
    return analyses.filter(a=>a.studentId===studentId).slice(0,limit);
  },

  // GET /profile/{student_id}
  async profile(studentId: string): Promise<StyleProfile> {
    await sleep(FAKE_LATENCY);
    // PLACEHOLDER_API: GET /profile/{studentId}
    const p = profiles.find(p=>p.studentId===studentId);
    if(!p) throw new Error('Not found');
    return p;
  },

  // GET /profile/{student_id}/history/*
  async profileHistory(studentId:string, _kind:'sentiment'|'formality'|'lexical-diversity'|'readability'|'grammar'|'tone') {
    await sleep(FAKE_LATENCY);
    // PLACEHOLDER_API: GET /profile/{id}/history/{kind}
    const data = analyses.filter(a=>a.studentId===studentId).map(a=>({
      date: a.createdAt,
      sentiment: a.sentiment,
      formality: a.formality,
      lexicalDiversity: a.lexicalDiversity,
      readability: a.readability.fk,
      grammar: a.grammarIssues.reduce((s,g)=>s+g.count,0),
      tone: a.toneDistribution
    }));
    return data;
  },

  // GET /profile/{student_id}/performance
  async performance(studentId:string){
    await sleep(FAKE_LATENCY);
    // PLACEHOLDER_API: GET /profile/{studentId}/performance
    const hist = analyses.filter(a=>a.studentId===studentId);
    const avg = (k:(a:AnalysisResult)=>number)=> hist.reduce((s,x)=>s+k(x),0)/Math.max(hist.length,1);
    return {
      avgFormality: avg(a=>a.formality),
      avgComplexity: avg(a=>a.complexity),
      avgReadability: avg(a=>a.readability.fk),
      avgGrammarIssues: avg(a=>a.grammarIssues.reduce((s,g)=>s+g.count,0))
    };
  },

  // GET /profile (placeholder)
  async myProfile(){ await sleep(FAKE_LATENCY); return { ok:true }; },

  // Students list for UI convenience (not an API endpoint, helper only)
  async listStudents(): Promise<Student[]>{ await sleep(FAKE_LATENCY); return students; },

  // Assignments list (helper only)
  async listAssignments(){ await sleep(FAKE_LATENCY); return assignments; }
}; 