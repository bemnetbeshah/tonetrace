import React, { useState } from 'react';
import './styles.css';
import TextAnalysis from './TextAnalysis';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'analyze':
        return <TextAnalysis />;
      case 'profile':
        return (
          <div className="card">
            <h2>Student Profile</h2>
            <p>Student profile page coming soon...</p>
          </div>
        );
      case 'history':
        return (
          <div className="card">
            <h2>Analysis History</h2>
            <p>Analysis history page coming soon...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="card">
            <h2>Settings</h2>
            <p>Settings page coming soon...</p>
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
                      onClick={() => setCurrentPage('settings')}
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
                <p>Learn more about our mission, goals, and what drives us to help teachers empower their students.</p>
                <div className="button-borders-white">
                  <button 
                    className="primary-button-white" 
                    onClick={() => setCurrentPage('analyze')}
                  >
                    Our Goals and Motivations
                  </button>
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
  };

  return (
    <div className="app">
      <header className="header">
        <h1>ToneTrace</h1>
        <nav className="nav-links">
          <a 
            href="/" 
            className={`nav-link ${currentPage === 'home' ? 'nav-link-active' : ''}`}
            onClick={(e) => handleNavClick('home', e)}
          >
            Teacher Dashboard
          </a>
          <a 
            href="/analyze" 
            className={`nav-link ${currentPage === 'analyze' ? 'nav-link-active' : ''}`}
            onClick={(e) => handleNavClick('analyze', e)}
          >
            Text Analysis
          </a>
          <a 
            href="/profile" 
            className={`nav-link ${currentPage === 'profile' ? 'nav-link-active' : ''}`}
            onClick={(e) => handleNavClick('profile', e)}
          >
            Student Profile
          </a>
          <a 
            href="/history" 
            className={`nav-link ${currentPage === 'history' ? 'nav-link-active' : ''}`}
            onClick={(e) => handleNavClick('history', e)}
          >
            Analysis History
          </a>
          <a 
            href="/settings" 
            className={`nav-link ${currentPage === 'settings' ? 'nav-link-active' : ''}`}
            onClick={(e) => handleNavClick('settings', e)}
          >
            Settings
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
