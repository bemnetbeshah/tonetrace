import React from 'react';
import { useToast } from './ToastContext';

export const ToastDemo: React.FC = () => {
  const { showToast } = useToast();

  const handleShowInfo = () => {
    showToast('This is an informational message', 'info');
  };

  const handleShowSuccess = () => {
    showToast('Operation completed successfully!', 'success');
  };

  const handleShowError = () => {
    showToast('Something went wrong. Please try again.', 'error');
  };

  const handleShowMultiple = () => {
    showToast('First message', 'info');
    setTimeout(() => showToast('Second message', 'success'), 500);
    setTimeout(() => showToast('Third message', 'error'), 1000);
  };

  const handleSimulateAnalysis = () => {
    showToast('Starting analysis...', 'info');
    
    setTimeout(() => {
      showToast('Analysis in progress...', 'info');
    }, 1000);
    
    setTimeout(() => {
      showToast('Analysis completed successfully!', 'success');
    }, 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Toast Notifications</h1>
        <p className="text-lg text-gray-600">
          Non-blocking feedback for user actions
        </p>
      </div>

      {/* Basic Toast Types */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Toast Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleShowInfo}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Show Info Toast
          </button>
          <button
            onClick={handleShowSuccess}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Show Success Toast
          </button>
          <button
            onClick={handleShowError}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Show Error Toast
          </button>
        </div>
      </div>

      {/* Advanced Features */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Advanced Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleShowMultiple}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Show Multiple Toasts
          </button>
          <button
            onClick={handleSimulateAnalysis}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Simulate Analysis Flow
          </button>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Usage Instructions</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>• <strong>Info</strong>: Use for general information and updates</p>
          <p>• <strong>Success</strong>: Use for completed operations and achievements</p>
          <p>• <strong>Error</strong>: Use for errors and failed operations</p>
          <p>• Toasts auto-dismiss after 5 seconds or can be manually dismissed</p>
          <p>• Multiple toasts stack vertically in the top-right corner</p>
        </div>
      </div>

      {/* Code Example */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Code Example</h3>
        <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`import { useToast } from './toast';

const MyComponent = () => {
  const { showToast } = useToast();
  
  const handleAction = () => {
    showToast('Action completed!', 'success');
  };
  
  return (
    <button onClick={handleAction}>
      Perform Action
    </button>
  );
};`}
        </pre>
      </div>
    </div>
  );
};

export default ToastDemo; 