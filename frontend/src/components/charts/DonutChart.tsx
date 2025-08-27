import React, { useState, useRef } from 'react';

interface DonutChartData {
  label: string;
  value: number;
}

interface DonutChartProps {
  data: DonutChartData[];
  height: number;
  width: number;
  innerRadiusRatio?: number;
  colors?: string[];
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  height,
  width,
  innerRadiusRatio = 0.6,
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316', '#EC4899']
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

  // Calculate total and percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const percentages = data.map(item => (item.value / total) * 100);

  // Chart dimensions
  const centerX = width / 2;
  const centerY = height / 2;
  const outerRadius = Math.min(width, height) / 2 - 40;
  const innerRadius = outerRadius * innerRadiusRatio;

  // Generate SVG path for each slice
  const generateSlicePath = (startAngle: number, endAngle: number, outerR: number, innerR: number) => {
    const startOuterX = centerX + outerR * Math.cos(startAngle);
    const startOuterY = centerY + outerR * Math.sin(startAngle);
    const endOuterX = centerX + outerR * Math.cos(endAngle);
    const endOuterY = centerY + outerR * Math.sin(endAngle);
    
    const startInnerX = centerX + innerR * Math.cos(startAngle);
    const startInnerY = centerY + innerR * Math.sin(startAngle);
    const endInnerX = centerX + innerR * Math.cos(endAngle);
    const endInnerY = centerY + innerR * Math.sin(endAngle);
    
    const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
    
    return [
      `M ${startOuterX} ${startOuterY}`,
      `A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${endOuterX} ${endOuterY}`,
      `L ${endInnerX} ${endInnerY}`,
      `A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${startInnerX} ${startInnerY}`,
      'Z'
    ].join(' ');
  };

  // Generate slices
  const generateSlices = () => {
    const slices: JSX.Element[] = [];
    let currentAngle = -Math.PI / 2; // Start from top
    
    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      const endAngle = currentAngle + sliceAngle;
      
      const slicePath = generateSlicePath(currentAngle, endAngle, outerRadius, innerRadius);
      
      slices.push(
        <path
          key={index}
          d={slicePath}
          fill={colors[index % colors.length]}
          className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
          role="button"
          tabIndex={0}
          aria-label={`${item.label}: ${item.value} (${percentages[index].toFixed(1)}%)`}
          onMouseEnter={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setTooltip({
              x: rect.left + rect.width / 2,
              y: rect.top - 10,
              content: `${item.label}\n${item.value} (${percentages[index].toFixed(1)}%)`,
              visible: true
            });
          }}
          onMouseLeave={() => setTooltip(prev => ({ ...prev, visible: false }))}
          onFocus={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setTooltip({
              x: rect.left + rect.width / 2,
              y: rect.top - 10,
              content: `${item.label}\n${item.value} (${percentages[index].toFixed(1)}%)`,
              visible: true
            });
          }}
          onBlur={() => setTooltip(prev => ({ ...prev, visible: false }))}
        />
      );
      
      currentAngle = endAngle;
    });
    
    return slices;
  };

  // Generate labels
  const generateLabels = () => {
    const labels: JSX.Element[] = [];
    let currentAngle = -Math.PI / 2;
    
    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      const labelAngle = currentAngle + sliceAngle / 2;
      
      // Position label outside the chart
      const labelRadius = outerRadius + 20;
      const labelX = centerX + labelRadius * Math.cos(labelAngle);
      const labelY = centerY + labelRadius * Math.sin(labelAngle);
      
      // Adjust text anchor and alignment based on angle
      let textAnchor = 'middle';
      let dominantBaseline = 'middle';
      
      if (labelAngle > Math.PI / 2 && labelAngle < 3 * Math.PI / 2) {
        textAnchor = 'end';
      } else if (labelAngle < -Math.PI / 2 || labelAngle > Math.PI / 2) {
        textAnchor = 'start';
      }
      
      if (labelAngle > 0 && labelAngle < Math.PI) {
        dominantBaseline = 'hanging';
      } else if (labelAngle > Math.PI && labelAngle < 2 * Math.PI) {
        dominantBaseline = 'auto';
      }
      
      labels.push(
        <text
          key={index}
          x={labelX}
          y={labelY}
          textAnchor={textAnchor}
          dominantBaseline={dominantBaseline}
          fontSize="12"
          fill="#374151"
          className="pointer-events-none"
        >
          {item.label}
        </text>
      );
      
      currentAngle += sliceAngle;
    });
    
    return labels;
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
        aria-label="Donut chart showing data distribution"
        className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
      >
        {/* Slices */}
        {generateSlices()}
        
        {/* Labels */}
        {generateLabels()}
        
        {/* Center circle (donut hole) */}
        <circle
          cx={centerX}
          cy={centerY}
          r={innerRadius}
          fill="white"
          stroke="#E5E7EB"
          strokeWidth="1"
        />
        

      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        {data.map((item, index) => (
          <div key={item.label} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-sm text-gray-700">
              {item.label} ({percentages[index].toFixed(1)}%)
            </span>
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
