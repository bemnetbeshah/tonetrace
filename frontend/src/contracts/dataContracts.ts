import type { 
  Student, 
  Assignment, 
  AnalysisResult, 
  StyleProfile 
} from '../types';

// API Response types for contracts
export interface StudentsListResponse {
  students: Student[];
}

export interface AssignmentsListResponse {
  assignments: Assignment[];
}

export interface StudentHistoryResponse {
  analyses: AnalysisResult[];
}

export interface StudentProfileResponse {
  profile: StyleProfile;
}

export interface StudentPerformanceResponse {
  avgFormality: number;
  avgComplexity: number;
  avgReadability: number;
  avgGrammarIssues: number;
}

export interface AnalysisSubmissionResponse {
  analysis: AnalysisResult;
}

// Data transformation interfaces
export interface TrendLineDataPoint {
  date: string;
  value: number;
}

export interface TonePieDataPoint {
  name: string;
  value: number;
}

// Component data contract definitions
export interface ComponentDataContract {
  component: string;
  requires: APIContract[];
  transforms?: DataTransform[];
  actions_future?: string[];
  description?: string;
}

export interface APIContract {
  method: string;
  endpoint: string;
  params?: Record<string, any>;
  response: any;
  description: string;
}

export interface DataTransform {
  component: string;
  expects: string;
  source: string;
  mapping: string;
  description: string;
}

/**
 * Data Contracts for Component Boundaries
 * Documents what each page expects from the service layer
 * Makes swapping mocks to real APIs risk-free
 */
export const DATA_CONTRACTS: ComponentDataContract[] = [
  {
    component: 'DashboardPage',
    description: 'Main dashboard showing student overview and trends',
    requires: [
      {
        method: 'GET',
        endpoint: '/api/students',
        response: 'Student[]',
        description: 'List all students for overview cards and navigation'
      },
      {
        method: 'GET',
        endpoint: '/api/assignments',
        response: 'Assignment[]',
        description: 'List all assignments for progress tracking'
      },
      {
        method: 'GET',
        endpoint: '/api/analyze/history/{studentId}',
        params: { limit: 'number' },
        response: 'AnalysisResult[]',
        description: 'Get analysis history for trend calculations'
      }
    ],
    transforms: [
      {
        component: 'TrendLine',
        expects: '{date: string, value: number}',
        source: 'AnalysisResult.createdAt + AnalysisResult.formality',
        mapping: 'map(analysis => ({ date: analysis.createdAt, value: analysis.formality }))',
        description: 'Transform analysis history into trend line data format'
      },
      {
        component: 'TonePie',
        expects: '{name: string, value: number}',
        source: 'AnalysisResult.toneDistribution[]',
        mapping: 'map(tone => ({ name: tone.label, value: tone.pct }))',
        description: 'Transform tone distribution into pie chart data format'
      }
    ]
  },
  
  {
    component: 'StudentsPage',
    description: 'List view of all students with basic information',
    requires: [
      {
        method: 'GET',
        endpoint: '/api/students',
        response: 'Student[]',
        description: 'List all students for table display'
      }
    ]
  },
  
  {
    component: 'StudentDetailPage',
    description: 'Detailed view of individual student with analysis history',
    requires: [
      {
        method: 'GET',
        endpoint: '/api/analyze/history/{studentId}',
        params: { limit: 'number' },
        response: 'AnalysisResult[]',
        description: 'Get analysis history for charts and trends'
      },
      {
        method: 'GET',
        endpoint: '/api/profile/{studentId}',
        response: 'StyleProfile',
        description: 'Get student style profile for baseline comparisons'
      },
      {
        method: 'GET',
        endpoint: '/api/profile/{studentId}/performance',
        response: 'StudentPerformanceResponse',
        description: 'Get aggregated performance metrics for summary cards'
      }
    ],
    transforms: [
      {
        component: 'TrendLine',
        expects: '{date: string, value: number}',
        source: 'AnalysisResult.createdAt + AnalysisResult.formality',
        mapping: 'map(analysis => ({ date: analysis.createdAt, value: analysis.formality }))',
        description: 'Transform formality history into trend line format'
      },
      {
        component: 'TonePie',
        expects: '{name: string, value: number}',
        source: 'AnalysisResult.toneDistribution[]',
        mapping: 'map(tone => ({ name: tone.label, value: tone.pct }))',
        description: 'Transform tone distribution into pie chart format'
      }
    ]
  },
  
  {
    component: 'AssignmentsPage',
    description: 'List view of all assignments with submission tracking',
    requires: [
      {
        method: 'GET',
        endpoint: '/api/assignments',
        response: 'Assignment[]',
        description: 'List all assignments for table display'
      }
    ],
    actions_future: [
      'POST /api/analyze - Submit individual text for analysis',
      'POST /api/analyze/batch - Submit multiple assignments for batch analysis'
    ]
  }
];

