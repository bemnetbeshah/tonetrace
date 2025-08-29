import { analyses, students, assignments, profiles } from '../mocks/mockData';

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

const LAT = 450;

export const mockApi = {
  async analyze(_: { text: string; student_id: string; }) { 
    await sleep(LAT); 
    return analyses[0]; 
  },
  
  async analyzeGrammar(_: { text: string; }) { 
    await sleep(LAT); 
    return { issues: [] }; 
  },
  
  async analyzeReadability(_: { text: string; }) { 
    await sleep(LAT); 
    return { 
      scores: { 
        flesch_kincaid_grade: 72.1, 
        smog_index: 8.5 
      }, 
      interpretations: { 
        grade_level: '7th grade', 
        complexity: 'moderate' 
      } 
    }; 
  },
  
  async analyzeLexicalRichness(_: { text: string; }) { 
    await sleep(LAT); 
    return { 
      zipf: 5.2, 
      rare_words_pct: 15.3 
    }; 
  },
  
  async history(studentId: string, limit = 10) { 
    await sleep(LAT); 
    return { 
      items: analyses.filter(a => a.studentId === studentId).slice(0, limit), 
      total: analyses.filter(a => a.studentId === studentId).length, 
      limit 
    }; 
  },
  
  async profile(studentId: string) { 
    await sleep(LAT); 
    return profiles.find(p => p.studentId === studentId) ?? profiles[0]; 
  },
  
  async listAssignments() { 
    await sleep(LAT); 
    return { assignments }; 
  }
};

export type MockApi = typeof mockApi;



