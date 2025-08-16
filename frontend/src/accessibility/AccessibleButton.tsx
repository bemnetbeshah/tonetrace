import React from 'react';
import { createButtonProps } from './accessibilityUtils';

interface AccessibleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  expanded?: boolean;
  selected?: boolean;
  pressed?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaControls?: string;
  testId?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconPosition?: 'left' | 'right';
}

/**
 * AccessibleButton Component
 * Ensures all clickable items are proper buttons with clear labels and focus styles
 */
export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  onClick,
  disabled = false,
  expanded,
  selected,
  pressed,
  ariaLabel,
  ariaDescribedBy,
  ariaControls,
  testId,
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  icon: Icon,
  iconPosition = 'left'
}) => {
  // Base button classes with focus styles
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Variant-specific classes
  const variantClasses = {
    primary: 'bg-[#6C5CE7] text-white hover:opacity-90 focus:ring-[#6C5CE7]',
    secondary: 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 focus:ring-slate-300',
    ghost: 'bg-transparent hover:bg-slate-100 focus:ring-slate-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  
  // Size-specific classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  // Icon-specific classes
  const iconClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  // Create accessible button props
  const buttonProps = createButtonProps({
    onClick,
    disabled,
    expanded,
    selected,
    pressed,
    ariaLabel,
    ariaDescribedBy,
    ariaControls,
    testId
  });

  // Render icon and children
  const renderContent = () => {
    if (!Icon) return children;
    
    const iconElement = <Icon className={iconClasses[size]} />;
    
    if (iconPosition === 'left') {
      return (
        <>
          {iconElement}
          <span className="ml-2">{children}</span>
        </>
      );
    } else {
      return (
        <>
          <span className="mr-2">{children}</span>
          {iconElement}
        </>
      );
    }
  };

  return (
    <button
      type={type}
      className={classes}
      {...buttonProps}
    >
      {renderContent()}
    </button>
  );
};

export default AccessibleButton; 