// Helper functions for contract validation
export const contractHelpers = {
  /**
   * Get contract for a specific component
   */
  getContract(componentName: string): ComponentDataContract | undefined {
    return DATA_CONTRACTS.find(contract => contract.component === componentName);
  },

  /**
   * Get all required API endpoints for a component
   */
  getRequiredEndpoints(componentName: string): string[] {
    const contract = this.getContract(componentName);
    return contract?.requires.map(req => req.endpoint) || [];
  },

  /**
   * Get all data transformations for a component
   */
  getDataTransforms(componentName: string): DataTransform[] {
    const contract = this.getContract(componentName);
    return contract?.transforms || [];
  },

  /**
   * Validate that API response matches expected contract
   */
  validateResponse<T>(
    componentName: string, 
    endpoint: string, 
    response: T
  ): { isValid: boolean; errors: string[] } {
    const contract = this.getContract(componentName);
    if (!contract) {
      return { isValid: false, errors: [`No contract found for component: ${componentName}`] };
    }

    const apiContract = contract.requires.find(req => req.endpoint === endpoint);
    if (!apiContract) {
      return { isValid: false, errors: [`Endpoint ${endpoint} not found in contract for ${componentName}`] };
    }

    // Basic validation - in production, you might want more sophisticated validation
    const errors: string[] = [];
    
    if (response === null || response === undefined) {
      errors.push(`Response is null/undefined for ${endpoint}`);
    }

    return { isValid: errors.length === 0, errors };
  },

  /**
   * Get mock data structure that matches contract requirements
   */
  getMockDataStructure(componentName: string): Record<string, any> {
    const contract = this.getContract(componentName);
    if (!contract) return {};

    const mockStructure: Record<string, any> = {};
    
    contract.requires.forEach(req => {
      const key = req.endpoint.split('/').pop() || req.endpoint;
      mockStructure[key] = {
        description: req.description,
        expectedType: req.response,
        params: req.params,
        mockData: this.generateMockData(req.response)
      };
    });

    return mockStructure;
  },

  /**
   * Generate basic mock data based on expected response type
   */
  generateMockData(responseType: string): any {
    switch (responseType) {
      case 'Student[]':
        return [
          { id: '1', name: 'John Doe', email: 'john@example.com' },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
        ];
      case 'Assignment[]':
        return [
          { id: '1', title: 'Essay 1', dueDate: '2024-01-15', submittedCount: 15, totalCount: 20 },
          { id: '2', title: 'Essay 2', dueDate: '2024-01-30', submittedCount: 12, totalCount: 20 }
        ];
      case 'AnalysisResult[]':
        return [
          { id: '1', studentId: '1', createdAt: '2024-01-01', formality: 0.8, complexity: 0.6 }
        ];
      case 'StyleProfile':
        return {
          studentId: '1',
          baselineFormality: 0.7,
          baselineComplexity: 0.5,
          baselineLexical: 0.6,
          fingerprintStability: 0.8,
          strengths: ['Clear writing', 'Good structure'],
          weaknesses: ['Passive voice', 'Complex sentences']
        };
      case 'StudentPerformanceResponse':
        return {
          avgFormality: 0.75,
          avgComplexity: 0.65,
          avgReadability: 0.7,
          avgGrammarIssues: 2.3
        };
      default:
        return null;
    }
  }
};

export default DATA_CONTRACTS; 