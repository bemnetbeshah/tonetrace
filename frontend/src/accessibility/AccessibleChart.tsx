import React from 'react';
import { createChartProps, screenReader } from './accessibilityUtils';

interface AccessibleChartProps {
  children: React.ReactNode;
  ariaLabel: string;
  ariaDescribedBy?: string;
  caption?: string;
  testId?: string;
  className?: string;
  role?: 'img' | 'graphics-document' | 'application';
}

/**
 * AccessibleChart Component
 * Wraps charts with proper ARIA attributes and captions for screen readers
 */
export const AccessibleChart: React.FC<AccessibleChartProps> = ({
  children,
  ariaLabel,
  ariaDescribedBy,
  caption,
  testId,
  className = '',
  role = 'img'
}) => {
  // Create accessible chart props
  const chartProps = createChartProps({
    ariaLabel,
    ariaDescribedBy,
    testId
  });

  // Generate unique ID for aria-describedby if caption is provided
  const captionId = caption ? `chart-caption-${testId || 'default'}` : undefined;

  return (
    <div className={`accessible-chart ${className}`}>
      {/* Chart with accessibility attributes */}
      <div
        {...chartProps}
        role={role}
        aria-describedby={captionId}
        className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
        tabIndex={0}
      >
        {children}
      </div>
      
      {/* Caption for screen readers and visual users */}
      {caption && (
        <figcaption
          id={captionId}
          className="mt-2 text-sm text-slate-600 text-center"
        >
          {caption}
        </figcaption>
      )}
      
      {/* Screen reader announcement for chart content */}
      {ariaLabel && (
        <div className="sr-only">
          Chart: {ariaLabel}
          {caption && ` - ${caption}`}
        </div>
      )}
    </div>
  );
};

/**
 * AccessibleChartSection Component
 * Groups related charts with proper section semantics
 */
export const AccessibleChartSection: React.FC<{
  children: React.ReactNode;
  title: string;
  description?: string;
  testId?: string;
  className?: string;
}> = ({ children, title, description, testId, className = '' }) => {
  return (
    <section
      className={`chart-section ${className}`}
      aria-labelledby={`chart-section-title-${testId || 'default'}`}
      data-testid={testId}
    >
      <header className="mb-4">
        <h3
          id={`chart-section-title-${testId || 'default'}`}
          className="text-lg font-semibold text-slate-900 mb-2"
        >
          {title}
        </h3>
        {description && (
          <p className="text-slate-600 text-sm">
            {description}
          </p>
        )}
      </header>
      
      <div className="space-y-6">
        {children}
      </div>
    </section>
  );
};

/**
 * AccessibleChartGrid Component
 * Displays multiple charts in a grid with proper accessibility
 */
export const AccessibleChartGrid: React.FC<{
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  testId?: string;
  className?: string;
}> = ({ children, columns = 2, gap = 'md', testId, className = '' }) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };
  
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-6',
    lg: 'gap-8'
  };
  
  return (
    <div
      className={`chart-grid ${gridClasses[columns]} ${gapClasses[gap]} ${className}`}
      role="group"
      aria-label="Chart collection"
      data-testid={testId}
    >
      {children}
    </div>
  );
};

export default AccessibleChart; 