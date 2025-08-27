import { api } from '../services/api';

// Mock the config to avoid import.meta.env issues in Jest
jest.mock('../utils/config', () => ({
  CONFIG: { USE_MOCKS: true },
  FORCE_MOCK: {
    analyze_full: false,
    analyze_grammar: false,
    analyze_readability: false,
    analyze_lexical_richness: false,
    history_by_student: true,
    student_profile: true,
    assignments_overview: true
  }
}));

test('analyze returns object', async () => {
  const res = await api.analyze({ text: 'Hello world', student_id: 'default' });
  expect(res).toBeTruthy();
});

test('mock endpoints remain stable when USE_MOCKS=true', async () => {
  const a = await api.listAssignments();
  expect(Array.isArray(a.assignments)).toBe(true);
});
