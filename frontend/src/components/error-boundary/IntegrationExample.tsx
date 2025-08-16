import React from 'react';
import { ErrorBoundary, PageErrorBoundary } from './index';

/**
 * IntegrationExample Component
 * Demonstrates how to integrate ErrorBoundary components throughout the application
 */
export const IntegrationExample: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Error Boundary Integration Examples
        </h1>
        <p className="text-slate-600">
          Examples of how to integrate ErrorBoundary components in different parts of your application
        </p>
      </div>

      {/* Example 1: App-level Error Boundary */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          1. App-Level Error Boundary
        </h2>
        <p className="text-slate-600 mb-4">
          Wrap your entire application to catch any unhandled errors:
        </p>
        <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm">
          <pre className="whitespace-pre-wrap">
{`// In your main App.tsx
import { ErrorBoundary } from './components/error-boundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}`}
          </pre>
        </div>
      </div>

      {/* Example 2: Page-Level Error Boundaries */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          2. Page-Level Error Boundaries
        </h2>
        <p className="text-slate-600 mb-4">
          Use PageErrorBoundary for individual page routes with custom error handling:
        </p>
        <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm">
          <pre className="whitespace-pre-wrap">
{`// In your routing setup
import { PageErrorBoundary } from './components/error-boundary';

function App() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/dashboard" 
          element={
            <PageErrorBoundary pageName="Dashboard">
              <DashboardPage />
            </PageErrorBoundary>
          } 
        />
        <Route 
          path="/students" 
          element={
            <PageErrorBoundary pageName="Students">
              <StudentsPage />
            </PageErrorBoundary>
          } 
        />
      </Routes>
    </Router>
  );
}`}
          </pre>
        </div>
      </div>

      {/* Example 3: Component-Level Error Boundaries */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          3. Component-Level Error Boundaries
        </h2>
        <p className="text-slate-600 mb-4">
          Wrap critical components that might fail independently:
        </p>
        <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm">
          <pre className="whitespace-pre-wrap">
{`// For critical components like charts or data displays
import { ErrorBoundary } from './components/error-boundary';

function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      <ErrorBoundary>
        <ChartComponent />
      </ErrorBoundary>
      
      <ErrorBoundary>
        <DataTable />
      </ErrorBoundary>
      
      <ErrorBoundary>
        <AnalyticsWidget />
      </ErrorBoundary>
    </div>
  );
}`}
          </pre>
        </div>
      </div>

      {/* Example 4: Custom Fallback UI */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          4. Custom Fallback UI
        </h2>
        <p className="text-slate-600 mb-4">
          Provide custom error handling for specific use cases:
        </p>
        <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm">
          <pre className="whitespace-pre-wrap">
{`// Custom fallback for specific components
const ChartErrorFallback = () => (
  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
    <p className="text-yellow-800">
      Chart failed to load. Please refresh the page.
    </p>
  </div>
);

function DashboardPage() {
  return (
    <ErrorBoundary fallback={<ChartErrorFallback />}>
      <ChartComponent />
    </ErrorBoundary>
  );
}`}
          </pre>
        </div>
      </div>

      {/* Example 5: Nested Error Boundaries */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          5. Nested Error Boundaries
        </h2>
        <p className="text-slate-600 mb-4">
          Use multiple levels of error boundaries for granular error handling:
        </p>
        <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm">
          <pre className="whitespace-pre-wrap">
{`// Nested boundaries for different error scopes
function DashboardPage() {
  return (
    <ErrorBoundary> {/* Catches page-level errors */}
      <div>
        <Header />
        <main>
          <ErrorBoundary> {/* Catches main content errors */}
            <div className="grid grid-cols-2 gap-4">
              <ErrorBoundary> {/* Catches left column errors */}
                <LeftColumn />
              </ErrorBoundary>
              <ErrorBoundary> {/* Catches right column errors */}
                <RightColumn />
              </ErrorBoundary>
            </div>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}`}
          </pre>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">
          Best Practices
        </h2>
        <ul className="space-y-2 text-blue-800">
          <li>• <strong>App-level:</strong> Always wrap your main app with an ErrorBoundary</li>
          <li>• <strong>Page-level:</strong> Use PageErrorBoundary for route components</li>
          <li>• <strong>Component-level:</strong> Wrap critical components that might fail</li>
          <li>• <strong>Custom fallbacks:</strong> Provide context-specific error messages</li>
          <li>• <strong>Avoid over-wrapping:</strong> Don't wrap every small component</li>
          <li>• <strong>Error logging:</strong> Monitor console logs for debugging</li>
          <li>• <strong>User experience:</strong> Keep error messages friendly and actionable</li>
        </ul>
      </div>
    </div>
  );
};

export default IntegrationExample; 