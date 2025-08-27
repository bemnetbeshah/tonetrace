import React, { useState, useRef } from 'react';

interface BarChartData {
  label: string;
  values: { series: string; value: number }[];
}

interface BarChartProps {
  data: BarChartData[];
  height: number;
  width: number;
  stack?: boolean;
  colors?: string[];
  seriesNames?: string[];
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  height,
  width,
  stack = false,
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
  seriesNames = []
}) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string; visible: boolean }>({
    x: 0,
    y: 0,
    content: '',
    visible: false
  });
  const svgRef = useRef<SVGSVGElement>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No data available
      </div>
    );
  }

  // Extract all series names if not provided
  const allSeriesNames = seriesNames.length > 0 ? seriesNames : 
    Array.from(new Set(data.flatMap(d => d.values.map(v => v.series))));

  // Calculate domains
  const allValues = data.flatMap(d => d.values.map(v => v.value));
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues, 0);

  // Padding for chart area - increased right padding to prevent bars from going over the edge
  const padding = { top: 20, right: 40, bottom: 60, left: 80 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Scale functions
  const xScale = (index: number) => {
    // Ensure bars are properly spaced within the chart area with better boundaries
    return padding.left + (index + 0.5) * (chartWidth / data.length);
  };

  const yScale = (value: number) => {
    const range = maxValue - minValue;
    return padding.top + chartHeight - ((value - minValue) / range) * chartHeight;
  };

  // Calculate bar width with proper spacing - ensure bars don't overlap boundaries
  const availableWidth = chartWidth / data.length;
  const barWidth = Math.min(availableWidth * 0.6, 35); // Reduced from 0.7 to 0.6 and max width to 35px
  const barSpacing = (availableWidth - barWidth) / 2;

  // Generate bars
  const generateBars = () => {
    const bars: JSX.Element[] = [];

    data.forEach((item, itemIndex) => {
      // Ensure bar position is within chart boundaries
      let x = xScale(itemIndex) - barWidth / 2;
      x = Math.max(padding.left + 2, Math.min(x, width - padding.right - barWidth - 2));
      
      if (stack) {
        // Stacked bars
        let currentY = yScale(0);
        item.values.forEach((value, valueIndex) => {
          const barHeight = Math.abs(yScale(value.value) - yScale(0));
          const y = value.value >= 0 ? yScale(value.value) : currentY;
          
          bars.push(
            <rect
              key={`${itemIndex}-${valueIndex}`}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={colors[valueIndex % colors.length]}
              className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
              role="button"
              tabIndex={0}
              aria-label={`${item.label} - ${value.series}: ${value.value}`}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltip({
                  x: rect.left + rect.width / 2,
                  y: rect.top - 10,
                  content: `${item.label}\n${value.series}: ${value.value.toFixed(1)}`,
                  visible: true
                });
              }}
              onMouseLeave={() => setTooltip(prev => ({ ...prev, visible: false }))}
              onFocus={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltip({
                  x: rect.left + rect.width / 2,
                  y: rect.top - 10,
                  content: `${item.label}\n${value.series}: ${value.value.toFixed(1)}`,
                  visible: true
                });
              }}
              onBlur={() => setTooltip(prev => ({ ...prev, visible: false }))}
            />
          );
          
          if (value.value >= 0) {
            currentY = yScale(value.value);
          } else {
            currentY = yScale(value.value);
          }
        });
      } else {
        // Grouped bars
        const groupWidth = barWidth / allSeriesNames.length;
        item.values.forEach((value, valueIndex) => {
          const seriesIndex = allSeriesNames.indexOf(value.series);
          let barX = x + seriesIndex * groupWidth;
          // Ensure grouped bars are also within boundaries
          barX = Math.max(padding.left + 2, Math.min(barX, width - padding.right - groupWidth - 2));
          const barHeight = Math.abs(yScale(value.value) - yScale(0));
          const y = value.value >= 0 ? yScale(value.value) : yScale(0);
          
          bars.push(
            <rect
              key={`${itemIndex}-${valueIndex}`}
              x={barX}
              y={y}
              width={groupWidth - 2}
              height={barHeight}
              fill={colors[seriesIndex % colors.length]}
              className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
              role="button"
              tabIndex={0}
              aria-label={`${item.label} - ${value.series}: ${value.value}`}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltip({
                  x: rect.left + rect.width / 2,
                  y: rect.top - 10,
                  content: `${item.label}\n${value.series}: ${value.value.toFixed(1)}`,
                  visible: true
                });
              }}
              onMouseLeave={() => setTooltip(prev => ({ ...prev, visible: false }))}
              onFocus={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltip({
                  x: rect.left + rect.width / 2,
                  y: rect.top - 10,
                  content: `${item.label}\n${value.series}: ${value.value.toFixed(1)}`,
                  visible: true
                });
              }}
              onBlur={() => setTooltip(prev => ({ ...prev, visible: false }))}
            />
          );
        });
      }
    });

    return bars;
  };

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Bar chart showing data comparison"
        className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
      >
        {/* Grid lines */}
        <defs>
          <pattern id="barGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5E7EB" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#barGrid)" />

        {/* Y-axis labels */}
        {Array.from({ length: 6 }, (_, i) => {
          const value = minValue + (i / 5) * (maxValue - minValue);
          const y = yScale(value);
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={padding.left - 5}
                y2={y}
                stroke="#9CA3AF"
                strokeWidth="1"
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fill="#6B7280"
              >
                {value.toFixed(1)}
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {data.map((item, index) => (
          <text
            key={index}
            x={xScale(index)}
            y={height - padding.bottom + 35}
            textAnchor="middle"
            fontSize="12"
            fill="#6B7280"
            transform={`rotate(-45 ${xScale(index)} ${height - padding.bottom + 35})`}
          >
            {item.label}
          </text>
        ))}

        {/* Bars */}
        {generateBars()}

        {/* Axes */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={height - padding.bottom}
          stroke="#9CA3AF"
          strokeWidth="2"
        />
        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="#9CA3AF"
          strokeWidth="2"
        />

        {/* Zero line if needed */}
        {minValue < 0 && (
          <line
            x1={padding.left}
            y1={yScale(0)}
            x2={width - padding.right}
            y2={yScale(0)}
            stroke="#9CA3AF"
            strokeWidth="1"
            strokeDasharray="5,5"
          />
        )}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        {allSeriesNames.map((series, index) => (
          <div key={series} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-sm text-gray-700">{series}</span>
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="absolute z-10 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg pointer-events-none whitespace-pre-line"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translateX(-50%)'
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};
