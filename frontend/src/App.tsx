import React, { useState, useEffect, useRef } from 'react';
import './styles.css';
import TextAnalysis from './TextAnalysis';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [scrollToAnalyzers, setScrollToAnalyzers] = useState(false);
  const analyzersRef = useRef<HTMLDivElement>(null);

  const renderPage = () => {
    switch (currentPage) {
      case 'analyze':
        return <TextAnalysis />;
      case 'history':
        return (
          <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"' }}>
            <div className="card">
              <h2 style={{ fontFamily: 'inherit' }}>Why am I building ToneTrace?</h2>
              <div style={{ marginTop: '1.5rem', fontFamily: 'inherit' }}>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginTop: '1rem', fontFamily: 'inherit' }}>
                  ToneTrace was born from a simple yet powerful motivation: to help teachers, especially in areas of the world where student-to-teacher ratios are high, provide higher quality education to their students.
                </p>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginTop: '1rem', fontFamily: 'inherit' }}>
                  When educators face classrooms with 40, 50, or even more students, providing individualized writing feedback becomes nearly impossible. Yet every student deserves personalized guidance to develop their writing skills. ToneTrace bridges this gap by offering comprehensive writing analysis that helps teachers quickly understand each student's strengths and areas for improvement.
                </p>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginTop: '1rem', fontFamily: 'inherit' }}>
                  By automating the analysis of tone, sentiment, grammar, readability, and style metrics, we empower teachers to focus on what truly matters: meaningful conversations with students about their writing and personalized instruction that drives growth.
                </p>
              </div>
            </div>

            <div className="card" style={{ marginTop: '2rem', fontFamily: 'inherit' }} ref={analyzersRef}>
              <h2 style={{ fontFamily: 'inherit' }}>Analyzers: Lightweight(Demo) vs Heavyweight(True product)</h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginTop: '1rem', marginBottom: '2rem', fontFamily: 'inherit', textAlign: 'center' }}>
                Compare the two analyzer approaches used in ToneTrace
              </p>
              
              {/* Detailed Analyzer Breakdown */}
              <div style={{ marginTop: '2rem', fontFamily: 'inherit' }}>
                <h3 style={{ 
                  fontFamily: 'inherit', 
                  marginTop: '0',
                  marginBottom: '1.5rem',
                  color: '#ffffff',
                  textAlign: 'center',
                  fontSize: '1.5rem'
                }}>
                  Analyzer-Specific Differences
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: 'inherit' }}>
                  {/* Style Metrics */}
                  <div style={{
                    padding: '1.5rem',
                    backgroundColor: '#1a1a1a',
                    borderRadius: '8px',
                    border: '1px solid #333',
                    fontFamily: 'inherit'
                  }}>
                    <h4 style={{ color: '#ffffff', marginTop: '0', marginBottom: '0.75rem', fontSize: '1.1rem', fontFamily: 'inherit' }}>Style Metrics (Formality & Complexity)</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                      <div>
                        <p style={{ color: '#b5b5b5', fontSize: '0.9rem', margin: '0.5rem 0', fontFamily: 'inherit' }}>
                          <strong style={{ color: '#90caf9' }}>Lightweight:</strong> Uses NLTK for part-of-speech tagging with same readability calculations (Flesch-Kincaid, Gunning Fog, Dale-Chall). Efficient POS tagging with safe fallbacks.
                        </p>
                      </div>
                      <div>
                        <p style={{ color: '#b5b5b5', fontSize: '0.9rem', margin: '0.5rem 0', fontFamily: 'inherit' }}>
                          <strong style={{ color: '#f48fb1' }}>Heavyweight:</strong> Uses spaCy (<code>en_core_web_sm</code>) for advanced POS tagging and dependency parsing. Provides superior linguistic parsing accuracy for content word identification and lexical density calculations.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Lexical Richness */}
                  <div style={{
                    padding: '1.5rem',
                    backgroundColor: '#1a1a1a',
                    borderRadius: '8px',
                    border: '1px solid #333',
                    fontFamily: 'inherit'
                  }}>
                    <h4 style={{ color: '#ffffff', marginTop: '0', marginBottom: '0.75rem', fontSize: '1.1rem', fontFamily: 'inherit' }}>Lexical Richness</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                      <div>
                        <p style={{ color: '#b5b5b5', fontSize: '0.9rem', margin: '0.5rem 0', fontFamily: 'inherit' }}>
                          <strong style={{ color: '#90caf9' }}>Lightweight:</strong> Uses NLTK for tokenization and stopword filtering. Same core logic with wordfreq/Zipf frequency analysis (vocabulary sophistication metrics, rare word detection).
                        </p>
                      </div>
                      <div>
                        <p style={{ color: '#b5b5b5', fontSize: '0.9rem', margin: '0.5rem 0', fontFamily: 'inherit' }}>
                          <strong style={{ color: '#f48fb1' }}>Heavyweight:</strong> Uses spaCy for tokenization and stopword filtering. More accurate tokenization with built-in linguistic knowledge, producing identical Zipf score analysis but with better token boundary detection.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tone Analysis */}
                  <div style={{
                    padding: '1.5rem',
                    backgroundColor: '#1a1a1a',
                    borderRadius: '8px',
                    border: '1px solid #333',
                    fontFamily: 'inherit'
                  }}>
                    <h4 style={{ color: '#ffffff', marginTop: '0', marginBottom: '0.75rem', fontSize: '1.1rem', fontFamily: 'inherit' }}>Tone Analysis</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                      <div>
                        <p style={{ color: '#b5b5b5', fontSize: '0.9rem', margin: '0.5rem 0', fontFamily: 'inherit' }}>
                          <strong style={{ color: '#90caf9' }}>Lightweight:</strong> Uses TextBlob sentiment analysis combined with rule-based keyword matching. Classifies into 5 tone categories (positive, negative, neutral, formal, informal) based on sentiment polarity and keyword patterns.
                        </p>
                      </div>
                      <div>
                        <p style={{ color: '#b5b5b5', fontSize: '0.9rem', margin: '0.5rem 0', fontFamily: 'inherit' }}>
                          <strong style={{ color: '#f48fb1' }}>Heavyweight:</strong> Uses Transformers library with RoBERTa-base model (<code>SamLowe/roberta-base-go_emotions</code>) for fine-grained emotion classification. Detects 28 distinct emotions mapped to broader tone categories, providing nuanced emotional understanding.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Passive Voice */}
                  <div style={{
                    padding: '1.5rem',
                    backgroundColor: '#1a1a1a',
                    borderRadius: '8px',
                    border: '1px solid #333',
                    fontFamily: 'inherit'
                  }}>
                    <h4 style={{ color: '#ffffff', marginTop: '0', marginBottom: '0.75rem', fontSize: '1.1rem', fontFamily: 'inherit' }}>Passive Voice Detection</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                      <div>
                        <p style={{ color: '#b5b5b5', fontSize: '0.9rem', margin: '0.5rem 0', fontFamily: 'inherit' }}>
                          <strong style={{ color: '#90caf9' }}>Lightweight:</strong> Uses NLTK POS tagging combined with regex pattern matching. Detects patterns like "be/get + past participle" and "by + noun phrase" for passive voice identification.
                        </p>
                      </div>
                      <div>
                        <p style={{ color: '#b5b5b5', fontSize: '0.9rem', margin: '0.5rem 0', fontFamily: 'inherit' }}>
                          <strong style={{ color: '#f48fb1' }}>Heavyweight:</strong> Uses spaCy dependency parsing to detect <code>auxpass</code> (passive auxiliary) dependency tags. Leverages grammatical relationships for more accurate passive voice detection, especially in complex sentence structures.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Grammar Analysis */}
                  <div style={{
                    padding: '1.5rem',
                    backgroundColor: '#1a1a1a',
                    borderRadius: '8px',
                    border: '1px solid #333',
                    fontFamily: 'inherit'
                  }}>
                    <h4 style={{ color: '#ffffff', marginTop: '0', marginBottom: '0.75rem', fontSize: '1.1rem', fontFamily: 'inherit' }}>Grammar Analysis</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                      <div>
                        <p style={{ color: '#b5b5b5', fontSize: '0.9rem', margin: '0.5rem 0', fontFamily: 'inherit' }}>
                          <strong style={{ color: '#90caf9' }}>Lightweight:</strong> Uses NLTK with simple pattern matching. Detects basic grammar issues: subject-verb disagreement (e.g., "they is"), sentence fragments, run-on sentences, and double negatives using POS tag patterns.
                        </p>
                      </div>
                      <div>
                        <p style={{ color: '#b5b5b5', fontSize: '0.9rem', margin: '0.5rem 0', fontFamily: 'inherit' }}>
                          <strong style={{ color: '#f48fb1' }}>Heavyweight:</strong> Uses spaCy with sophisticated dependency-based grammar rules. Advanced subject-verb agreement detection via dependency relations, sentence fragment detection using dependency parsing to identify missing subjects/verbs, and subordinating conjunction analysis.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#1a3a52', borderRadius: '8px', borderLeft: '4px solid #2196f3', fontFamily: 'inherit' }}>
                <h4 style={{ marginTop: '0', color: '#90caf9', fontFamily: 'inherit' }}>Current Implementation</h4>
                <p style={{ fontSize: '1rem', lineHeight: '1.8', marginTop: '0.5rem', marginBottom: '0', color: '#e3f2fd', fontFamily: 'inherit' }}>
                  For demo purposes, ToneTrace currently uses <strong>lightweight analyzers</strong>. This ensures fast, responsive analysis that works reliably across different devices and network conditions, making it accessible to teachers worldwide regardless of their technical infrastructure.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <>
            <div className="grid grid-2">
              <div className="card">
                <h2 className="text-large">Welcome to ToneTrace!</h2>
                <p>Empower teachers to provide targeted writing feedback with AI-powered analysis of their students' writing.</p>
              </div>
              <div className="card text-center">
                <h2 className="text-large">Test our current analyzers manually</h2>
                <div className="button-group" style={{ justifyContent: 'center' }}>
                  <div className="button-borders-white">
                    <button
                      className="primary-button-white"
                      onClick={() => setCurrentPage('analyze')}
                    >
                      Test Analysis
                    </button>
                  </div>
                  <div className="button-borders-white">
                    <button
                      className="primary-button-white"
                      onClick={handleLearnMoreClick}
                    >
                      Learn more about our analyzers
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-2">
              <div className="card">
                <h3>About Us</h3>
                <p>We are committed to helping teachers empower their students. Learn more about our mission, goals, and what drives us.</p>
                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                  <div className="button-borders-white">
                    <button 
                      className="primary-button-white" 
                      onClick={() => setCurrentPage('history')}
                    >
                      Our Goals and Motivations
                    </button>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3>Features</h3>
                <ul>
                  <li>Tone Analysis</li>
                  <li>Sentiment Detection</li>
                  <li>Grammar Checking</li>
                  <li>Readability Scores</li>
                  <li>Style Metrics</li>
                </ul>
              </div>
            </div>

            <div className="card text-center">
              <h3>Ready to analyze!</h3>
              <p>Enter your text and get comprehensive analysis results in seconds.</p>
            </div>
          </>
        );
    }
  };

  const handleNavClick = (page: string, e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentPage(page);
    if (page === 'history') {
      setScrollToAnalyzers(false);
    }
  };

  const handleLearnMoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentPage('history');
    setScrollToAnalyzers(true);
  };

  // Scroll to analyzers section when needed
  useEffect(() => {
    if (scrollToAnalyzers && analyzersRef.current && currentPage === 'history') {
      setTimeout(() => {
        analyzersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setScrollToAnalyzers(false);
      }, 100);
    }
  }, [scrollToAnalyzers, currentPage]);

  return (
    <div className="app">
      <header className="header">
        <h1 style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'bold', letterSpacing: '0.1rem' }}>ToneTrace</h1>
        <nav className="nav-links">
          <a 
            href="/" 
            className={`nav-link ${currentPage === 'home' ? 'nav-link-active' : ''}`}
            onClick={(e) => handleNavClick('home', e)}
          >
            Home
          </a>
          <a 
            href="/analyze" 
            className={`nav-link ${currentPage === 'analyze' ? 'nav-link-active' : ''}`}
            onClick={(e) => handleNavClick('analyze', e)}
          >
            Text Analysis
          </a>
          <a 
            href="/history" 
            className={`nav-link ${currentPage === 'history' ? 'nav-link-active' : ''}`}
            onClick={(e) => handleNavClick('history', e)}
          >
            About
          </a>
        </nav>
      </header>
      
      <main className="main">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
