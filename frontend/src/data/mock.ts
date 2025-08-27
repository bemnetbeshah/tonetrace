import { 
  Student, 
  Assignment, 
  Submission, 
  AnalysisMetrics, 
  ClassAggregates 
} from '../types/models';

// Seeded random number generator for consistent data
class SeededRandom {
  private seed: number;
  
  constructor(seed: number) {
    this.seed = seed;
  }
  
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
  
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  
  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }
  
  choice<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }
}

const rng = new SeededRandom(12345);

// Sample data arrays
const studentNames = [
  'Emma Thompson', 'James Wilson', 'Sophia Chen', 'Michael Rodriguez',
  'Olivia Davis', 'William Brown', 'Ava Johnson', 'Ethan Miller',
  'Isabella Garcia', 'Noah Martinez', 'Mia Anderson', 'Lucas Taylor',
  'Charlotte White', 'Benjamin Lee', 'Amelia Clark', 'Henry Lewis',
  'Harper Walker', 'Sebastian Hall', 'Evelyn Young', 'Jack Allen',
  'Abigail King', 'Owen Wright', 'Emily Scott', 'Daniel Green'
];

const assignmentTitles = [
  'Argumentative Essay on Climate Change',
  'Literary Analysis: Shakespeare Sonnets',
  'Research Paper: Historical Events',
  'Creative Writing: Personal Narrative',
  'Analytical Essay: Modern Literature'
];

const toneTypes = ['formal', 'academic', 'conversational', 'emotional', 'technical', 'creative'];
const grammarQualities = ['excellent', 'good', 'fair', 'poor'] as const;
const educationLevels = ['elementary', 'middle', 'high', 'college'] as const;

export function buildMockDataset(countStudents = 24, countAssignments = 5) {
  const students: Student[] = [];
  const assignments: Assignment[] = [];
  const submissions: Submission[] = [];
  const analyses: AnalysisMetrics[] = [];
  
  // Generate students
  for (let i = 0; i < countStudents; i++) {
    const student: Student = {
      id: (i + 1).toString(),
      name: studentNames[i],
      email: `${studentNames[i].toLowerCase().replace(' ', '.')}@school.edu`,
      createdAt: new Date(2024, 0, 15).toISOString(),
      riskLevel: rng.choice(['low', 'medium', 'high']),
      baselineStyleProfile: {
        studentId: (i + 1).toString(),
        baselineFormality: rng.nextFloat(0.3, 0.9),
        baselineComplexity: rng.nextFloat(0.2, 0.8),
        baselineLexical: rng.nextFloat(0.4, 0.9),
        fingerprintStability: rng.nextFloat(0.6, 0.95),
        strengths: rng.choice([
          ['Grammar accuracy', 'Clear structure'],
          ['Vocabulary richness', 'Creative expression'],
          ['Logical flow', 'Evidence usage'],
          ['Technical precision', 'Analytical thinking']
        ]),
        weaknesses: rng.choice([
          ['Sentence variety', 'Transition words'],
          ['Passive voice', 'Word repetition'],
          ['Complexity balance', 'Formality consistency'],
          ['Argument strength', 'Source integration']
        ])
      }
    };
    students.push(student);
  }
  
  // Generate assignments
  for (let i = 0; i < countAssignments; i++) {
    const assignment: Assignment = {
      id: (i + 1).toString(),
      title: assignmentTitles[i],
      dueDate: new Date(2024, 1, 15 + i * 5).toISOString(),
      submittedCount: rng.nextInt(countStudents * 0.8, countStudents),
      totalCount: countStudents,
      classAverage: rng.nextFloat(70, 90),
      hasOutliers: rng.next() > 0.5
    };
    assignments.push(assignment);
  }
  
  // Generate submissions and analyses
  for (const assignment of assignments) {
    for (const student of students) {
      if (rng.next() < 0.9) { // 90% submission rate
        const submission: Submission = {
          id: `${student.id}-${assignment.id}`,
          studentId: student.id,
          assignmentId: assignment.id,
          text: `Sample text for ${assignment.title} by ${student.name}`,
          submittedAt: new Date(assignment.dueDate).toISOString(),
          analysisResultId: `${student.id}-${assignment.id}-analysis`
        };
        submissions.push(submission);
        
        // Generate analysis metrics
        const analysis: AnalysisMetrics = {
          id: `${student.id}-${assignment.id}-analysis`,
          submissionId: submission.id,
          studentId: student.id,
          assignmentId: assignment.id,
          
          formality: rng.nextFloat(0.3, 0.9),
          complexity: rng.nextFloat(0.2, 0.8),
          
          sentiment: {
            polarity: rng.nextFloat(-0.5, 0.8),
            subjectivity: rng.nextFloat(0.1, 0.9),
            bucket: rng.next() > 0.6 ? 'positive' : rng.next() > 0.3 ? 'neutral' : 'negative'
          },
          
          passivePercent: rng.nextFloat(5, 35),
          lexicalDiversity: rng.nextFloat(0.4, 0.9),
          zipfRichness: rng.nextFloat(1, 7),
          
          readability: {
            fkGrade: rng.nextFloat(6, 16),
            smog: rng.nextFloat(5, 15),
            fog: rng.nextFloat(6, 18),
            daleChall: rng.nextFloat(4, 12),
            eduLevel: rng.choice(educationLevels)
          },
          
          grammar: {
            byType: {
              spelling: rng.nextInt(0, 5),
              punctuation: rng.nextInt(0, 8),
              grammar: rng.nextInt(0, 6),
              style: rng.nextInt(0, 4)
            },
            quality: rng.choice(grammarQualities)
          },
          
          hedging: {
            density: rng.nextFloat(0.1, 0.6),
            assertiveness: rng.nextFloat(0.3, 0.9)
          },
          
          styleMetrics: {
            avgSentenceLength: rng.nextFloat(15, 35),
            wordCount: rng.nextInt(300, 1200),
            sentenceCount: rng.nextInt(15, 50)
          },
          
          tone: {
            primary: rng.choice(toneTypes),
            secondary: rng.choice(toneTypes.filter(t => t !== rng.choice(toneTypes))),
            distribution: Object.fromEntries(
              toneTypes.map(tone => [tone, rng.nextFloat(0, 0.4)])
            )
          },
          
          anomaly: {
            deviationScore: rng.nextFloat(0, 0.8),
            fingerprintStability: rng.nextFloat(0.5, 0.95)
          },
          
          performance: {
            durationMs: rng.nextInt(500, 3000),
            success: rng.next() > 0.1
          },
          
          timestamps: {
            createdAt: submission.submittedAt,
            updatedAt: submission.submittedAt
          },
          
          analyzerVersions: {
            'grammar-analyzer': '2.1.0',
            'sentiment-analyzer': '1.8.3',
            'readability-analyzer': '3.0.1',
            'tone-analyzer': '2.5.2'
          },
          
          createdAt: submission.submittedAt
        };
        analyses.push(analysis);
      }
    }
  }
  
  return { students, assignments, submissions, analyses };
}

