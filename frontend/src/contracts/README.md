# Data Contracts & API Migration Module

## Overview

The Data Contracts & API Migration Module provides a comprehensive system for documenting what each page expects from the service layer, making it risk-free to swap mocks to real APIs. It includes contract definitions, validation utilities, data transformation tools, and migration assistance.

## Purpose

- **Document API Requirements**: Clear specification of what each component needs from the service layer
- **Risk-Free Migration**: Safe transition from mock APIs to real backend APIs
- **Data Integrity**: Validation ensures API responses match expected contracts
- **Transformation Utilities**: Convert API responses to component-expected formats
- **Migration Planning**: Assess readiness and plan API transitions

## Core Components

### 1. Data Contracts (`dataContracts.ts`)

Defines the contract specifications for each component:

```typescript
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
      // ... more endpoints
    ],
    transforms: [
      {
        component: 'TrendLine',
        expects: '{date: string, value: number}',
        source: 'AnalysisResult.createdAt + AnalysisResult.formality',
        mapping: 'map(analysis => ({ date: analysis.createdAt, value: analysis.formality }))',
        description: 'Transform analysis history into trend line data format'
      }
    ]
  }
];
```

**Key Features:**
- **Component Contracts**: Each page/component has a defined contract
- **API Specifications**: Method, endpoint, response type, and description
- **Data Transformations**: How API data is converted for chart components
- **Future Actions**: Planned API endpoints for future development

### 2. Contract Validator (`contractValidator.ts`)

Validates API responses against defined contracts:

```typescript
const validator = new ContractValidator(DATA_CONTRACTS);

// Validate component response
const result = validator.validateComponentResponse('DashboardPage', {
  students: [...],
  assignments: [...],
  history: [...]
});

// Generate validation report
const report = validator.generateValidationReport('DashboardPage');
```

**Key Features:**
- **Response Validation**: Ensures API responses match contract expectations
- **Type Checking**: Validates response structure and required fields
- **Data Quality**: Checks for common issues like empty arrays or duplicate IDs
- **Comprehensive Reports**: Detailed validation results with errors and warnings

### 3. Data Transformers (`dataTransformers.ts`)

Transforms API responses into component-expected formats:

```typescript
// Transform analysis history to trend line data
const trendData = DataTransformers.toTrendLineData(
  analyses, 
  'formality'
);

// Transform tone distribution to pie chart data
const pieData = DataTransformers.toTonePieData(analyses);

// Transform performance metrics to summary format
const summary = DataTransformers.toPerformanceSummary(performance);
```

**Key Features:**
- **Chart Data**: Converts API responses to chart component formats
- **Multiple Metrics**: Support for comparing multiple data points over time
- **Data Aggregation**: Combines multiple analyses into summary statistics
- **Validation**: Ensures transformed data meets component requirements

### 4. API Migration (`apiMigration.ts`)

Manages safe transition from mock to real APIs:

```typescript
const migration = new APIMigration(DATA_CONTRACTS);

// Migrate single API call
const result = await migration.migrateAPICall(
  'DashboardPage',
  '/api/students',
  mockCall,
  realCall
);

// Generate migration plan
const plan = migration.generateMigrationPlan('DashboardPage');

// Check overall readiness
const readiness = migration.validateMigrationReadiness();
```

**Key Features:**
- **Safe Migration**: Automatic fallback to mocks if real API fails
- **Validation**: Ensures real API responses meet contract requirements
- **Migration Planning**: Assesses effort and identifies risks
- **Production Mode**: Configurable for production vs development

## Contract Specifications

### DashboardPage Contract

**Required APIs:**
- `GET /api/students` → `Student[]` - Student list for overview
- `GET /api/assignments` → `Assignment[]` - Assignment progress tracking
- `GET /api/analyze/history/{studentId}` → `AnalysisResult[]` - Trend calculations

**Data Transformations:**
- **TrendLine**: `AnalysisResult.createdAt + formality` → `{date, value}[]`
- **TonePie**: `AnalysisResult.toneDistribution[]` → `{name, value}[]`

### StudentsPage Contract

