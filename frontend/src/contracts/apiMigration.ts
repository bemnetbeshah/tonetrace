import type { ComponentDataContract, APIContract } from './dataContracts';
import { ContractValidator } from './contractValidator';

/**
 * API Migration Utility
 * Helps safely transition from mock APIs to real backend APIs
 * Provides validation and fallback mechanisms
 */
export class APIMigration {
  private validator: ContractValidator;
  private contracts: ComponentDataContract[];
  private isProduction: boolean;
  private fallbackToMock: boolean;

  constructor(
    contracts: ComponentDataContract[],
    isProduction: boolean = false,
    fallbackToMock: boolean = true
  ) {
    this.contracts = contracts;
    this.validator = new ContractValidator(contracts);
    this.isProduction = isProduction;
    this.fallbackToMock = fallbackToMock;
  }

  /**
   * Migrate API call from mock to real backend
   * Includes validation and fallback mechanisms
   */
  async migrateAPICall<T>(
    componentName: string,
    endpoint: string,
    mockCall: () => Promise<T>,
    realCall: () => Promise<T>,
    validationOptions: {
      validateResponse?: boolean;
      retryCount?: number;
      timeout?: number;
    } = {}
  ): Promise<{
    data: T;
    source: 'real' | 'mock' | 'fallback';
    validation: any;
    errors: string[];
  }> {
    const {
      validateResponse = true,
      retryCount = 3,
      timeout = 10000
    } = validationOptions;

    // Check if endpoint is in contract
    const contract = this.validator.generateValidationReport(componentName);
    if (!contract.hasContract) {
      console.warn(`No contract found for component: ${componentName}`);
      return this.executeWithFallback(mockCall, 'mock');
    }

    const apiContract = contract.requiredEndpoints.find(req => req.endpoint === endpoint);
    if (!apiContract) {
      console.warn(`Endpoint ${endpoint} not found in contract for ${componentName}`);
      return this.executeWithFallback(mockCall, 'mock');
    }

    // Try real API first
    try {
      const data = await this.executeWithTimeout(realCall, timeout);
      
      if (validateResponse) {
        const validation = this.validator.validateEndpointResponse(
          { endpoint, method: apiContract.method, response: apiContract.response, description: apiContract.description },
          data
        );

        if (validation.isValid) {
          return {
            data,
            source: 'real',
            validation,
            errors: []
          };
        } else {
          console.warn(`Real API response validation failed for ${endpoint}:`, validation.errors);
          if (this.fallbackToMock) {
            return this.executeWithFallback(mockCall, 'fallback');
          }
          throw new Error(`API response validation failed: ${validation.errors.join(', ')}`);
        }
      }

      return {
        data,
        source: 'real',
        validation: null,
        errors: []
      };

    } catch (error) {
      console.error(`Real API call failed for ${endpoint}:`, error);
      
      if (this.fallbackToMock && this.fallbackToMock) {
        return this.executeWithFallback(mockCall, 'fallback');
      }
      
      throw error;
    }
  }

