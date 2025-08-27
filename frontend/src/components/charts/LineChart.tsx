import React, { useState, useRef, useEffect } from 'react';

interface LineChartProps {
  data: { x: string | number; y: number }[];
  height: number;
  width: number;
  yDomain?: { min: number; max: number };
  color?: string;
  strokeWidth?: number;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  height,
  width,
  yDomain,
  color = '#3B82F6',
  strokeWidth = 2
}) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; value: string; visible: boolean }>({
    x: 0,
    y: 0,
    value: '',
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

  // Calculate domains
  const xValues = data.map(d => d.x);
  const yValues = data.map(d => d.y);
  
  const xMin = Math.min(...xValues.map(x => typeof x === 'string' ? new Date(x).getTime() : x));
  const xMax = Math.max(...xValues.map(x => typeof x === 'string' ? new Date(x).getTime() : x));
  
  const yMin = yDomain?.min ?? Math.min(...yValues);
  const yMax = yDomain?.max ?? Math.max(...yValues);

  // Padding for chart area
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Scale functions
  const xScale = (value: string | number) => {
    const x = typeof value === 'string' ? new Date(value).getTime() : value;
    return padding.left + ((x - xMin) / (xMax - xMin)) * chartWidth;
  };

  const yScale = (value: number) => {
    return padding.top + chartHeight - ((value - yMin) / (yMax - yMin)) * chartHeight;
  };

  // Generate path for line
  const generatePath = () => {
    if (data.length < 2) return '';
    
    const points = data.map(d => `${xScale(d.x)},${yScale(d.y)}`);
    return `M ${points.join(' L ')}`;
  };

  // Handle mouse events for tooltip
  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    
    // Find closest data point
    let closestPoint = data[0];
    let minDistance = Infinity;
    
    data.forEach(point => {
      const distance = Math.abs(xScale(point.x) - mouseX);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = point;
      }
    });

    setTooltip({
      x: event.clientX,
      y: event.clientY - 10,
      value: `${closestPoint.x}: ${closestPoint.y.toFixed(1)}`,
      visible: true
    });
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent<SVGSVGElement>) => {
    if (event.key === 'Tab') {
      // Show tooltip for first point when tabbing
      const firstPoint = data[0];
      if (firstPoint) {
        setTooltip({
          x: xScale(firstPoint.x) + (svgRef.current?.getBoundingClientRect().left ?? 0),
          y: yScale(firstPoint.y) + (svgRef.current?.getBoundingClientRect().top ?? 0) - 10,
          value: `${firstPoint.x}: ${firstPoint.y.toFixed(1)}`,
          visible: true
        });
      }
    }
  };

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="img"
        aria-label="Line chart showing data trends over time"
        className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
      >
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5E7EB" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Y-axis labels */}
        {Array.from({ length: 5 }, (_, i) => {
          const value = yMin + (i / 4) * (yMax - yMin);
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
        {data.map((point, i) => (
          <g key={i}>
            <text
              x={xScale(point.x)}
              y={height - padding.bottom + 20}
              textAnchor="middle"
              fontSize="12"
              fill="#6B7280"
              transform={`rotate(-45 ${xScale(point.x)} ${height - padding.bottom + 20})`}
            >
              {typeof point.x === 'string' ? new Date(point.x).toLocaleDateString() : point.x}
            </text>
          </g>
        ))}

        {/* Data line */}
        <path
          d={generatePath()}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {data.map((point, i) => (
          <circle
            key={i}
            cx={xScale(point.x)}
            cy={yScale(point.y)}
            r="4"
            fill={color}
            stroke="white"
            strokeWidth="2"
            className="cursor-pointer hover:r-6 transition-all duration-200"
            role="button"
            tabIndex={0}
            aria-label={`Data point ${i + 1}: ${point.x}, ${point.y}`}
            onFocus={() => {
              setTooltip({
                x: xScale(point.x) + (svgRef.current?.getBoundingClientRect().left ?? 0),
                y: yScale(point.y) + (svgRef.current?.getBoundingClientRect().top ?? 0) - 10,
                value: `${point.x}: ${point.y.toFixed(1)}`,
                visible: true
              });
            }}
            onBlur={() => {
              setTooltip(prev => ({ ...prev, visible: false }));
            }}
          />
        ))}

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
      </svg>

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="absolute z-10 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translateX(-50%)'
          }}
        >
          {tooltip.value}
        </div>
      )}
    </div>
  );
};