**Required APIs:**
- `GET /api/students` → `Student[]` - Student list for table display

**No transformations required** - direct display of student data.

### StudentDetailPage Contract

**Required APIs:**
- `GET /api/analyze/history/{studentId}` → `AnalysisResult[]` - Analysis history
- `GET /api/profile/{studentId}` → `StyleProfile` - Style baseline
- `GET /api/profile/{studentId}/performance` → `StudentPerformanceResponse` - Aggregated metrics

**Data Transformations:**
- **TrendLine**: Formality history over time
- **TonePie**: Aggregated tone distribution

### AssignmentsPage Contract

**Required APIs:**
- `GET /api/assignments` → `Assignment[]` - Assignment list

**Future Actions:**
- `POST /api/analyze` - Individual text analysis
- `POST /api/analyze/batch` - Batch assignment analysis

## Usage Patterns

### Basic Contract Usage

```typescript
import { contractHelpers, DATA_CONTRACTS } from '../contracts';

// Get contract for a component
const contract = contractHelpers.getContract('DashboardPage');

// Get required endpoints
const endpoints = contractHelpers.getRequiredEndpoints('DashboardPage');

// Get data transformations
const transforms = contractHelpers.getDataTransforms('DashboardPage');
```

### Validation in Components

```typescript
import { ContractValidator } from '../contracts';

function DashboardPage() {
  const validator = new ContractValidator(DATA_CONTRACTS);
  
  useEffect(() => {
    const validateData = async () => {
      const students = await api.listStudents();
      const assignments = await api.listAssignments();
      
      const validation = validator.validateComponentResponse('DashboardPage', {
        students,
        assignments
      });
      
      if (!validation.isValid) {
        console.error('Data validation failed:', validation.errors);
      }
    };
    
    validateData();
  }, []);
  
  // Component logic...
}
```

### Data Transformation in Components

```typescript
import { DataTransformers } from '../contracts';

function DashboardPage() {
  const [analyses, setAnalyses] = useState([]);
  
  useEffect(() => {
    const loadData = async () => {
      const history = await api.history(studentId, 10);
      setAnalyses(history);
    };
    loadData();
  }, [studentId]);
  
  // Transform data for charts
  const trendData = DataTransformers.toTrendLineData(analyses, 'formality');
  const toneData = DataTransformers.toTonePieData(analyses);
  
  return (
    <div>
      <TrendLine data={trendData} />
      <TonePie data={toneData} />
    </div>
  );
}
```

### API Migration

```typescript
import { APIMigration } from '../contracts';

function DashboardPage() {
  const migration = new APIMigration(DATA_CONTRACTS);
  
  const loadStudents = async () => {
    const result = await migration.migrateAPICall(
      'DashboardPage',
      '/api/students',
      () => api.listStudents(), // mock call
      () => fetch('/api/students').then(r => r.json()) // real call
    );
    
    if (result.source === 'real') {
      console.log('Using real API');
    } else if (result.source === 'fallback') {
      console.log('Falling back to mock');
    }
    
    setStudents(result.data);
  };
  
  // Component logic...
}
```

## Migration Process

### 1. Assessment Phase

```typescript
const migration = new APIMigration(DATA_CONTRACTS);

// Check overall readiness
const readiness = migration.validateMigrationReadiness();
console.log(`${readiness.readyPercentage}% of components are ready`);

// Generate migration plan for specific component
const plan = migration.generateMigrationPlan('DashboardPage');
console.log(`Effort: ${plan.estimatedEffort}`);
console.log(`Risks: ${plan.risks.join(', ')}`);
```

### 2. Implementation Phase

```typescript
// Replace mock API calls with real ones
const realAPI = {
  async listStudents() {
    const response = await fetch('/api/students');
    return response.json();
  }
};

// Use migration utility for safe transition
const result = await migration.migrateAPICall(
  'DashboardPage',
  '/api/students',
  mockAPI.listStudents,
  realAPI.listStudents
);
```

### 3. Validation Phase

