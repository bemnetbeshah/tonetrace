// Export all contract-related utilities and components
export * from './dataContracts';
export { ContractValidator } from './contractValidator';
export { DataTransformers } from './dataTransformers';
export { APIMigration } from './apiMigration';

// Re-export commonly used items for convenience
export {
  DATA_CONTRACTS,
  contractHelpers,
  ComponentDataContract,
  APIContract,
  DataTransform,
  StudentsListResponse,
  AssignmentsListResponse,
  StudentHistoryResponse,
  StudentProfileResponse,
  StudentPerformanceResponse,
  AnalysisSubmissionResponse,
  TrendLineDataPoint,
  TonePieDataPoint
} from './dataContracts';

// Export validation types
export type {
  ValidationResult,
  EndpointValidationResult,
  ComponentValidationResult,
  ValidationReport
} from './contractValidator';

// Export default instances for common use cases
export { default as DATA_CONTRACTS_DEFAULT } from './dataContracts';
export { default as ContractValidatorDefault } from './contractValidator';
export { default as DataTransformersDefault } from './dataTransformers';
export { default as APIMigrationDefault } from './apiMigration'; 