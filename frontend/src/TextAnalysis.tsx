import React, { useState, useEffect, useRef } from 'react';

// Define the type for analysis results
interface AnalysisResults {
  tone?: {
    bucket: string;
    score?: number;
  };
  sentiment?: {
    bucket: string;
    score?: number;
  };
  formality?: {
    bucket: string;
    score?: number;
  };
  complexity?: {
    bucket: string;
    score?: number;
  };
  lexical_richness?: {
    bucket?: string;
    score?: number;
  };
  passive_voice?: {
    bucket: string;
    score?: number;
  };
  grammar?: {
    bucket: string;
    score?: number;
  };
  readability?: {
    flesch_kincaid_grade?: string | number;
    bucket?: string;
    score?: number;
  };
  analysis_time_ms?: number;
}

function TextAnalysis() {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      alert('Please enter some text to analyze');
      return;
    }

    setIsAnalyzing(true);
    try {
      // Use environment variable for API URL, fallback to relative path for local dev
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const apiUrl = `${apiBaseUrl}/api/analyze`;
      
      const response = await fetch(apiUrl, {
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
          complexity: analysisResults.complexity,
          lexical_richness: analysisResults.lexical_richness,
          passive_voice: analysisResults.passive_voice,
          grammar: analysisResults.grammar,
          // Readability analyzer returns { score, bucket, raw: { flesch_kincaid_grade }, ... }
          // Extract flesch_kincaid_grade from raw or use score (which is the FK grade)
          readability: analysisResults.readability ? {
            flesch_kincaid_grade: analysisResults.readability.raw?.flesch_kincaid_grade ?? analysisResults.readability.score,
            bucket: analysisResults.readability.bucket,
            score: analysisResults.readability.score
          } : undefined,
          analysis_time_ms: data.metadata?.analysis_time_ms
        });
      } else {
        // Get error details from response
        let errorMessage = 'Analysis failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
          console.error('API Error Details:', errorData);
        } catch (e) {
          console.error('Failed to parse error response:', e);
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        console.error('Full error:', errorMessage);
        alert(`Failed to analyze text: ${errorMessage}`);
        throw new Error(errorMessage);
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

  const handleSampleText = () => {
    const sampleText = "My favorite time of year is definetly Summer. Cause school is out and I can just chill and not worry about homework or nothing. Me and my freinds hang out at the mall alot, we mostly play games at the arcade and eat pizza. Sometimes we go to the pool but the water is cold so we only stay for a little bit. Its much better then sitting in class all day long. My mom says I need to read books, but reading is boring and takes forever, so I don't really do that much. I wish summer was like, all the time!";
    setText(sampleText);
    setResults(null);
  };

  // Scroll to results when they are displayed
  useEffect(() => {
    if (results && resultsRef.current) {
      // Smooth scroll to the results card
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [results]);

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
            onClick={handleSampleText}
            disabled={isAnalyzing}
          >
            Sample Text
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
        <div className="card" ref={resultsRef}>
          <h3>Analysis Results</h3>
          <div className="results-grid">
            <div className="result-item">
              <h4>Tone</h4>
              <p className="result-value">{results.tone?.bucket || 'N/A'}</p>
              {results.tone?.score !== undefined && (
                <p className="result-score">Score: {results.tone.score.toFixed(2)}</p>
              )}
            </div>
            <div className="result-item">
              <h4>Sentiment</h4>
              <p className="result-value">{results.sentiment?.bucket || 'N/A'}</p>
              {results.sentiment?.score !== undefined && (
                <p className="result-score">Score: {results.sentiment.score.toFixed(2)}</p>
              )}
            </div>
            <div className="result-item">
              <h4>Formality</h4>
              <p className="result-value">{results.formality?.bucket || 'N/A'}</p>
              {results.formality?.score !== undefined && (
                <p className="result-score">Score: {results.formality.score.toFixed(2)}</p>
              )}
            </div>
            <div className="result-item">
              <h4>Complexity</h4>
              <p className="result-value">{results.complexity?.bucket || 'N/A'}</p>
              {results.complexity?.score !== undefined && (
                <p className="result-score">Score: {results.complexity.score.toFixed(2)}</p>
              )}
            </div>
            <div className="result-item">
              <h4>Lexical Richness</h4>
              <p className="result-value">{results.lexical_richness?.bucket || 'N/A'}</p>
              {results.lexical_richness?.score !== undefined && (
                <p className="result-score">Score: {results.lexical_richness.score.toFixed(2)}</p>
              )}
            </div>
            <div className="result-item">
              <h4>Passive Voice</h4>
              <p className="result-value">{results.passive_voice?.bucket || 'N/A'}</p>
              {results.passive_voice?.score !== undefined && (
                <p className="result-score">Score: {results.passive_voice.score.toFixed(2)}</p>
              )}
            </div>
            <div className="result-item">
              <h4>Grammar</h4>
              <p className="result-value">{results.grammar?.bucket || 'N/A'}</p>
              {results.grammar?.score !== undefined && (
                <p className="result-score">Score: {results.grammar.score.toFixed(2)}</p>
              )}
            </div>
            <div className="result-item">
              <h4>Readability</h4>
              <p className="result-value">
                {results.readability?.flesch_kincaid_grade !== undefined 
                  ? typeof results.readability.flesch_kincaid_grade === 'number'
                    ? results.readability.flesch_kincaid_grade.toFixed(1)
                    : results.readability.flesch_kincaid_grade
                  : results.readability?.bucket || 'N/A'}
              </p>
              {results.readability?.score !== undefined && (
                <p className="result-score">Grade: {results.readability.score.toFixed(1)}</p>
              )}
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
