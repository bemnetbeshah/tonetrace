import React, { useEffect, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useKeyboardNavigation } from './useKeyboardNavigation';
import { AccessibleButton } from './AccessibleButton';
import { focusManagement } from './accessibilityUtils';

interface AccessibleSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  position?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg' | 'full';
  testId?: string;
  className?: string;
  overlay?: boolean;
  closeOnOverlayClick?: boolean;
}

/**
 * AccessibleSidebar Component
 * Provides accessible sidebar functionality with Escape key support and focus management
 */
export const AccessibleSidebar: React.FC<AccessibleSidebarProps> = ({
  isOpen,
  onClose,
  children,
  title,
  position = 'left',
  size = 'md',
  testId,
  className = '',
  overlay = true,
  closeOnOverlayClick = true
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Size-specific classes
  const sizeClasses = {
    sm: 'w-80',
    md: 'w-96',
    lg: 'w-[32rem]',
    full: 'w-full'
  };

  // Position-specific classes
  const positionClasses = {
    left: 'left-0',
    right: 'right-0'
  };

  // Keyboard navigation hook
  const { containerRef } = useKeyboardNavigation({
    onEscape: onClose,
    trapFocus: true,
    autoFocus: true
  });

  // Store previous focus and restore on close
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, [isOpen]);

  // Handle overlay click
  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onClose();
    }
  };

  // Handle sidebar click (prevent closing when clicking inside)
  const handleSidebarClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  // Focus management
  useEffect(() => {
    if (isOpen && sidebarRef.current) {
      focusManagement.focusFirst(sidebarRef);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      {overlay && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleOverlayClick}
          aria-hidden="true"
          data-testid={`${testId}-overlay`}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`
          fixed top-0 h-full bg-white shadow-xl z-50
          transform transition-transform duration-300 ease-in-out
          ${positionClasses[position]}
          ${sizeClasses[size]}
          ${className}
        `.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? `${testId}-title` : undefined}
        data-testid={testId}
        onClick={handleSidebarClick}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          {title && (
            <h2
              id={`${testId}-title`}
              className="text-lg font-semibold text-slate-900"
            >
              {title}
            </h2>
          )}
          
          <AccessibleButton
            onClick={onClose}
            variant="ghost"
            size="sm"
            ariaLabel="Close sidebar"
            testId={`${testId}-close`}
            className="p-2"
          >
            <XMarkIcon className="w-5 h-5" />
          </AccessibleButton>
        </div>

        {/* Content */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto p-4"
          tabIndex={-1}
        >
          {children}
        </div>
      </div>
    </>
  );
};

/**
 * AccessibleSidebarTrigger Component
 * Provides accessible trigger button for sidebar
 */
export const AccessibleSidebarTrigger: React.FC<{
  onClick: () => void;
  ariaLabel?: string;
  testId?: string;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: React.ReactNode;
}> = ({ onClick, ariaLabel = 'Open sidebar', testId, className = '', icon: Icon, children }) => {
  return (
    <AccessibleButton
      onClick={onClick}
      variant="secondary"
      size="sm"
      ariaLabel={ariaLabel}
      testId={testId}
      className={className}
      icon={Icon}
    >
      {children || 'Menu'}
    </AccessibleButton>
  );
};

/**
 * AccessibleSidebarSection Component
 * Groups sidebar content with proper semantics
 */
export const AccessibleSidebarSection: React.FC<{
  children: React.ReactNode;
  title?: string;
  testId?: string;
  className?: string;
}> = ({ children, title, testId, className = '' }) => {
  return (
    <section
      className={`sidebar-section ${className}`}
      aria-labelledby={title ? `${testId}-section-title` : undefined}
      data-testid={testId}
    >
      {title && (
        <h3
          id={`${testId}-section-title`}
          className="text-sm font-medium text-slate-700 mb-3"
        >
          {title}
        </h3>
      )}
      
      <div className="space-y-2">
        {children}
      </div>
    </section>
  );
};

/**
 * AccessibleSidebarItem Component
 * Individual sidebar navigation item
 */
export const AccessibleSidebarItem: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  isActive?: boolean;
  testId?: string;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
}> = ({ children, onClick, href, isActive = false, testId, className = '', icon: Icon }) => {
  const baseClasses = `
    flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
    ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'}
    ${className}
  `.trim();

  if (href) {
    return (
      <a
        href={href}
        className={baseClasses}
        aria-current={isActive ? 'page' : undefined}
        data-testid={testId}
      >
        {Icon && <Icon className="w-5 h-5" />}
        <span>{children}</span>
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={baseClasses}
      aria-current={isActive ? 'page' : undefined}
      data-testid={testId}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span>{children}</span>
    </button>
  );
};

export default AccessibleSidebar; 