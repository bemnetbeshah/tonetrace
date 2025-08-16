import React from 'react';
import { createTableProps, createTableRowProps, createLinkProps } from './accessibilityUtils';

interface AccessibleTableProps {
  children: React.ReactNode;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  testId?: string;
  className?: string;
  caption?: string;
}

interface AccessibleTableRowProps {
  children: React.ReactNode;
  isHeader?: boolean;
  ariaSelected?: boolean;
  testId?: string;
  className?: string;
  onClick?: () => void;
  isClickable?: boolean;
}

interface AccessibleTableCellProps {
  children: React.ReactNode;
  isHeader?: boolean;
  scope?: 'row' | 'col' | 'rowgroup' | 'colgroup';
  colSpan?: number;
  rowSpan?: number;
  testId?: string;
  className?: string;
}

interface AccessibleTableActionProps {
  href: string;
  children: React.ReactNode;
  ariaLabel?: string;
  testId?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
}

/**
 * AccessibleTable Component
 * Provides accessible table structure with proper ARIA attributes
 */
export const AccessibleTable: React.FC<AccessibleTableProps> = ({
  children,
  ariaLabel,
  ariaDescribedBy,
  testId,
  className = '',
  caption
}) => {
  // Create accessible table props
  const tableProps = createTableProps({
    ariaLabel,
    ariaDescribedBy,
    testId
  });

  // Generate unique ID for caption if provided
  const captionId = caption ? `table-caption-${testId || 'default'}` : undefined;

  return (
    <div className={`accessible-table ${className}`}>
      {caption && (
        <caption
          id={captionId}
          className="mb-2 text-sm font-medium text-slate-900 text-left"
        >
          {caption}
        </caption>
      )}
      
      <table
        {...tableProps}
        aria-describedby={captionId}
        className="w-full border-collapse"
      >
        {children}
      </table>
    </div>
  );
};

/**
 * AccessibleTableHead Component
 * Provides accessible table header structure
 */
export const AccessibleTableHead: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <thead className="bg-slate-50">
      {children}
    </thead>
  );
};

/**
 * AccessibleTableBody Component
 * Provides accessible table body structure
 */
export const AccessibleTableBody: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <tbody className="divide-y divide-slate-200">
      {children}
    </tbody>
  );
};

/**
 * AccessibleTableRow Component
 * Ensures table rows don't steal focus and are properly accessible
 */
export const AccessibleTableRow: React.FC<AccessibleTableRowProps> = ({
  children,
  isHeader = false,
  ariaSelected,
  testId,
  className = '',
  onClick,
  isClickable = false
}) => {
  // Create accessible table row props
  const rowProps = createTableRowProps({
    isHeader,
    ariaSelected,
    testId
  });

  // Handle row click if provided
  const handleRowClick = () => {
    if (onClick && !isHeader) {
      onClick();
    }
  };

  // Handle keyboard interaction for clickable rows
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isClickable && !isHeader && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      handleRowClick();
    }
  };

  const rowClasses = `
    ${isHeader ? 'bg-slate-50' : 'bg-white hover:bg-slate-50'}
    ${isClickable && !isHeader ? 'cursor-pointer' : ''}
    ${className}
  `.trim();

  return (
    <tr
      {...rowProps}
      className={rowClasses}
      onClick={isClickable && !isHeader ? handleRowClick : undefined}
      onKeyDown={isClickable && !isHeader ? handleKeyDown : undefined}
      tabIndex={isClickable && !isHeader ? 0 : undefined}
      role={isHeader ? 'row' : 'row'}
      aria-label={isClickable && !isHeader ? 'Clickable row' : undefined}
    >
      {children}
    </tr>
  );
};

/**
 * AccessibleTableCell Component
 * Provides accessible table cell structure
 */
export const AccessibleTableCell: React.FC<AccessibleTableCellProps> = ({
  children,
  isHeader = false,
  scope,
  colSpan,
  rowSpan,
  testId,
  className = ''
}) => {
  const Component = isHeader ? 'th' : 'td';
  
  return (
    <Component
      scope={scope}
      colSpan={colSpan}
      rowSpan={rowSpan}
      className={`
        px-4 py-3 text-sm text-slate-900
        ${isHeader ? 'font-medium text-slate-700' : ''}
        ${className}
      `.trim()}
      data-testid={testId}
    >
      {children}
    </Component>
  );
};

/**
 * AccessibleTableAction Component
 * Provides proper link actions for table rows
 */
export const AccessibleTableAction: React.FC<AccessibleTableActionProps> = ({
  href,
  children,
  ariaLabel,
  testId,
  className = '',
  variant = 'primary',
  size = 'sm'
}) => {
  // Create accessible link props
  const linkProps = createLinkProps({
    href,
    ariaLabel,
    testId
  });

  // Variant-specific classes
  const variantClasses = {
    primary: 'text-blue-600 hover:text-blue-800',
    secondary: 'text-slate-600 hover:text-slate-800',
    ghost: 'text-slate-500 hover:text-slate-700'
  };
  
  // Size-specific classes
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm'
  };

  const classes = `
    inline-flex items-center gap-1 font-medium transition-colors
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `.trim();

  return (
    <a
      {...linkProps}
      className={classes}
    >
      {children}
    </a>
  );
};

/**
 * AccessibleTableActions Component
 * Groups multiple actions in a table row
 */
export const AccessibleTableActions: React.FC<{
  children: React.ReactNode;
  testId?: string;
  className?: string;
}> = ({ children, testId, className = '' }) => {
  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      role="group"
      aria-label="Table row actions"
      data-testid={testId}
    >
      {children}
    </div>
  );
};

export default AccessibleTable; 