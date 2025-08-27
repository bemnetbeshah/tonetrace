export const CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL as string,
  USE_MOCKS: (import.meta.env.VITE_USE_MOCKS as string) === 'true'
};

export type EndpointId = 'analyze_full' | 'analyze_grammar' | 'analyze_readability' | 'analyze_lexical_richness' | 'history_by_student' | 'student_profile' | 'assignments_overview';

export const FORCE_MOCK: Record<EndpointId, boolean> = {
  analyze_full: false,
  analyze_grammar: false,
  analyze_readability: false,
  analyze_lexical_richness: false,
  history_by_student: true,
  student_profile: true,
  assignments_overview: true
};
