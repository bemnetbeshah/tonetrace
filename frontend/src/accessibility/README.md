# Accessibility & Keyboard Navigation Module

## Overview

The Accessibility & Keyboard Navigation Module provides consistent patterns for keyboard and ARIA support across the ToneTrace application. It ensures that all interactive elements are accessible to users with disabilities and provide a seamless keyboard navigation experience.

## Purpose

- **Consistent patterns for keyboard and ARIA**: Standardized accessibility implementation across all components
- **Keyboard navigation support**: Full keyboard accessibility for all interactive elements
- **Screen reader compatibility**: Proper ARIA attributes and semantic markup
- **Focus management**: Intelligent focus handling and visible focus indicators

## Core Rules Implemented

### 1. All clickable items are `<button>` or `<a>` with clear labels
- **AccessibleButton**: Ensures proper button semantics and ARIA attributes
- **AccessibleTableAction**: Provides proper link actions for table rows
- **Clear labeling**: Descriptive aria-labels for all interactive elements

### 2. Charts include aria-label and concise captions
- **AccessibleChart**: Wraps charts with proper ARIA attributes
- **Descriptive labels**: Clear descriptions of chart content for screen readers
- **Visual captions**: User-friendly captions for both visual and screen reader users

### 3. Focus styles are visible using Tailwind ring utilities
- **Consistent focus indicators**: `focus:ring-2 focus:ring-offset-2` pattern
- **Color-coded rings**: Different colors for different component types
- **High contrast**: Visible focus indicators that meet accessibility standards

### 4. Escape closes off-canvas sidebar on small screens
- **AccessibleSidebar**: Escape key support for closing modals and sidebars
- **Focus management**: Proper focus trapping and restoration
- **Keyboard shortcuts**: Consistent escape key behavior across components

### 5. Enter triggers search in header
- **AccessibleSearch**: Enter key support for search submission
- **Escape key clearing**: Escape key clears search input
- **Keyboard-first design**: Search works entirely via keyboard

### 6. Table rows do not steal focus. Open action is a proper link
- **AccessibleTable**: Proper table semantics without focus stealing
- **Link actions**: Table actions are proper `<a>` elements
- **Keyboard navigation**: Full keyboard support for table interactions

## Core Components

### 1. Accessibility Utilities (`accessibilityUtils.ts`)

Core utility functions and constants for accessibility:

```typescript
import { 
  KEY_CODES, 
  ARIA_ROLES, 
  ARIA_STATES,
  isEnterKey,
  isEscapeKey,
  createButtonProps,
  createChartProps,
  focusManagement
} from './accessibilityUtils';
```

**Key Features:**
- **Keyboard constants**: Standardized key codes for consistent handling
- **ARIA constants**: Predefined ARIA roles and states
- **Utility functions**: Helper functions for common accessibility patterns
- **Focus management**: Utilities for managing focus within components

### 2. Keyboard Navigation Hook (`useKeyboardNavigation.ts`)

Custom hook for managing keyboard navigation patterns:

```typescript
const { containerRef, focusFirst, focusLast } = useKeyboardNavigation({
  onEscape: handleClose,
  onEnter: handleSubmit,
  trapFocus: true,
  autoFocus: true
});
```

**Key Features:**
- **Event handling**: Automatic keyboard event management
- **Focus trapping**: Prevents focus from leaving modal/sidebar
- **Auto-focus**: Automatically focuses first interactive element
- **Customizable**: Configurable for different use cases

### 3. AccessibleButton Component

Ensures all clickable items are proper buttons with clear labels:

```typescript
<AccessibleButton
  onClick={handleClick}
  variant="primary"
  size="md"
  ariaLabel="Clear search input"
  testId="clear-search-btn"
  icon={XMarkIcon}
>
  Clear
</AccessibleButton>
```

**Key Features:**
- **Proper semantics**: Always renders as `<button>` element
- **ARIA support**: Automatic aria-label and role attributes
- **Focus styles**: Consistent focus ring styling
- **Icon support**: Optional icons with proper positioning

### 4. AccessibleChart Component

Wraps charts with proper ARIA attributes and captions:

```typescript
<AccessibleChart
  ariaLabel="Student performance metrics showing average scores by subject"
  caption="Student Performance Overview"
  testId="performance-chart"
>
  {/* Chart content */}
</AccessibleChart>
```

**Key Features:**
- **ARIA labels**: Descriptive labels for screen readers
- **Visual captions**: User-friendly captions for all users
- **Focus support**: Keyboard navigation within charts
- **Semantic markup**: Proper roles and descriptions

### 5. AccessibleTable Component

Provides accessible table structure with proper semantics:

