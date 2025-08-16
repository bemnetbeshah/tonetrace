import type { ComponentDataContract, APIContract } from './dataContracts';

/**
 * Contract Validator
 * Validates API responses against defined contracts
 * Ensures data integrity when swapping mocks to real APIs
 */
export class ContractValidator {
  private contracts: ComponentDataContract[];

  constructor(contracts: ComponentDataContract[]) {
    this.contracts = contracts;
  }

  /**
   * Validate a complete API response for a component
   */
  validateComponentResponse(
    componentName: string,
    responses: Record<string, any>
  ): ValidationResult {
    const contract = this.getContract(componentName);
    if (!contract) {
      return {
        isValid: false,
        errors: [`No contract found for component: ${componentName}`],
        warnings: [],
        component: componentName
      };
    }

    const errors: string[] = [];
    const warnings: string[] = [];
    const validatedEndpoints: string[] = [];

    // Validate each required API call
    contract.requires.forEach(apiContract => {
      const endpointKey = this.getEndpointKey(apiContract.endpoint);
      const response = responses[endpointKey];

      if (response === undefined) {
        errors.push(`Missing response for endpoint: ${apiContract.endpoint}`);
        return;
      }

      const endpointValidation = this.validateEndpointResponse(apiContract, response);
      if (!endpointValidation.isValid) {
        errors.push(...endpointValidation.errors);
      } else {
        validatedEndpoints.push(apiContract.endpoint);
      }

      if (endpointValidation.warnings.length > 0) {
        warnings.push(...endpointValidation.warnings);
      }
    });

    // Check for extra responses not in contract
    Object.keys(responses).forEach(responseKey => {
      const hasContract = contract.requires.some(req => 
        this.getEndpointKey(req.endpoint) === responseKey
      );
      if (!hasContract) {
        warnings.push(`Extra response found: ${responseKey} (not in contract)`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      component: componentName,
      validatedEndpoints,
      contract: contract
    };
  }

  /**
   * Validate a single endpoint response
   */
  validateEndpointResponse(
    apiContract: APIContract,
    response: any
  ): EndpointValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if response exists
    if (response === null || response === undefined) {
      errors.push(`Response is null/undefined for ${apiContract.endpoint}`);
      return { isValid: false, errors, warnings };
    }

    // Basic type validation based on expected response
    const typeValidation = this.validateResponseType(apiContract.response, response);
    if (!typeValidation.isValid) {
      errors.push(...typeValidation.errors);
    }

    // Check for required fields based on response type
    const fieldValidation = this.validateRequiredFields(apiContract.response, response);
    if (!fieldValidation.isValid) {
      errors.push(...fieldValidation.errors);
    }

    // Check for data quality issues
    const qualityValidation = this.validateDataQuality(apiContract.response, response);
    warnings.push(...qualityValidation.warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      endpoint: apiContract.endpoint
    };
  }

  /**
   * Validate response type structure
   */
  private validateResponseType(expectedType: string, response: any): ValidationResult {
    const errors: string[] = [];

    if (expectedType.endsWith('[]')) {
      if (!Array.isArray(response)) {
        errors.push(`Expected array for ${expectedType}, got ${typeof response}`);
      }
    } else if (expectedType === 'string') {
      if (typeof response !== 'string') {
        errors.push(`Expected string, got ${typeof response}`);
      }
    } else if (expectedType === 'number') {
      if (typeof response !== 'number') {
        errors.push(`Expected number, got ${typeof response}`);
      }
    } else if (expectedType === 'boolean') {
      if (typeof response !== 'boolean') {
        errors.push(`Expected boolean, got ${typeof response}`);
      }
    }

    return { isValid: errors.length === 0, errors, warnings: [] };
  }

  /**
   * Validate required fields based on expected response type
   */
  private validateRequiredFields(expectedType: string, response: any): ValidationResult {
    const errors: string[] = [];

    if (expectedType === 'Student[]' && Array.isArray(response)) {
      response.forEach((student, index) => {
        if (!student.id) errors.push(`Student at index ${index} missing required field: id`);
        if (!student.name) errors.push(`Student at index ${index} missing required field: name`);
      });
    } else if (expectedType === 'Assignment[]' && Array.isArray(response)) {
      response.forEach((assignment, index) => {
        if (!assignment.id) errors.push(`Assignment at index ${index} missing required field: id`);
        if (!assignment.title) errors.push(`Assignment at index ${index} missing required field: title`);
        if (!assignment.dueDate) errors.push(`Assignment at index ${index} missing required field: dueDate`);
      });
    } else if (expectedType === 'AnalysisResult[]' && Array.isArray(response)) {
      response.forEach((analysis, index) => {
        if (!analysis.id) errors.push(`Analysis at index ${index} missing required field: id`);
        if (!analysis.studentId) errors.push(`Analysis at index ${index} missing required field: studentId`);
        if (!analysis.createdAt) errors.push(`Analysis at index ${index} missing required field: createdAt`);
      });
    } else if (expectedType === 'StyleProfile') {
      if (!response.studentId) errors.push('StyleProfile missing required field: studentId');
      if (typeof response.baselineFormality !== 'number') {
        errors.push('StyleProfile missing required field: baselineFormality (number)');
      }
    } else if (expectedType === 'StudentPerformanceResponse') {
      if (typeof response.avgFormality !== 'number') {
        errors.push('StudentPerformanceResponse missing required field: avgFormality (number)');
      }
      if (typeof response.avgComplexity !== 'number') {
        errors.push('StudentPerformanceResponse missing required field: avgComplexity (number)');
      }
    }

    return { isValid: errors.length === 0, errors, warnings: [] };
  }

  /**
   * Validate data quality and provide warnings
   */
  private validateDataQuality(expectedType: string, response: any): ValidationResult {
    const warnings: string[] = [];

    if (expectedType.endsWith('[]') && Array.isArray(response)) {
      if (response.length === 0) {
        warnings.push('Response array is empty - this might indicate no data');
      }
      
      // Check for duplicate IDs
      const ids = response.map((item: any) => item.id).filter(Boolean);
      const uniqueIds = new Set(ids);
      if (ids.length !== uniqueIds.size) {
        warnings.push('Response contains duplicate IDs - this might cause issues');
      }
    }

    // Check for reasonable value ranges
    if (expectedType === 'StyleProfile') {
      if (response.baselineFormality < 0 || response.baselineFormality > 1) {
        warnings.push('baselineFormality should be between 0 and 1');
      }
    }

    if (expectedType === 'StudentPerformanceResponse') {
      if (response.avgFormality < 0 || response.avgFormality > 1) {
        warnings.push('avgFormality should be between 0 and 1');
      }
      if (response.avgGrammarIssues < 0) {
        warnings.push('avgGrammarIssues should be non-negative');
      }
    }

    return { isValid: true, errors: [], warnings };
  }

  /**
   * Get contract for a specific component
   */
  private getContract(componentName: string): ComponentDataContract | undefined {
    return this.contracts.find(contract => contract.component === componentName);
  }

  /**
   * Extract endpoint key from full endpoint path
   */
  private getEndpointKey(endpoint: string): string {
    return endpoint.split('/').pop() || endpoint;
  }

  /**
   * Generate validation report for a component
   */
  generateValidationReport(componentName: string): ValidationReport {
    const contract = this.getContract(componentName);
    if (!contract) {
      return {
        component: componentName,
        hasContract: false,
        contract: null,
        requiredEndpoints: [],
        dataTransforms: [],
        futureActions: [],
        validationStatus: 'NO_CONTRACT'
      };
    }

    return {
      component: componentName,
      hasContract: true,
      contract: contract,
      requiredEndpoints: contract.requires.map(req => ({
        method: req.method,
        endpoint: req.endpoint,
        response: req.response,
        description: req.description
      })),
      dataTransforms: contract.transforms || [],
      futureActions: contract.actions_future || [],
      validationStatus: 'CONTRACT_FOUND'
    };
  }

  /**
   * Get all components that require a specific endpoint
   */
  getComponentsUsingEndpoint(endpoint: string): string[] {
    return this.contracts
      .filter(contract => 
        contract.requires.some(req => req.endpoint === endpoint)
      )
      .map(contract => contract.component);
  }

  /**
   * Get all endpoints used across all components
   */
  getAllEndpoints(): string[] {
    const endpoints = new Set<string>();
    this.contracts.forEach(contract => {
      contract.requires.forEach(req => endpoints.add(req.endpoint));
    });
    return Array.from(endpoints);
  }
}

// Validation result interfaces
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface EndpointValidationResult extends ValidationResult {
  endpoint: string;
}

export interface ComponentValidationResult extends ValidationResult {
  component: string;
  validatedEndpoints: string[];
  contract: ComponentDataContract | null;
}

export interface ValidationReport {
  component: string;
  hasContract: boolean;
  contract: ComponentDataContract | null;
  requiredEndpoints: Array<{
    method: string;
    endpoint: string;
    response: string;
    description: string;
  }>;
  dataTransforms: any[];
  futureActions: string[];
  validationStatus: 'NO_CONTRACT' | 'CONTRACT_FOUND' | 'VALIDATION_ERROR';
}

export default ContractValidator; 