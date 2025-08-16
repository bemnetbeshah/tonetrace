import { KeyboardEvent } from 'react';

// Keyboard key constants
export const KEY_CODES = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  SPACE: ' ',
  HOME: 'Home',
  END: 'End'
} as const;

// ARIA role constants
export const ARIA_ROLES = {
  BUTTON: 'button',
  LINK: 'link',
  MENU: 'menu',
  MENUITEM: 'menuitem',
  TAB: 'tab',
  TABPANEL: 'tabpanel',
  SEARCHBOX: 'searchbox',
  NAVIGATION: 'navigation',
  MAIN: 'main',
  BANNER: 'banner',
  COMPLEMENTARY: 'complementary',
  CONTENTINFO: 'contentinfo'
} as const;

// ARIA state constants
export const ARIA_STATES = {
  EXPANDED: 'aria-expanded',
  SELECTED: 'aria-selected',
  HIDDEN: 'aria-hidden',
  LABELLEDBY: 'aria-labelledby',
  DESCRIBEDBY: 'aria-describedby',
  CONTROLS: 'aria-controls',
  CURRENT: 'aria-current',
  ORIENTATION: 'aria-orientation'
} as const;

/**
 * Check if a keyboard event is for a specific key
 */
export const isKey = (event: KeyboardEvent, key: string): boolean => {
  return event.key === key;
};

/**
 * Check if a keyboard event is for Enter key
 */
export const isEnterKey = (event: KeyboardEvent): boolean => {
  return isKey(event, KEY_CODES.ENTER);
};

/**
 * Check if a keyboard event is for Escape key
 */
export const isEscapeKey = (event: KeyboardEvent): boolean => {
  return isKey(event, KEY_CODES.ESCAPE);
};

/**
 * Check if a keyboard event is for Tab key
 */
export const isTabKey = (event: KeyboardEvent): boolean => {
  return isKey(event, KEY_CODES.TAB);
};

/**
 * Check if a keyboard event is for Space key
 */
export const isSpaceKey = (event: KeyboardEvent): boolean => {
  return isKey(event, KEY_CODES.SPACE);
};

/**
 * Check if a keyboard event is for arrow keys
 */
export const isArrowKey = (event: KeyboardEvent): boolean => {
  return [
    KEY_CODES.ARROW_UP,
    KEY_CODES.ARROW_DOWN,
    KEY_CODES.ARROW_LEFT,
    KEY_CODES.ARROW_RIGHT
  ].includes(event.key as any);
};

/**
 * Check if a keyboard event is for navigation keys
 */
export const isNavigationKey = (event: KeyboardEvent): boolean => {
  return isArrowKey(event) || isKey(event, KEY_CODES.HOME) || isKey(event, KEY_CODES.END);
};

/**
 * Prevent default behavior for specific keys
 */
export const preventDefaultForKeys = (event: KeyboardEvent, keys: string[]): void => {
  if (keys.includes(event.key)) {
    event.preventDefault();
  }
};

/**
 * Create accessible button props with proper ARIA attributes
 */
export const createButtonProps = (options: {
  onClick?: () => void;
  disabled?: boolean;
  expanded?: boolean;
  selected?: boolean;
  pressed?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaControls?: string;
  testId?: string;
}) => {
  const {
    onClick,
    disabled = false,
    expanded,
    selected,
    pressed,
    ariaLabel,
    ariaDescribedBy,
    ariaControls,
    testId
  } = options;

  return {
    onClick,
    disabled,
    role: ARIA_ROLES.BUTTON,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'aria-controls': ariaControls,
    'aria-expanded': expanded,
    'aria-selected': selected,
    'aria-pressed': pressed,
    'data-testid': testId,
    className: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
  };
};

/**
 * Create accessible link props with proper ARIA attributes
 */
export const createLinkProps = (options: {
  href: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaCurrent?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false';
  testId?: string;
}) => {
  const { href, ariaLabel, ariaDescribedBy, ariaCurrent, testId } = options;

  return {
    href,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'aria-current': ariaCurrent,
    'data-testid': testId,
    className: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
  };
};

/**
 * Create accessible form input props
 */
export const createInputProps = (options: {
  type: 'text' | 'search' | 'email' | 'password' | 'number';
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaRequired?: boolean;
  testId?: string;
}) => {
  const {
    type,
    placeholder,
    value,
    onChange,
    onKeyDown,
    ariaLabel,
    ariaDescribedBy,
    ariaRequired,
    testId
  } = options;

  return {
    type,
    placeholder,
    value,
    onChange,
    onKeyDown,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'aria-required': ariaRequired,
    'data-testid': testId,
    className: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
  };
};

/**
 * Create accessible table props
 */
export const createTableProps = (options: {
  ariaLabel?: string;
  ariaDescribedBy?: string;
  testId?: string;
}) => {
  const { ariaLabel, ariaDescribedBy, testId } = options;

  return {
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'data-testid': testId,
    role: 'table'
  };
};

/**
 * Create accessible table row props
 */
export const createTableRowProps = (options: {
  isHeader?: boolean;
  ariaSelected?: boolean;
  testId?: string;
}) => {
  const { isHeader = false, ariaSelected, testId } = options;

  return {
    role: isHeader ? 'row' : 'row',
    'aria-selected': ariaSelected,
    'data-testid': testId
  };
};

/**
 * Create accessible chart props
 */
export const createChartProps = (options: {
  ariaLabel: string;
  ariaDescribedBy?: string;
  testId?: string;
}) => {
  const { ariaLabel, ariaDescribedBy, testId } = options;

  return {
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'data-testid': testId,
    role: 'img'
  };
};

/**
 * Focus management utilities
 */
export const focusManagement = {
  /**
   * Trap focus within a container
   */
  trapFocus: (containerRef: React.RefObject<HTMLElement>, event: KeyboardEvent): void => {
    if (!isTabKey(event)) return;

    const container = containerRef.current;
    if (!container) return;

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
  },

  /**
   * Move focus to first focusable element in container
   */
  focusFirst: (containerRef: React.RefObject<HTMLElement>): void => {
    const container = containerRef.current;
    if (!container) return;

    const firstFocusable = container.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;

    if (firstFocusable) {
      firstFocusable.focus();
    }
  },

  /**
   * Move focus to last focusable element in container
   */
  focusLast: (containerRef: React.RefObject<HTMLElement>): void => {
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length > 0) {
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      lastElement.focus();
    }
  }
};

/**
 * Screen reader utilities
 */
export const screenReader = {
  /**
   * Announce text to screen readers
   */
  announce: (text: string): void => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = text;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  /**
   * Create screen reader only text
   */
  only: (text: string): JSX.Element => (
    <span className="sr-only">{text}</span>
  )
}; 