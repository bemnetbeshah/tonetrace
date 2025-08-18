import React from 'react';
import IssuesBar from './IssuesBar';

const IssuesBarDemo: React.FC = () => {
  const sampleIssues = [
    { type: 'subject_verb_agreement', count: 12 },
    { type: 'run_on_sentences', count: 8 },
    { type: 'fragment_sentences', count: 6 },
    { type: 'comma_splices', count: 4 },
    { type: 'pronoun_reference', count: 3 }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">IssuesBar Component Demo</h3>
        <p className="text-gray-600 mb-6">
          Visual representation of grammar issues with horizontal bars showing frequency.
        </p>
        
        <div className="mb-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Sample Grammar Issues</h4>
          <IssuesBar issues={sampleIssues} />
        </div>

        <div className="border-t pt-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Empty State</h4>
          <IssuesBar issues={[]} />
        </div>
      </div>
    </div>
  );
};

export default IssuesBarDemo; 