export function computeClassAggregates(dataset: ReturnType<typeof buildMockDataset>): ClassAggregates {
  const { students, assignments, submissions, analyses } = dataset;
  
  // Calculate class averages
  const readabilityScores = analyses.map(a => a.readability.fkGrade);
  const grammarQualities = analyses.map(a => {
    const qualityMap = { excellent: 95, good: 80, fair: 65, poor: 45 };
    return qualityMap[a.grammar.quality];
  });
  const formalityScores = analyses.map(a => a.formality);
  const complexityScores = analyses.map(a => a.complexity);
  
  const classAverages = {
    readability: readabilityScores.reduce((a, b) => a + b, 0) / readabilityScores.length,
    grammarQuality: grammarQualities.reduce((a, b) => a + b, 0) / grammarQualities.length,
    formality: formalityScores.reduce((a, b) => a + b, 0) / formalityScores.length,
    complexity: complexityScores.reduce((a, b) => a + b, 0) / complexityScores.length
  };
  
  // Calculate submission rate
  const totalPossibleSubmissions = students.length * assignments.length;
  const submissionRate = (submissions.length / totalPossibleSubmissions) * 100;
  
  // Count anomalies
  const anomaliesCount = analyses.filter(a => a.anomaly.deviationScore > 0.6).length;
  
  // Find struggling students (high anomaly scores or low performance)
  const strugglingStudents = students.filter(student => {
    const studentAnalyses = analyses.filter(a => a.studentId === student.id);
    if (studentAnalyses.length === 0) return false;
    
    const avgAnomalyScore = studentAnalyses.reduce((sum, a) => sum + a.anomaly.deviationScore, 0) / studentAnalyses.length;
    const avgGrammarQuality = studentAnalyses.reduce((sum, a) => {
      const qualityMap = { excellent: 95, good: 80, fair: 65, poor: 45 };
      return sum + qualityMap[a.grammar.quality];
    }, 0) / studentAnalyses.length;
    
    return avgAnomalyScore > 0.5 || avgGrammarQuality < 70;
  });
  
  // Find missing submissions
  const missingSubmissions: Submission[] = [];
  for (const student of students) {
    for (const assignment of assignments) {
      const hasSubmission = submissions.some(s => 
        s.studentId === student.id && s.assignmentId === assignment.id
      );
      if (!hasSubmission) {
        missingSubmissions.push({
          id: `missing-${student.id}-${assignment.id}`,
          studentId: student.id,
          assignmentId: assignment.id,
          text: '',
          submittedAt: '',
          analysisResultId: ''
        });
      }
    }
  }
  
  return {
    classAverages,
    submissionRate,
    anomaliesCount,
    strugglingStudents,
    missingSubmissions
  };
}
