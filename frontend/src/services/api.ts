import { CONFIG, FORCE_MOCK, type EndpointId } from '../utils/config';
import { realApi, realApiWithFallback } from './realApi';
import { mockApi } from './mockApi';

function pick<T extends EndpointId, F extends keyof typeof realApi & keyof typeof mockApi>(id: T, fn: F) {
  const useMock = CONFIG.USE_MOCKS || FORCE_MOCK[id];
  const api = useMock ? mockApi : realApi;
  return (api as any)[fn].bind(api);
}

export const api = {
  analyze: pick('analyze_full', 'analyze'),
  analyzeGrammar: pick('analyze_grammar', 'analyzeGrammar'),
  analyzeReadability: pick('analyze_readability', 'analyzeReadability'),
  analyzeLexicalRichness: pick('analyze_lexical_richness', 'analyzeLexicalRichness'),
  // Prefer mock for these three when flags demand, otherwise use real with fallback
  history: pick('history_by_student', 'history'),
  profile: pick('student_profile', 'profile'),
  listAssignments: pick('assignments_overview', 'listAssignments')
}; 