```typescript
<AccessibleTable
  ariaLabel="Student information table"
  caption="Student Directory"
  testId="students-table"
>
  <AccessibleTableHead>
    <AccessibleTableRow isHeader>
      <AccessibleTableCell isHeader scope="col">Name</AccessibleTableCell>
    </AccessibleTableRow>
  </AccessibleTableHead>
  <AccessibleTableBody>
    {/* Table rows */}
  </AccessibleTableBody>
</AccessibleTable>
```

**Key Features:**
- **No focus stealing**: Table rows don't interfere with focus
- **Proper actions**: Table actions are proper links
- **Semantic markup**: Correct table structure and roles
- **Keyboard support**: Full keyboard navigation

### 6. AccessibleSearch Component

Provides accessible search functionality with Enter key support:

```typescript
<AccessibleSearch
  value={searchQuery}
  onChange={setSearchQuery}
  onSearch={handleSearch}
  placeholder="Search students..."
  ariaLabel="Search students by name or email"
  testId="student-search"
/>
```

**Key Features:**
- **Enter key search**: Enter triggers search submission
- **Escape key clearing**: Escape clears search input
- **Clear button**: Accessible clear functionality
- **ARIA support**: Proper search input semantics

### 7. AccessibleSidebar Component

Provides accessible sidebar functionality with Escape key support:

```typescript
<AccessibleSidebar
  isOpen={isSidebarOpen}
  onClose={() => setIsSidebarOpen(false)}
  title="Navigation Menu"
  testId="main-sidebar"
  size="md"
>
  {/* Sidebar content */}
</AccessibleSidebar>
```

**Key Features:**
- **Escape key closing**: Escape closes sidebar
- **Focus management**: Proper focus trapping and restoration
- **Overlay support**: Accessible overlay with click handling
- **Keyboard navigation**: Full keyboard support within sidebar

## Usage Patterns

### Basic Accessibility Setup

```typescript
import { 
  AccessibleButton, 
  AccessibleChart, 
  useKeyboardNavigation 
} from '../accessibility';

function MyComponent() {
  const { containerRef } = useKeyboardNavigation({
    onEscape: handleClose,
    onEnter: handleSubmit
  });

  return (
    <div ref={containerRef}>
      <AccessibleButton
        onClick={handleClick}
        ariaLabel="Submit form data"
        testId="submit-btn"
      >
        Submit
      </AccessibleButton>
      
      <AccessibleChart
        ariaLabel="Data visualization chart"
        caption="Performance Metrics"
        testId="perf-chart"
      >
        {/* Chart content */}
      </AccessibleChart>
    </div>
  );
}
```

### Keyboard Navigation Integration

```typescript
import { useKeyboardNavigation } from '../accessibility';

function Modal({ isOpen, onClose }) {
  const { containerRef, focusFirst } = useKeyboardNavigation({
    onEscape: onClose,
    trapFocus: true,
    autoFocus: true
  });

  useEffect(() => {
    if (isOpen) {
      focusFirst();
    }
  }, [isOpen, focusFirst]);

  return (
    <div ref={containerRef} role="dialog" aria-modal="true">
      {/* Modal content */}
    </div>
  );
}
```

### Table Accessibility

```typescript
import { 
  AccessibleTable, 
  AccessibleTableAction 
} from '../accessibility';

function StudentsTable({ students }) {
  return (
    <AccessibleTable
      ariaLabel="Student information table"
      caption="Student Directory"
      testId="students-table"
    >
      <AccessibleTableHead>
        <AccessibleTableRow isHeader>
          <AccessibleTableCell isHeader scope="col">Name</AccessibleTableCell>
          <AccessibleTableCell isHeader scope="col">Actions</AccessibleTableCell>
        </AccessibleTableRow>
      </AccessibleTableHead>
      
      <AccessibleTableBody>
        {students.map(student => (
          <AccessibleTableRow key={student.id}>
            <AccessibleTableCell>{student.name}</AccessibleTableCell>
            <AccessibleTableCell>
              <AccessibleTableAction
                href={`/students/${student.id}`}
                ariaLabel={`View details for ${student.name}`}
                testId={`view-${student.id}`}
              >
                View
              </AccessibleTableAction>
            </AccessibleTableCell>
          </AccessibleTableRow>
        ))}
      </AccessibleTableBody>
    </AccessibleTable>
  );
}
```

## Accessibility Features

### Keyboard Navigation

- **Enter key**: Triggers primary actions (search, submit, etc.)
- **Escape key**: Closes modals, sidebars, and clears inputs
- **Tab key**: Navigates between focusable elements
- **Arrow keys**: Navigation within components (lists, menus, etc.)
- **Space key**: Activates buttons and checkboxes

### ARIA Support

- **Labels**: Descriptive aria-labels for all interactive elements
- **Roles**: Proper semantic roles (button, link, dialog, etc.)
- **States**: ARIA states for dynamic content (expanded, selected, etc.)
- **Relationships**: ARIA relationships (controls, describedby, etc.)

