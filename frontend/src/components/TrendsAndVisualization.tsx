import React from 'react';
import { ReadabilityLine } from './charts/ReadabilityLine';
import { GrammarStackedBar } from './charts/GrammarStackedBar';
import { ToneDonut } from './charts/ToneDonut';
import { TrendPoint } from '../types';
import { SectionHeader } from './SectionHeader';

interface TrendsAndVisualizationProps {
  trends: {
    readability: { name: string; data: TrendPoint[]; color: string };
    grammarErrors: { name: string; data: TrendPoint[]; color: string };
    toneDistribution: { name: string; data: TrendPoint[]; color: string };
    sentiment: { name: string; data: TrendPoint[]; color: string };
    formality: { name: string; data: TrendPoint[]; color: string };
    lexicalDiversity: { name: string; data: TrendPoint[]; color: string };
  };
}

export const TrendsAndVisualization: React.FC<TrendsAndVisualizationProps> = ({ trends }) => {
  console.log('TrendsAndVisualization: Received trends data:', trends);
  
  // Add null checks to prevent crashes
  if (!trends || !trends.readability || !trends.grammarErrors || !trends.toneDistribution) {
    console.error('TrendsAndVisualization: Missing trends data:', { trends });
    return (
      <div className="space-y-6">
        <SectionHeader title="Trends & Visualization" />
        <div className="text-center text-gray-500 py-8">
          <p>Loading trends data...</p>
        </div>
      </div>
    );
  }

  try {
    console.log('TrendsAndVisualization: Rendering charts with data:', {
      readability: trends.readability.data,
      grammarErrors: trends.grammarErrors.data,
      toneDistribution: trends.toneDistribution.data
    });

    return (
      <div className="space-y-6">
        <SectionHeader title="Trends & Visualization" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ReadabilityLine data={trends.readability.data || []} />
          <GrammarStackedBar data={trends.grammarErrors.data || []} />
          <ToneDonut data={trends.toneDistribution.data || []} />
        </div>
        
        <div className="text-center text-sm text-gray-500">
          <p>Charts show trends over the last 8 weeks of assignments</p>
        </div>
      </div>
    );
  } catch (error) {
    console.error('TrendsAndVisualization: Error rendering charts:', error);
    return (
      <div className="space-y-6">
        <SectionHeader title="Trends & Visualization" />
        <div className="text-center text-red-500 py-8">
          <p>Error rendering charts: {error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </div>
    );
  }
};
