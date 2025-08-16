import { useEffect, useCallback, useRef } from 'react';
import { 
  isEscapeKey, 
  isEnterKey, 
  isSpaceKey, 
  isArrowKey,
  KEY_CODES 
} from './accessibilityUtils';

interface UseKeyboardNavigationOptions {
  onEscape?: () => void;
  onEnter?: () => void;
  onSpace?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onTab?: (event: KeyboardEvent) => void;
  trapFocus?: boolean;
  autoFocus?: boolean;
}

/**
 * Custom hook for managing keyboard navigation
 * Provides consistent keyboard handling patterns across components
 */
export const useKeyboardNavigation = (options: UseKeyboardNavigationOptions = {}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    onEscape,
    onEnter,
    onSpace,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onTab,
    trapFocus = false,
    autoFocus = false
  } = options;

  // Handle keyboard events
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key;

    switch (key) {
      case KEY_CODES.ESCAPE:
        if (onEscape) {
          event.preventDefault();
          onEscape();
        }
        break;

      case KEY_CODES.ENTER:
        if (onEnter) {
          event.preventDefault();
          onEnter();
        }
        break;

      case KEY_CODES.SPACE:
        if (onSpace) {
          event.preventDefault();
          onSpace();
        }
        break;

      case KEY_CODES.ARROW_UP:
        if (onArrowUp) {
          event.preventDefault();
          onArrowUp();
        }
        break;

      case KEY_CODES.ARROW_DOWN:
        if (onArrowDown) {
          event.preventDefault();
          onArrowDown();
        }
        break;

      case KEY_CODES.ARROW_LEFT:
        if (onArrowLeft) {
          event.preventDefault();
          onArrowLeft();
        }
        break;

      case KEY_CODES.ARROW_RIGHT:
        if (onArrowRight) {
          event.preventDefault();
          onArrowRight();
        }
        break;

      case KEY_CODES.TAB:
        if (onTab) {
          onTab(event);
        }
        break;
    }
  }, [onEscape, onEnter, onSpace, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, onTab]);

  // Focus trap for modals and off-canvas elements
  const handleFocusTrap = useCallback((event: KeyboardEvent) => {
    if (!trapFocus || !containerRef.current) return;

    if (event.key === KEY_CODES.TAB) {
      const container = containerRef.current;
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, [trapFocus]);

  // Set up event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Add keyboard event listener to container
    container.addEventListener('keydown', handleKeyDown as any);
    
    // Add focus trap if enabled
    if (trapFocus) {
      container.addEventListener('keydown', handleFocusTrap as any);
    }

    // Auto-focus first focusable element if enabled
    if (autoFocus) {
      const firstFocusable = container.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }

    return () => {
      container.removeEventListener('keydown', handleKeyDown as any);
      if (trapFocus) {
        container.removeEventListener('keydown', handleFocusTrap as any);
      }
    };
  }, [handleKeyDown, handleFocusTrap, trapFocus, autoFocus]);

  // Utility functions
  const focusFirst = useCallback(() => {
    if (!containerRef.current) return;
    
    const firstFocusable = containerRef.current.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;
    
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }, []);

  const focusLast = useCallback(() => {
    if (!containerRef.current) return;
    
    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      lastElement.focus();
    }
  }, []);

  const focusElement = useCallback((selector: string) => {
    if (!containerRef.current) return;
    
    const element = containerRef.current.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
    }
  }, []);

  return {
    containerRef,
    focusFirst,
    focusLast,
    focusElement
  };
};

export default useKeyboardNavigation; 