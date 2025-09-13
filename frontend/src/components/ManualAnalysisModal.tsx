import React, { useState } from 'react';
import { Modal, Button } from './primitives';

interface ManualAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AnalysisResult {
  submission_id: string;
  total_analysis_time_ms: number;
  formality: any;
  complexity: any;
  tone: any;
  sentiment: any;
  passive_voice: any;
  lexical_diversity: any;
  hedging: any;
  readability: any;
  grammar: any;
  lexical_richness: any;
  anomaly: any;
  anomaly_reasons: string[];
  anomaly_details: any;
}

const ManualAnalysisModal: React.FC<ManualAnalysisModalProps> = ({
  isOpen,
  onClose
}) => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          student_id: 'manual_analysis'
        })
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze text');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClose = () => {
    setText('');
    setResults(null);
    setError(null);
    setIsAnalyzing(false);
    onClose();
  };

  const formatScore = (score: number) => {
    if (typeof score !== 'number') return 'N/A';
    return (score * 100).toFixed(1) + '%';
  };

  const formatGradeLevel = (grade: number) => {
    if (typeof grade !== 'number') return 'N/A';
    return grade.toFixed(1);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Manual Text Analysis"
      size="xl"
    >
      <div className="space-y-6">
        {/* Text Input */}
        <div>
          <label htmlFor="analysis-text" className="block text-sm font-medium text-gray-700 mb-2">
            Enter text to analyze
          </label>
          <textarea
            id="analysis-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your writing here for analysis..."
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            disabled={isAnalyzing}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Analyze Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !text.trim()}
            variant="primary"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </Button>
        </div>

        {/* Results Display */}
        {results && (
          <div className="space-y-6">
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h3>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-blue-600">Formality</div>
                  <div className="text-2xl font-bold text-blue-900">
                    {formatScore(results.formality?.score)}
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-green-600">Readability</div>
                  <div className="text-2xl font-bold text-green-900">
                    Grade {formatGradeLevel(results.readability?.flesch_kincaid_grade)}
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-purple-600">Sentiment</div>
                  <div className="text-2xl font-bold text-purple-900">
                    {results.sentiment?.bucket || 'N/A'}
                  </div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-orange-600">Grammar Errors</div>
                  <div className="text-2xl font-bold text-orange-900">
                    {results.grammar?.raw?.num_errors || 0}
                  </div>
                </div>
              </div>

              {/* Detailed Results */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Formality & Complexity */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Writing Style</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Formality Score:</span>
                      <span className="font-medium">{formatScore(results.formality?.score)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Complexity Score:</span>
                      <span className="font-medium">{formatScore(results.complexity?.score)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lexical Diversity:</span>
                      <span className="font-medium">{formatScore(results.lexical_diversity?.score)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lexical Richness:</span>
                      <span className="font-medium">{formatScore(results.lexical_richness?.score)}</span>
                    </div>
                  </div>
                </div>

                {/* Readability & Grammar */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Readability & Grammar</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Flesch-Kincaid Grade:</span>
                      <span className="font-medium">{formatGradeLevel(results.readability?.flesch_kincaid_grade)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SMOG Index:</span>
                      <span className="font-medium">{formatGradeLevel(results.readability?.smog_index)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gunning Fog:</span>
                      <span className="font-medium">{formatGradeLevel(results.readability?.gunning_fog)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Grammar Errors:</span>
                      <span className="font-medium">{results.grammar?.raw?.num_errors || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Tone & Sentiment */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Tone & Sentiment</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Primary Tone:</span>
                      <span className="font-medium">{results.tone?.bucket || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sentiment:</span>
                      <span className="font-medium">{results.sentiment?.bucket || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sentiment Score:</span>
                      <span className="font-medium">{results.sentiment?.score?.toFixed(2) || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Writing Quality */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Writing Quality</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Passive Voice:</span>
                      <span className="font-medium">{formatScore(results.passive_voice?.score)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hedging Density:</span>
                      <span className="font-medium">{formatScore(results.hedging?.score)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Analysis Time:</span>
                      <span className="font-medium">{results.total_analysis_time_ms}ms</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Anomaly Detection */}
              {results.anomaly && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Anomaly Detection</h4>
                  <div className="text-sm text-yellow-700">
                    <p>Anomaly Score: {formatScore(results.anomaly)}</p>
                    {results.anomaly_reasons && results.anomaly_reasons.length > 0 && (
                      <div className="mt-2">
                        <p className="font-medium">Reasons:</p>
                        <ul className="list-disc list-inside mt-1">
                          {results.anomaly_reasons.map((reason, index) => (
                            <li key={index}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Grammar Errors Detail */}
              {results.grammar?.raw?.errors && results.grammar.raw.errors.length > 0 && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Grammar Issues</h4>
                  <div className="text-sm text-red-700">
                    <ul className="list-disc list-inside space-y-1">
                      {results.grammar.raw.errors.slice(0, 5).map((error: any, index: number) => (
                        <li key={index}>{error.message || error}</li>
                      ))}
                      {results.grammar.raw.errors.length > 5 && (
                        <li>... and {results.grammar.raw.errors.length - 5} more</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ManualAnalysisModal;
