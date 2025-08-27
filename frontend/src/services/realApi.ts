import { http } from './http';

export const realApi = {
  analyze: (payload: { text: string; student_id: string; }) => http.post('/analyze', payload),
  analyzeGrammar: (payload: { text: string; }) => http.post('/analyze/grammar', payload),
  analyzeReadability: (payload: { text: string; }) => http.post('/analyze/readability', payload),
  analyzeLexicalRichness: (payload: { text: string; }) => http.post('/analyze/lexical-richness', payload),
  history: (studentId: string, limit = 10) => http.get(`/analyze/history/${encodeURIComponent(studentId)}?limit=${limit}`),
  profile: (studentId: string) => Promise.reject(new Error('profile is mock-only in this phase')),
  listAssignments: () => Promise.reject(new Error('assignments_overview is mock-only in this phase'))
};

export type RealApi = typeof realApi;

// Optional fallback to mock data on failure for demo stability
import { mockApi } from './mockApi';

export const withFallback = async <T>(p: Promise<T>, fb: () => Promise<T>) => {
  try {
    return await p;
  } catch {
    return await fb();
  }
};

// Example: keep dashboard stable even if backend is down
export const realApiWithFallback = {
  ...realApi,
  listAssignments: () => withFallback(
    (realApi as any)['listAssignments']?.(), 
    () => mockApi.listAssignments()
  ),
  history: (studentId: string, limit = 10) => withFallback(
    (realApi as any).history(studentId, limit), 
    () => mockApi.history(studentId, limit)
  )
};