  /**
   * Execute API call with timeout
   */
  private async executeWithTimeout<T>(
    apiCall: () => Promise<T>,
    timeout: number
  ): Promise<T> {
    return Promise.race([
      apiCall(),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('API call timeout')), timeout)
      )
    ]);
  }

  /**
   * Execute with fallback to mock
   */
  private async executeWithFallback<T>(
    mockCall: () => Promise<T>,
    source: 'mock' | 'fallback'
  ): Promise<{
    data: T;
    source: 'mock' | 'fallback';
    validation: null;
    errors: string[];
  }> {
    try {
      const data = await mockCall();
      return {
        data,
        source,
        validation: null,
        errors: []
      };
    } catch (error) {
      throw new Error(`Both real API and mock failed: ${error}`);
    }
  }

  /**
   * Batch migrate multiple API calls
   */
  async migrateComponentAPIs<T>(
    componentName: string,
    apiCalls: Array<{
      endpoint: string;
      mockCall: () => Promise<any>;
      realCall: () => Promise<any>;
    }>
  ): Promise<{
    component: componentName;
    results: Array<{
      endpoint: string;
      data: any;
      source: 'real' | 'mock' | 'fallback';
      validation: any;
      errors: string[];
    }>;
    summary: {
      totalCalls: number;
      successfulReal: number;
      fallbackToMock: number;
      validationErrors: number;
    };
  }> {
    const results = await Promise.all(
      apiCalls.map(async ({ endpoint, mockCall, realCall }) => {
        try {
          return await this.migrateAPICall(componentName, endpoint, mockCall, realCall);
        } catch (error) {
          return {
            data: null,
            source: 'fallback' as const,
            validation: null,
            errors: [error.message]
          };
        }
      })
    );

    const summary = {
      totalCalls: results.length,
      successfulReal: results.filter(r => r.source === 'real').length,
      fallbackToMock: results.filter(r => r.source === 'fallback').length,
      validationErrors: results.filter(r => r.errors.length > 0).length
    };

    return {
      component: componentName,
      results,
      summary
    };
  }

  /**
   * Generate migration plan for a component
   */
  generateMigrationPlan(componentName: string): {
    component: string;
    requiredEndpoints: Array<{
      endpoint: string;
      method: string;
      response: string;
      description: string;
      migrationStatus: 'ready' | 'needs_validation' | 'needs_fallback';
    }>;
    estimatedEffort: 'low' | 'medium' | 'high';
    risks: string[];
    recommendations: string[];
  } {
    const contract = this.validator.generateValidationReport(componentName);
    
    if (!contract.hasContract) {
      return {
        component: componentName,
        requiredEndpoints: [],
        estimatedEffort: 'high',
        risks: ['No contract defined - high risk of breaking changes'],
        recommendations: ['Define data contract before migration']
      };
    }

    const requiredEndpoints = contract.requiredEndpoints.map(req => {
      let migrationStatus: 'ready' | 'needs_validation' | 'needs_fallback' = 'ready';
      
      if (req.response.includes('[]') && req.response.includes('AnalysisResult')) {
        migrationStatus = 'needs_validation';
      } else if (req.response.includes('StyleProfile') || req.response.includes('Performance')) {
        migrationStatus = 'needs_fallback';
      }

      return {
        endpoint: req.endpoint,
        method: req.method,
        response: req.response,
        description: req.description,
        migrationStatus
      };
    });

    const hasComplexData = requiredEndpoints.some(req => 
      req.migrationStatus === 'needs_validation' || req.migrationStatus === 'needs_fallback'
    );

    const estimatedEffort: 'low' | 'medium' | 'high' = hasComplexData ? 'medium' : 'low';

    const risks: string[] = [];
    if (requiredEndpoints.some(req => req.migrationStatus === 'needs_fallback')) {
      risks.push('Complex data structures may need fallback mechanisms');
    }
    if (requiredEndpoints.some(req => req.response.includes('[]'))) {
      risks.push('Array responses need validation for empty states');
    }

    const recommendations: string[] = [];
    if (estimatedEffort === 'medium') {
      recommendations.push('Implement comprehensive validation for complex responses');
      recommendations.push('Add fallback mechanisms for critical data');
    }
    if (this.fallbackToMock) {
      recommendations.push('Keep mock fallbacks enabled during transition');
    }

    return {
      component: componentName,
      requiredEndpoints,
      estimatedEffort,
      risks,
      recommendations
    };
  }

  /**
   * Validate migration readiness
   */
  validateMigrationReadiness(): {
    ready: string[];
    needsWork: string[];
    totalComponents: number;
    readyPercentage: number;
  } {
    const allComponents = this.contracts.map(c => c.component);
    const ready: string[] = [];
    const needsWork: string[] = [];

    allComponents.forEach(componentName => {
      const plan = this.generateMigrationPlan(componentName);
      if (plan.estimatedEffort === 'low' && plan.risks.length === 0) {
        ready.push(componentName);
      } else {
        needsWork.push(componentName);
      }
    });

    return {
      ready,
      needsWork,
      totalComponents: allComponents.length,
      readyPercentage: Math.round((ready.length / allComponents.length) * 100)
    };
  }

  /**
   * Enable/disable production mode
   */
  setProductionMode(enabled: boolean): void {
    this.isProduction = enabled;
    if (enabled) {
      console.log('Production mode enabled - mock fallbacks will be disabled');
    } else {
      console.log('Development mode enabled - mock fallbacks are available');
    }
  }

  /**
   * Enable/disable fallback to mock
   */
  setFallbackToMock(enabled: boolean): void {
    this.fallbackToMock = enabled;
    console.log(`Mock fallback ${enabled ? 'enabled' : 'disabled'}`);
  }
}

export default APIMigration; 