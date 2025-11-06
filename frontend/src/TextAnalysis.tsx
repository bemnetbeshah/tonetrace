import React, { useState } from 'react';

// Define the type for analysis results
interface AnalysisResults {
  tone?: {
    bucket: string;
  };
  sentiment?: {
    bucket: string;
  };
  formality?: {
    bucket: string;
  };
  readability?: {
    flesch_kincaid_grade: string | number;
  };
  analysis_time_ms?: number;
}

function TextAnalysis() {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      alert('Please enter some text to analyze');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          student_id: 'default'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Backend returns { text, analysis: {...}, metadata: {...} }
        // Extract the analysis results and flatten for the frontend
        const analysisResults = data.analysis || {};
        setResults({
          tone: analysisResults.tone,
          sentiment: analysisResults.sentiment,
          formality: analysisResults.formality,
          // Readability analyzer returns { score, bucket, raw: { flesch_kincaid_grade }, ... }
          // Extract flesch_kincaid_grade from raw or use score (which is the FK grade)
          readability: analysisResults.readability ? {
            flesch_kincaid_grade: analysisResults.readability.raw?.flesch_kincaid_grade ?? analysisResults.readability.score
          } : undefined,
          analysis_time_ms: data.metadata?.analysis_time_ms
        });
      } else {
        const errorData = await response.json().catch(() => ({ detail: 'Analysis failed' }));
        throw new Error(errorData.detail || 'Analysis failed');
      }
    } catch (error) {
      console.error('Error analyzing text:', error);
      alert('Failed to analyze text. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setText('');
    setResults(null);
  };

  return (
    <div className="text-analysis">
      <div className="card">
        <h2>Text Analysis</h2>
        <p>Enter your text below to analyze tone, sentiment, grammar, and more.</p>
        
        <div className="text-input-container">
          <textarea
            className="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here for analysis..."
            rows={8}
          />
          <div className="text-stats">
            <span>Characters: {text.length}</span>
            <span>Words: {text.trim() ? text.trim().split(/\s+/).length : 0}</span>
          </div>
        </div>

        <div className="button-group">
          <button 
            className="button button-primary" 
            onClick={handleAnalyze}
            disabled={isAnalyzing || !text.trim()}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Text'}
          </button>
          <button 
            className="button button-secondary" 
            onClick={handleClear}
            disabled={isAnalyzing}
          >
            Clear
          </button>
        </div>
      </div>

      {results && (
        <div className="card">
          <h3>Analysis Results</h3>
          <div className="results-grid">
            <div className="result-item">
              <h4>Tone</h4>
              <p className="result-value">{results.tone?.bucket || 'N/A'}</p>
            </div>
            <div className="result-item">
              <h4>Sentiment</h4>
              <p className="result-value">{results.sentiment?.bucket || 'N/A'}</p>
            </div>
            <div className="result-item">
              <h4>Formality</h4>
              <p className="result-value">{results.formality?.bucket || 'N/A'}</p>
            </div>
            <div className="result-item">
              <h4>Readability</h4>
              <p className="result-value">{results.readability?.flesch_kincaid_grade || 'N/A'}</p>
            </div>
          </div>
          
          {results.analysis_time_ms && (
            <p className="analysis-time">
              Analysis completed in {results.analysis_time_ms}ms
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default TextAnalysis;
