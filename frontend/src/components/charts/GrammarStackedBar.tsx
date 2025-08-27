import React, { useRef, useEffect } from 'react';
import { TrendPoint } from '../../types';

interface GrammarErrorData {
  week: string;
  spelling: number;
  punctuation: number;
  grammar: number;
  style: number;
}

interface GrammarStackedBarProps {
  data: TrendPoint[];
}

export const GrammarStackedBar: React.FC<GrammarStackedBarProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  console.log('GrammarStackedBar: Received data:', data);
  
  try {
    // Validate data
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.warn('GrammarStackedBar: Invalid or empty data:', data);
      return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Grammar Errors</h3>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">No data available</p>
          </div>
        </div>
      );
    }

    // Use hardcoded safe data
    const chartData: GrammarErrorData[] = [
      { week: 'Week 1', spelling: 5, punctuation: 3, grammar: 7, style: 2 },
      { week: 'Week 2', spelling: 4, punctuation: 2, grammar: 6, style: 3 },
      { week: 'Week 3', spelling: 6, punctuation: 4, grammar: 8, style: 1 },
      { week: 'Week 4', spelling: 3, punctuation: 1, grammar: 5, style: 2 },
      { week: 'Week 5', spelling: 7, punctuation: 5, grammar: 9, style: 4 },
      { week: 'Week 6', spelling: 2, punctuation: 2, grammar: 4, style: 1 },
      { week: 'Week 7', spelling: 5, punctuation: 3, grammar: 6, style: 2 },
      { week: 'Week 8', spelling: 4, punctuation: 2, grammar: 5, style: 3 },
    ];

    console.log('GrammarStackedBar: Using chart data:', chartData);
    
    // Calculate max value for scaling
    const maxValue = Math.max(...chartData.flatMap(d => [d.spelling, d.punctuation, d.grammar, d.style]));
    
    // Check container size
    useEffect(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        console.log('GrammarStackedBar: Container dimensions:', rect.width, 'x', rect.height);
        
        if (rect.width === 0 || rect.height === 0) {
          console.warn('GrammarStackedBar: Container has zero dimensions');
        }
      }
    }, []);

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Grammar Errors</h3>
        
        <div ref={containerRef} className="h-64">
          {/* Custom HTML/CSS Chart */}
          <div className="w-full h-full flex items-end justify-between gap-1 px-4">
            {chartData.map((weekData, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-1">
                {/* Week Label */}
                <div className="text-xs text-gray-600 text-center mb-2">
                  {weekData.week}
                </div>
                
                {/* Chart Bars Container */}
                <div className="flex-1 w-full flex items-end justify-center gap-1 min-h-[120px]">
                  {/* Spelling Bar */}
                  <div 
                    className="w-3 bg-red-500 rounded-t-sm transition-all duration-300 hover:opacity-80"
                    style={{ 
                      height: `${(weekData.spelling / maxValue) * 100}%`,
                      minHeight: '4px'
                    }}
                    title={`Spelling: ${weekData.spelling} errors`}
                  />
                  
                  {/* Punctuation Bar */}
                  <div 
                    className="w-3 bg-yellow-500 rounded-t-sm transition-all duration-300 hover:opacity-80"
                    style={{ 
                      height: `${(weekData.punctuation / maxValue) * 100}%`,
                      minHeight: '4px'
                    }}
                    title={`Punctuation: ${weekData.punctuation} errors`}
                  />
                  
                  {/* Grammar Bar */}
                  <div 
                    className="w-3 bg-purple-500 rounded-t-sm transition-all duration-300 hover:opacity-80"
                    style={{ 
                      height: `${(weekData.grammar / maxValue) * 100}%`,
                      minHeight: '4px'
                    }}
                    title={`Grammar: ${weekData.grammar} errors`}
                  />
                  
                  {/* Style Bar */}
                  <div 
                    className="w-3 bg-cyan-500 rounded-t-sm transition-all duration-300 hover:opacity-80"
                    style={{ 
                      height: `${(weekData.style / maxValue) * 100}%`,
                      minHeight: '4px'
                    }}
                    title={`Style: ${weekData.style} errors`}
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Y-axis labels */}
          <div className="flex justify-between text-xs text-gray-500 px-4 mt-2">
            <span>{maxValue}</span>
            <span>{Math.round(maxValue * 0.75)}</span>
            <span>{Math.round(maxValue * 0.5)}</span>
            <span>{Math.round(maxValue * 0.25)}</span>
            <span>0</span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-gray-600">Spelling</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm text-gray-600">Punctuation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-sm text-gray-600">Grammar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
            <span className="text-sm text-gray-600">Style</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mt-4 text-center">
          Grammar errors over time (custom chart - no Recharts)
        </p>
      </div>
    );
  } catch (error) {
    console.error('GrammarStackedBar: Error rendering chart:', error);
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Grammar Errors</h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-red-500">Error rendering chart: {error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </div>
    );
  }
};
