import React from 'react';

/**
 * OutletRouter Component
 * Placeholder for routing content - shows demo dashboard
 */
export const OutletRouter: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <h1 className="text-h1 text-text mb-4">Welcome to ToneTrace</h1>
        <p className="text-body text-muted mb-6">
          Your AI-powered writing analysis platform. Analyze tone, sentiment, and writing style 
          to improve your communication.
        </p>
        <div className="flex gap-4">
          <button className="btn-primary">
            Start New Analysis
          </button>
          <button className="btn-secondary">
            View Examples
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary-soft rounded-lg">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted">Total Analyses</p>
              <p className="text-2xl font-semibold text-text">24</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-success rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted">Success Rate</p>
              <p className="text-2xl font-semibold text-text">94%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center">
            <div className="p-3 bg-warning rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted">Avg. Response</p>
              <p className="text-2xl font-semibold text-text">2.3s</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <h2 className="text-h2 text-text mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center p-4 border border-border rounded-lg">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">TB</span>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-text">Tone analysis completed</p>
              <p className="text-xs text-muted">Email draft analyzed for professional tone</p>
            </div>
            <span className="text-xs text-muted">2 min ago</span>
          </div>

          <div className="flex items-center p-4 border border-border rounded-lg">
            <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">TB</span>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-text">Sentiment analysis finished</p>
              <p className="text-xs text-muted">Customer feedback analyzed for sentiment</p>
            </div>
            <span className="text-xs text-muted">15 min ago</span>
          </div>

          <div className="flex items-center p-4 border border-border rounded-lg">
            <div className="w-10 h-10 bg-warning rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">TB</span>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-text">Style metrics generated</p>
              <p className="text-xs text-muted">Blog post analyzed for readability and style</p>
            </div>
            <span className="text-xs text-muted">1 hour ago</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <h2 className="text-h2 text-text mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border border-border rounded-lg hover:bg-surface-alt transition-colors text-left">
            <div className="w-8 h-8 bg-primary rounded-lg mb-3"></div>
            <h3 className="text-h3 mb-2">New Analysis</h3>
            <p className="text-body text-muted">Start analyzing your text</p>
          </button>

          <button className="p-4 border border-border rounded-lg hover:bg-surface-alt transition-colors text-left">
            <div className="w-8 h-8 bg-success rounded-lg mb-3"></div>
            <h3 className="text-h3 mb-2">View Reports</h3>
            <p className="text-body text-muted">Check your analysis history</p>
          </button>

          <button className="p-4 border border-border rounded-lg hover:bg-surface-alt transition-colors text-left">
            <div className="w-8 h-8 bg-warning rounded-lg mb-3"></div>
            <h3 className="text-h3 mb-2">Templates</h3>
            <p className="text-body text-muted">Use pre-built analysis templates</p>
          </button>

          <button className="p-4 border border-border rounded-lg hover:bg-surface-alt transition-colors text-left">
            <div className="w-8 h-8 bg-primary-soft rounded-lg mb-3"></div>
            <h3 className="text-h3 mb-2">Help & Docs</h3>
            <p className="text-body text-muted">Learn how to use ToneTrace</p>
          </button>
        </div>
      </div>
    </div>
  );
}; 