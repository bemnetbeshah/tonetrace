import React, { useState } from 'react';
import { 
  DATA_CONTRACTS, 
  ContractValidator, 
  DataTransformers, 
  APIMigration,
  contractHelpers 
} from './index';

/**
 * ContractsDemo Component
 * Demonstrates data contracts, validation, and migration utilities
 */
export const ContractsDemo: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState('DashboardPage');
  const [validationResult, setValidationResult] = useState<any>(null);
  const [migrationPlan, setMigrationPlan] = useState<any>(null);
  const [migrationReadiness, setMigrationReadiness] = useState<any>(null);

  // Initialize utilities
  const validator = new ContractValidator(DATA_CONTRACTS);
  const migration = new APIMigration(DATA_CONTRACTS);

  // Handle component selection
  const handleComponentChange = (componentName: string) => {
    setSelectedComponent(componentName);
    setValidationResult(null);
    setMigrationPlan(null);
  };

  // Generate validation report
  const handleGenerateValidation = () => {
    const report = validator.generateValidationReport(selectedComponent);
    setValidationResult(report);
  };

  // Generate migration plan
  const handleGenerateMigrationPlan = () => {
    const plan = migration.generateMigrationPlan(selectedComponent);
    setMigrationPlan(plan);
  };

  // Check migration readiness
  const handleCheckReadiness = () => {
    const readiness = migration.validateMigrationReadiness();
    setMigrationReadiness(readiness);
  };

  // Get contract for selected component
  const selectedContract = contractHelpers.getContract(selectedComponent);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Data Contracts & API Migration Demo
        </h1>
        <p className="text-slate-600">
          Document what each page expects from the service layer so swapping mocks to real APIs is risk-free.
        </p>
      </div>

      {/* Component Selection */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Component Selection
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {DATA_CONTRACTS.map(contract => (
            <button
              key={contract.component}
              onClick={() => handleComponentChange(contract.component)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedComponent === contract.component
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {contract.component}
            </button>
          ))}
        </div>
      </div>

      {/* Contract Overview */}
      {selectedContract && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Contract Overview: {selectedContract.component}
          </h2>
          <p className="text-slate-600 mb-4">
            {selectedContract.description}
          </p>

          {/* Required API Endpoints */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
              Required API Endpoints
            </h3>
            <div className="space-y-3">
              {selectedContract.requires.map((req, index) => (
                <div key={index} className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                      {req.method}
                    </span>
                    <code className="text-sm font-mono bg-slate-200 px-2 py-1 rounded">
                      {req.endpoint}
                    </code>
                  </div>
                  <p className="text-sm text-slate-700 mb-2">
                    <strong>Response:</strong> {req.response}
                  </p>
                  <p className="text-sm text-slate-600">
                    {req.description}
                  </p>
                  {req.params && (
                    <div className="mt-2">
                      <p className="text-sm text-slate-600">
                        <strong>Parameters:</strong> {JSON.stringify(req.params)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Data Transformations */}
          {selectedContract.transforms && selectedContract.transforms.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Data Transformations
              </h3>
              <div className="space-y-3">
                {selectedContract.transforms.map((transform, index) => (
                  <div key={index} className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">
                      {transform.component}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Expects:</strong> {transform.expects}</p>
                      <p><strong>Source:</strong> {transform.source}</p>
                      <p><strong>Mapping:</strong> <code className="bg-green-100 px-2 py-1 rounded">{transform.mapping}</code></p>
                      <p className="text-green-700">{transform.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Future Actions */}
          {selectedContract.actions_future && selectedContract.actions_future.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Future Actions
              </h3>
              <div className="space-y-2">
                {selectedContract.actions_future.map((action, index) => (
                  <div key={index} className="bg-yellow-50 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      {action}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Validation Tools */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Validation Tools
        </h2>
        
        <div className="flex gap-3 mb-4">
          <button
            onClick={handleGenerateValidation}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate Validation Report
          </button>
          <button
            onClick={handleGenerateMigrationPlan}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Generate Migration Plan
          </button>
          <button
            onClick={handleCheckReadiness}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Check Migration Readiness
          </button>
        </div>

        {/* Validation Result */}
        {validationResult && (
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
              Validation Report: {validationResult.component}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  validationResult.hasContract 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {validationResult.hasContract ? 'Contract Found' : 'No Contract'}
                </span>
                <span className="text-sm text-slate-600">
                  Status: {validationResult.validationStatus}
                </span>
              </div>
              
              {validationResult.hasContract && (
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Required Endpoints:</h4>
                  <ul className="space-y-1 text-sm text-slate-700">
                    {validationResult.requiredEndpoints.map((endpoint: any, index: number) => (
                      <li key={index}>
                        • {endpoint.method} {endpoint.endpoint} → {endpoint.response}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Migration Plan */}
        {migrationPlan && (
          <div className="bg-slate-50 rounded-lg p-4 mt-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
              Migration Plan: {migrationPlan.component}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  migrationPlan.estimatedEffort === 'low' ? 'bg-green-100 text-green-800' :
                  migrationPlan.estimatedEffort === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  Effort: {migrationPlan.estimatedEffort}
                </span>
              </div>
              
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Endpoints:</h4>
                <div className="space-y-2">
                  {migrationPlan.requiredEndpoints.map((endpoint: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <span className="px-2 py-1 bg-slate-200 rounded text-slate-700">
                        {endpoint.method}
                      </span>
                      <code className="font-mono">{endpoint.endpoint}</code>
                      <span className={`px-2 py-1 rounded text-xs ${
                        endpoint.migrationStatus === 'ready' ? 'bg-green-100 text-green-800' :
                        endpoint.migrationStatus === 'needs_validation' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {endpoint.migrationStatus}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {migrationPlan.risks.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-900 mb-2">Risks:</h4>
                  <ul className="space-y-1 text-sm text-red-700">
                    {migrationPlan.risks.map((risk: string, index: number) => (
                      <li key={index}>• {risk}</li>
                    ))}
                  </ul>
                </div>
              )}

              {migrationPlan.recommendations.length > 0 && (
                <div>
                  <h4 className="font-medium text-green-900 mb-2">Recommendations:</h4>
                  <ul className="space-y-1 text-sm text-green-700">
                    {migrationPlan.recommendations.map((rec: string, index: number) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Migration Readiness */}
        {migrationReadiness && (
          <div className="bg-slate-50 rounded-lg p-4 mt-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
              Migration Readiness Overview
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {migrationReadiness.readyPercentage}%
                  </div>
                  <div className="text-sm text-slate-600">Ready</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-600">
                    {migrationReadiness.totalComponents}
                  </div>
                  <div className="text-sm text-slate-600">Total</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-green-900 mb-2">Ready ({migrationReadiness.ready.length}):</h4>
                  <ul className="space-y-1 text-sm text-green-700">
                    {migrationReadiness.ready.map((component: string, index: number) => (
                      <li key={index}>• {component}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-red-900 mb-2">Needs Work ({migrationReadiness.needsWork.length}):</h4>
                  <ul className="space-y-1 text-sm text-red-700">
                    {migrationReadiness.needsWork.map((component: string, index: number) => (
                      <li key={index}>• {component}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Data Transformation Examples */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Data Transformation Examples
        </h2>
        <p className="text-slate-600 mb-4">
          Examples of how API responses are transformed for chart components.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trend Line Transformation */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              Trend Line Data
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>Input:</strong> AnalysisResult[] with createdAt + formality</p>
              <p><strong>Output:</strong> {`{date: string, value: number}[]`}</p>
              <p><strong>Usage:</strong> TrendLine component expects this format</p>
              <div className="bg-blue-100 rounded p-2 mt-2">
                <code className="text-xs">
                  DataTransformers.toTrendLineData(analyses, 'formality')
                </code>
              </div>
            </div>
          </div>

          {/* Tone Pie Transformation */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-900 mb-3">
              Tone Pie Data
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>Input:</strong> AnalysisResult.toneDistribution[]</p>
              <p><strong>Output:</strong> {`{name: string, value: number}[]`}</p>
              <p><strong>Usage:</strong> TonePie component expects this format</p>
              <div className="bg-green-100 rounded p-2 mt-2">
                <code className="text-xs">
                  DataTransformers.toTonePieData(analyses)
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Points */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">
          Integration Points
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Backend Integration
            </h3>
            <p className="text-blue-800 mb-3">
              When the backend is ready, replace the mock implementations in <code className="bg-blue-100 px-2 py-1 rounded">src/services/api.ts</code> with real API calls.
            </p>
            <ul className="space-y-2 text-blue-800">
              <li>• Use the data contracts as a specification for API endpoints</li>
              <li>• Implement the ContractValidator to ensure data integrity</li>
              <li>• Use DataTransformers to convert API responses to component format</li>
              <li>• Enable APIMigration for safe transition with fallbacks</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Risk Mitigation
            </h3>
            <ul className="space-y-2 text-blue-800">
              <li>• All required API endpoints are documented in contracts</li>
              <li>• Data transformations ensure component compatibility</li>
              <li>• Validation prevents breaking changes</li>
              <li>• Migration utilities provide safe transition paths</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractsDemo; 