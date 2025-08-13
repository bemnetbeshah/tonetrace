import type { AnalysisResult, StyleProfile } from '../types/analysis';
import type { Student, Assignment } from '../types/student';

export const students: Student[] = [
  { id:'s1', name:'Ava Johnson', email:'ava@example.com', lastSubmissionAt: new Date().toISOString() },
  { id:'s2', name:'Liam Chen', email:'liam@example.com' },
  { id:'s3', name:'Maya Patel', email:'maya@example.com' },
  { id:'s4', name:'Omar Ali', email:'omar@example.com' }
];

export const assignments: Assignment[] = [
  { id:'a1', title:'Privacy and Drones', dueDate:'2025-09-01', submittedCount:3, totalCount:4 },
  { id:'a2', title:'What Causes Racism', dueDate:'2025-09-15', submittedCount:0, totalCount:4 }
];

export const analyses: AnalysisResult[] = Array.from({length:24}).map((_,i)=>({
  id:`r${i}`, studentId: students[i%students.length].id, createdAt: new Date(Date.now()-i*86400000).toISOString(),
  formality: 40+Math.random()*30, complexity: 45+Math.random()*25, sentiment: -0.2+Math.random()*0.8,
  passiveVoicePct: Math.random()*25, lexicalDiversity: 0.5+Math.random()*0.4, lexicalRichnessZipf: 3+Math.random()*2,
  readability: { fk:60+Math.random()*20, smog:10+Math.random()*3, gunningFog:12+Math.random()*5, daleChall:7+Math.random()*2 },
  grammarIssues: [ {type:'passive_voice', count: Math.floor(Math.random()*6)}, {type:'fragments', count: Math.floor(Math.random()*4)}, {type:'agreement', count: Math.floor(Math.random()*3)} ],
  toneDistribution: [ {label:'optimistic', pct:37.5}, {label:'neutral', pct:23.7}, {label:'emotional', pct:27.3}, {label:'frustrated', pct:11.5} ],
  anomalyScore: Math.random()
}));

export const profiles: StyleProfile[] = students.map(s=>({ 
  studentId:s.id, 
  baselineFormality:55, 
  baselineComplexity:60, 
  baselineLexical:0.65, 
  fingerprintStability:0.82, 
  strengths:['clarity','structure'], 
  weaknesses:['passive voice'] 
}));

export const sleep = (ms:number)=> new Promise(r=>setTimeout(r,ms)); 