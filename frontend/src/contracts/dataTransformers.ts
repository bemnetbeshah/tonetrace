import type { 
  AnalysisResult, 
  TrendLineDataPoint, 
  TonePieDataPoint,
  StudentPerformanceResponse 
} from './dataContracts';

/**
 * Data Transformers
 * Transform API responses into the format expected by chart components
 * Ensures data consistency when swapping mocks to real APIs
 */
export class DataTransformers {
  /**
   * Transform analysis history into trend line data
   * Maps createdAt + formality to {date, value} format
   */
  static toTrendLineData(
    analyses: AnalysisResult[],
    valueField: keyof Pick<AnalysisResult, 'formality' | 'complexity' | 'sentiment' | 'lexicalDiversity'>,
    dateField: keyof Pick<AnalysisResult, 'createdAt'> = 'createdAt'
  ): TrendLineDataPoint[] {
    if (!analyses || analyses.length === 0) {
      return [];
    }

    return analyses
      .filter(analysis => analysis[valueField] !== undefined && analysis[dateField] !== undefined)
      .map(analysis => ({
        date: analysis[dateField] as string,
        value: analysis[valueField] as number
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  /**
   * Transform tone distribution into pie chart data
   * Maps toneDistribution[] to {name, value} format
   */
  static toTonePieData(analyses: AnalysisResult[]): TonePieDataPoint[] {
    if (!analyses || analyses.length === 0) {
      return [];
    }

    // Aggregate tone distributions across all analyses
    const toneAggregator: Record<string, number> = {};
    let totalAnalyses = 0;

    analyses.forEach(analysis => {
      if (analysis.toneDistribution && Array.isArray(analysis.toneDistribution)) {
        totalAnalyses++;
        analysis.toneDistribution.forEach(tone => {
          if (tone.label && typeof tone.pct === 'number') {
            toneAggregator[tone.label] = (toneAggregator[tone.label] || 0) + tone.pct;
          }
        });
      }
    });

    if (totalAnalyses === 0) {
      return [];
    }

    // Convert to average percentages and sort by value
    return Object.entries(toneAggregator)
      .map(([label, totalPct]) => ({
        name: label,
        value: Math.round((totalPct / totalAnalyses) * 100) / 100
      }))
      .sort((a, b) => b.value - a.value)
      .filter(item => item.value > 0); // Only show tones with >0% presence
  }

  /**
   * Transform analysis history into multiple trend lines
   * Useful for comparing multiple metrics over time
   */
  static toMultiTrendLineData(
    analyses: AnalysisResult[],
    metrics: Array<{
      key: keyof Pick<AnalysisResult, 'formality' | 'complexity' | 'sentiment' | 'lexicalDiversity'>;
      label: string;
      color?: string;
    }>
  ): Array<TrendLineDataPoint & { metric: string; color?: string }> {
    if (!analyses || analyses.length === 0 || !metrics || metrics.length === 0) {
      return [];
    }

    const result: Array<TrendLineDataPoint & { metric: string; color?: string }> = [];

    metrics.forEach(metric => {
      const trendData = this.toTrendLineData(analyses, metric.key);
      trendData.forEach(point => {
        result.push({
          ...point,
          metric: metric.label,
          color: metric.color
        });
      });
    });

    return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  /**
   * Transform performance metrics into summary cards data
   */
  static toPerformanceSummary(performance: StudentPerformanceResponse) {
    return {
      formality: {
        value: performance.avgFormality,
        label: 'Average Formality',
        unit: '%',
        formatted: `${Math.round(performance.avgFormality * 100)}%`
      },
      complexity: {
        value: performance.avgComplexity,
        label: 'Average Complexity',
        unit: '%',
        formatted: `${Math.round(performance.avgComplexity * 100)}%`
      },
      readability: {
        value: performance.avgReadability,
        label: 'Average Readability',
        unit: 'FK Score',
        formatted: performance.avgReadability.toFixed(1)
      },
      grammar: {
        value: performance.avgGrammarIssues,
        label: 'Average Grammar Issues',
        unit: 'issues',
        formatted: performance.avgGrammarIssues.toFixed(1)
      }
    };
  }

  /**
   * Transform analysis results into summary statistics
   */
  static toAnalysisSummary(analyses: AnalysisResult[]) {
    if (!analyses || analyses.length === 0) {
      return {
        totalAnalyses: 0,
        averageFormality: 0,
        averageComplexity: 0,
        averageSentiment: 0,
        commonTones: [],
        recentActivity: null
      };
    }

    const totalAnalyses = analyses.length;
    const averageFormality = analyses.reduce((sum, a) => sum + a.formality, 0) / totalAnalyses;
    const averageComplexity = analyses.reduce((sum, a) => sum + a.complexity, 0) / totalAnalyses;
    const averageSentiment = analyses.reduce((sum, a) => sum + a.sentiment, 0) / totalAnalyses;

    // Get most common tones
    const toneCounts: Record<string, number> = {};
    analyses.forEach(analysis => {
      analysis.toneDistribution?.forEach(tone => {
        if (tone.label) {
          toneCounts[tone.label] = (toneCounts[tone.label] || 0) + 1;
        }
      });
    });

    const commonTones = Object.entries(toneCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([label]) => label);

    // Get most recent activity
    const sortedAnalyses = [...analyses].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const recentActivity = sortedAnalyses[0] ? {
      date: sortedAnalyses[0].createdAt,
      formality: sortedAnalyses[0].formality,
      complexity: sortedAnalyses[0].complexity
    } : null;

    return {
      totalAnalyses,
      averageFormality: Math.round(averageFormality * 100) / 100,
      averageComplexity: Math.round(averageComplexity * 100) / 100,
      averageSentiment: Math.round(averageSentiment * 100) / 100,
      commonTones,
      recentActivity
    };
  }

  /**
   * Transform student data into table format
   */
  static toStudentTableData(students: any[], analyses: AnalysisResult[] = []) {
    return students.map(student => {
      const studentAnalyses = analyses.filter(a => a.studentId === student.id);
      const summary = this.toAnalysisSummary(studentAnalyses);
      
      return {
        ...student,
        analysisCount: summary.totalAnalyses,
        lastActivity: summary.recentActivity?.date || student.lastSubmissionAt,
        averageFormality: summary.averageFormality,
        averageComplexity: summary.averageComplexity
      };
    });
  }

  /**
   * Transform assignment data into table format
   */
  static toAssignmentTableData(assignments: any[], analyses: AnalysisResult[] = []) {
    return assignments.map(assignment => {
      // This would need to be enhanced when we have assignment-specific analysis data
      return {
        ...assignment,
        submissionRate: assignment.totalCount > 0 
          ? Math.round((assignment.submittedCount / assignment.totalCount) * 100)
          : 0,
        daysUntilDue: this.calculateDaysUntilDue(assignment.dueDate)
      };
    });
  }

  /**
   * Calculate days until due date
   */
  private static calculateDaysUntilDue(dueDate: string): number {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /**
   * Validate transformed data structure
   */
  static validateTransformedData<T>(
    data: T,
    expectedStructure: Record<string, any>
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data || typeof data !== 'object') {
      errors.push('Transformed data is null, undefined, or not an object');
      return { isValid: false, errors };
    }

    Object.entries(expectedStructure).forEach(([key, expectedType]) => {
      if (!(key in data)) {
        errors.push(`Missing required field: ${key}`);
        return;
      }

      const value = (data as any)[key];
      if (expectedType === 'array' && !Array.isArray(value)) {
        errors.push(`Field ${key} should be an array, got ${typeof value}`);
      } else if (expectedType === 'string' && typeof value !== 'string') {
        errors.push(`Field ${key} should be a string, got ${typeof value}`);
      } else if (expectedType === 'number' && typeof value !== 'number') {
        errors.push(`Field ${key} should be a number, got ${typeof value}`);
      }
    });

    return { isValid: errors.length === 0, errors };
  }
}

export default DataTransformers; 