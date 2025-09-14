import React from 'react';
import { ClockIcon, CpuChipIcon, SparklesIcon, BeakerIcon } from '@heroicons/react/24/outline';

/**
 * Coming Soon Page Component
 * Displays information about lightweight vs full-capacity analyzers
 */
export const ComingSoon: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary-soft rounded-full flex items-center justify-center">
              <ClockIcon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Advanced Analyzers Coming Soon
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            You're currently using our lightweight analyzers optimized for speed and efficiency. 
            Our full-capacity analyzers with advanced AI models are coming soon!
          </p>
        </div>

        {/* Current vs Coming Soon Comparison */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Current Lightweight Analyzers */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center mb-4">
              <CpuChipIcon className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Current: Lightweight Analyzers</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Optimized for speed and memory efficiency, perfect for real-time analysis.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Tone Analysis:</strong> Rule-based keyword detection</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Grammar:</strong> Basic pattern matching with NLTK</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Style Metrics:</strong> Readability formulas only</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Lexical Richness:</strong> Word frequency analysis</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Memory Usage:</strong> ~50MB | <strong>Speed:</strong> Very Fast | <strong>Accuracy:</strong> Good
              </p>
            </div>
          </div>

          {/* Coming Soon Full-Capacity Analyzers */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center mb-4">
              <SparklesIcon className="h-6 w-6 text-purple-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Coming Soon: Full-Capacity Analyzers</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Advanced AI-powered analyzers with state-of-the-art language models for maximum accuracy.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">⚡</span>
                <span><strong>Tone Analysis:</strong> RoBERTa emotion classification model</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">⚡</span>
                <span><strong>Grammar:</strong> spaCy NLP with advanced grammar rules</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">⚡</span>
                <span><strong>Style Metrics:</strong> Deep linguistic analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">⚡</span>
                <span><strong>Lexical Richness:</strong> Advanced vocabulary sophistication</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-700">
                <strong>Memory Usage:</strong> ~500MB+ | <strong>Speed:</strong> Moderate | <strong>Accuracy:</strong> Excellent
              </p>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <BeakerIcon className="h-6 w-6 text-gray-600 mr-2" />
            <h2 className="text-2xl font-semibold text-gray-900">How We Made Analyzers Lightweight</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Lightweight Approach</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Replaced heavy AI models with rule-based algorithms</li>
                <li>• Used NLTK instead of spaCy for basic NLP tasks</li>
                <li>• Implemented keyword-based tone detection</li>
                <li>• Simplified grammar checking with pattern matching</li>
                <li>• Optimized for Render's free tier (512MB limit)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Full-Capacity Features</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• RoBERTa transformer model for emotion classification</li>
                <li>• spaCy's advanced NLP pipeline for grammar analysis</li>
                <li>• Deep learning models for style and complexity analysis</li>
                <li>• Advanced linguistic features and semantic analysis</li>
                <li>• Higher accuracy but requires more computational resources</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Benefits Comparison */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 font-bold">⚡</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Speed</h3>
            <p className="text-gray-600 text-sm">
              Lightweight analyzers provide instant results, perfect for real-time feedback and quick analysis.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold">💾</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Efficiency</h3>
            <p className="text-gray-600 text-sm">
              Optimized for minimal memory usage, ensuring reliable performance on any hosting platform.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 font-bold">🎯</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Accuracy</h3>
            <p className="text-gray-600 text-sm">
              Full-capacity analyzers will provide state-of-the-art accuracy using advanced AI models.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Stay Updated on Our Progress
            </h3>
            <p className="text-gray-600 mb-6">
              We're actively developing the full-capacity analyzers. Follow our updates to be the first to know when they're ready!
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                Get Notified
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
