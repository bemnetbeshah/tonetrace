import React, { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { createInputProps, isEnterKey, isEscapeKey } from './accessibilityUtils';
import { AccessibleButton } from './AccessibleButton';

interface AccessibleSearchProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  onClear?: () => void;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  testId?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showClearButton?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
}

/**
 * AccessibleSearch Component
 * Provides accessible search functionality with Enter key support and proper ARIA attributes
 */
export const AccessibleSearch: React.FC<AccessibleSearchProps> = ({
  placeholder = 'Search...',
  value,
  onChange,
  onSearch,
  onClear,
  ariaLabel = 'Search',
  ariaDescribedBy,
  testId,
  className = '',
  size = 'md',
  showClearButton = true,
  autoFocus = false,
  disabled = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle search submission
  const handleSearch = () => {
    if (value.trim() && !disabled) {
      onSearch(value.trim());
    }
  };

  // Handle Enter key press
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (isEnterKey(event)) {
      event.preventDefault();
      handleSearch();
    } else if (isEscapeKey(event)) {
      event.preventDefault();
      if (onClear) {
        onClear();
      } else {
        onChange('');
      }
      inputRef.current?.blur();
    }
  };

  // Handle input change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  // Handle clear button click
  const handleClear = () => {
    onChange('');
    if (onClear) {
      onClear();
    }
    inputRef.current?.focus();
  };

  // Auto-focus if enabled
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Size-specific classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  // Create accessible input props
  const inputProps = createInputProps({
    type: 'search',
    placeholder,
    value,
    onChange: handleChange,
    onKeyDown,
    ariaLabel,
    ariaDescribedBy,
    testId: `${testId}-input`
  });

  return (
    <div className={`accessible-search ${className}`}>
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
          <MagnifyingGlassIcon className={iconSizeClasses[size]} />
        </div>

        {/* Search Input */}
        <input
          {...inputProps}
          ref={inputRef}
          disabled={disabled}
          className={`
            w-full pl-10 pr-12 border border-slate-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-slate-100 disabled:cursor-not-allowed
            ${sizeClasses[size]}
            ${isFocused ? 'ring-2 ring-blue-500 border-transparent' : ''}
          `.trim()}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-describedby={ariaDescribedBy}
        />

        {/* Clear Button */}
        {showClearButton && value && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <AccessibleButton
              onClick={handleClear}
              variant="ghost"
              size="sm"
              ariaLabel="Clear search"
              testId={`${testId}-clear`}
              className="p-1 h-8 w-8"
            >
              <XMarkIcon className="w-4 h-4" />
            </AccessibleButton>
          </div>
        )}

        {/* Search Button */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <AccessibleButton
            onClick={handleSearch}
            disabled={disabled || !value.trim()}
            variant="primary"
            size="sm"
            ariaLabel="Submit search"
            testId={`${testId}-submit`}
            className="px-3 py-1 h-8"
          >
            Search
          </AccessibleButton>
        </div>
      </div>

      {/* Search Instructions for Screen Readers */}
      <div className="sr-only" id={`${testId}-instructions`}>
        Type your search query and press Enter to search, or press Escape to clear.
      </div>
    </div>
  );
};

/**
 * AccessibleSearchWithFilters Component
 * Extends search with filter options
 */
export const AccessibleSearchWithFilters: React.FC<{
  searchProps: Omit<AccessibleSearchProps, 'testId'>;
  filters?: React.ReactNode;
  testId?: string;
  className?: string;
}> = ({ searchProps, filters, testId, className = '' }) => {
  return (
    <div className={`search-with-filters ${className}`}>
      <AccessibleSearch
        {...searchProps}
        testId={`${testId}-search`}
      />
      
      {filters && (
        <div
          className="mt-3"
          role="group"
          aria-label="Search filters"
          data-testid={`${testId}-filters`}
        >
          {filters}
        </div>
      )}
    </div>
  );
};

export default AccessibleSearch; 