```typescript
const validator = new ContractValidator(DATA_CONTRACTS);

// Validate real API responses
const validation = validator.validateComponentResponse('DashboardPage', {
  students: await realAPI.listStudents(),
  assignments: await realAPI.listAssignments()
});

if (validation.isValid) {
  console.log('Migration successful');
} else {
  console.error('Validation failed:', validation.errors);
}
```

## Benefits

### For Developers

- **Clear Specifications**: Know exactly what each component needs
- **Safe Refactoring**: Change APIs without breaking components
- **Validation**: Catch data issues early
- **Documentation**: Self-documenting API requirements

### For Backend Teams

- **API Specification**: Clear contract for what frontend expects
- **Testing**: Validate API responses against contracts
- **Evolution**: Safe API changes with contract updates
- **Documentation**: Automatic API documentation

### For Project Management

- **Risk Assessment**: Understand migration complexity
- **Planning**: Estimate effort for API integration
- **Quality**: Ensure data integrity across the system
- **Timeline**: Plan API migration phases

## Best Practices

### 1. Define Contracts Early

```typescript
// Define contracts before implementing components
export const COMPONENT_CONTRACT: ComponentDataContract = {
  component: 'NewComponent',
  requires: [
    {
      method: 'GET',
      endpoint: '/api/new-endpoint',
      response: 'NewDataType[]',
      description: 'Clear description of what this data is for'
    }
  ]
};
```

### 2. Use Validation in Development

```typescript
// Always validate API responses during development
if (process.env.NODE_ENV === 'development') {
  const validation = validator.validateEndpointResponse(contract, response);
  if (!validation.isValid) {
    console.warn('API response validation failed:', validation.errors);
  }
}
```

### 3. Implement Fallbacks

```typescript
// Use migration utilities for safe API transitions
const migration = new APIMigration(DATA_CONTRACTS, false, true);
// fallbackToMock: true ensures graceful degradation
```

### 4. Update Contracts with API Changes

```typescript
// When APIs change, update contracts first
export const UPDATED_CONTRACT = {
  ...EXISTING_CONTRACT,
  requires: [
    ...EXISTING_CONTRACT.requires,
    {
      method: 'POST',
      endpoint: '/api/new-feature',
      response: 'NewResponseType',
      description: 'New API endpoint for additional functionality'
    }
  ]
};
```

## Integration Points

### Component Library Integration

The contracts module integrates seamlessly with the existing component library:

- **Existing Components**: Can be wrapped with contract validation
- **New Components**: Should define contracts during development
- **API Layer**: Contracts guide API implementation
- **Testing**: Contracts provide test specifications

### Backend Integration

When the backend is ready:

1. **Replace Mock APIs**: Update `src/services/api.ts` with real implementations
2. **Use Contracts**: Follow contract specifications for API endpoints
3. **Enable Validation**: Use ContractValidator to ensure data integrity
4. **Plan Migration**: Use APIMigration for safe transitions

### Testing Integration

```typescript
// Test that components work with contract-compliant data
test('DashboardPage works with valid contract data', () => {
  const mockData = contractHelpers.getMockDataStructure('DashboardPage');
  const { getByTestId } = render(<DashboardPage data={mockData} />);
  
  expect(getByTestId('dashboard')).toBeInTheDocument();
});
```

## Future Enhancements

Potential improvements for future versions:

- **Schema Validation**: JSON Schema integration for stricter validation
- **API Versioning**: Support for multiple API versions
- **Performance Monitoring**: Track API response times and quality
- **Automated Testing**: Generate tests from contracts
- **API Documentation**: Auto-generate OpenAPI specs from contracts
- **Change Detection**: Monitor API changes and alert on contract violations

## Resources

### Related Documentation

- [API Service Layer](../services/api.ts) - Current mock API implementation
- [Type Definitions](../types/) - Data type definitions
- [Component Library](../components/) - UI components that use contracts

### External Resources

- [OpenAPI Specification](https://swagger.io/specification/) - API documentation standard
- [JSON Schema](https://json-schema.org/) - Data validation standard
- [API Design Guidelines](https://github.com/microsoft/api-guidelines) - Microsoft's API design principles 