### Focus Management

- **Visible focus**: Clear focus indicators using Tailwind ring utilities
- **Focus trapping**: Prevents focus from leaving modal/sidebar contexts
- **Focus restoration**: Returns focus to previous element when closing modals
- **Logical order**: Tab order follows logical content flow

### Screen Reader Support

- **Descriptive text**: Clear, concise descriptions for all content
- **Semantic markup**: Proper HTML structure and ARIA attributes
- **Live regions**: Dynamic content updates announced to screen readers
- **Skip links**: Navigation shortcuts for keyboard users

## Best Practices

### 1. Always Use Accessible Components

```typescript
// ✅ Good - Uses AccessibleButton
<AccessibleButton onClick={handleClick} ariaLabel="Save changes">
  Save
</AccessibleButton>

// ❌ Bad - Generic button without accessibility
<button onClick={handleClick}>Save</button>
```

### 2. Provide Clear Labels

```typescript
// ✅ Good - Clear, descriptive label
<AccessibleButton ariaLabel="Delete student record permanently">
  Delete
</AccessibleButton>

// ❌ Bad - Unclear or missing label
<AccessibleButton>X</AccessibleButton>
```

### 3. Use Proper ARIA Roles

```typescript
// ✅ Good - Proper dialog role
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Edit Student</h2>
</div>

// ❌ Bad - Missing ARIA attributes
<div>
  <h2>Edit Student</h2>
</div>
```

### 4. Implement Keyboard Navigation

```typescript
// ✅ Good - Full keyboard support
const { containerRef } = useKeyboardNavigation({
  onEscape: handleClose,
  onEnter: handleSubmit
});

// ❌ Bad - Mouse-only interaction
<div onClick={handleClick}>
  Click me
</div>
```

### 5. Test with Screen Readers

- Use screen reader software (NVDA, JAWS, VoiceOver)
- Test keyboard-only navigation
- Verify focus indicators are visible
- Check ARIA announcements are clear

## Testing

### Keyboard Navigation Testing

```typescript
// Test keyboard events
import { render, fireEvent } from '@testing-library/react';
import { AccessibleButton } from '../accessibility';

test('handles keyboard events correctly', () => {
  const handleClick = jest.fn();
  const { getByTestId } = render(
    <AccessibleButton onClick={handleClick} testId="test-btn">
      Test Button
    </AccessibleButton>
  );

  const button = getByTestId('test-btn');
  
  // Test Enter key
  fireEvent.keyDown(button, { key: 'Enter' });
  expect(handleClick).toHaveBeenCalled();
  
  // Test Space key
  fireEvent.keyDown(button, { key: ' ' });
  expect(handleClick).toHaveBeenCalled();
});
```

### ARIA Testing

```typescript
// Test ARIA attributes
test('has proper ARIA attributes', () => {
  const { getByTestId } = render(
    <AccessibleButton 
      ariaLabel="Test button" 
      testId="test-btn"
    >
      Test
    </AccessibleButton>
  );

  const button = getByTestId('test-btn');
  expect(button).toHaveAttribute('aria-label', 'Test button');
  expect(button).toHaveAttribute('role', 'button');
});
```

## Integration Points

### Component Library Integration

The accessibility module integrates seamlessly with the existing component library:

- **Replaces existing buttons**: Use AccessibleButton instead of generic buttons
- **Enhances existing components**: Wrap charts with AccessibleChart
- **Improves tables**: Use AccessibleTable for all data tables
- **Adds keyboard support**: Integrate useKeyboardNavigation where needed

### Existing Component Updates

Components that should be updated to use accessibility features:

- **TopHeader**: Integrate AccessibleSearch for better keyboard support
- **SidebarNav**: Use AccessibleSidebar for mobile responsiveness
- **Data tables**: Replace with AccessibleTable components
- **Chart components**: Wrap with AccessibleChart for screen reader support

## Future Enhancements

Potential improvements for future versions:

- **Advanced focus management**: More sophisticated focus algorithms
- **Gesture support**: Touch and gesture accessibility
- **Voice control**: Voice command integration
- **High contrast themes**: Enhanced visual accessibility
- **Reduced motion**: Respect user motion preferences
- **Internationalization**: Multi-language accessibility support

## Resources

### Accessibility Standards

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Web Accessibility Initiative](https://www.w3.org/WAI/)

### Testing Tools

- [axe-core](https://github.com/dequelabs/axe-core) - Automated accessibility testing
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Accessibility auditing
- [WAVE](https://wave.webaim.org/) - Web accessibility evaluation tool

### Browser Extensions

- [axe DevTools](https://www.deque.com/axe/browser-extensions/)
- [Accessibility Insights](https://accessibilityinsights.io/)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/) 