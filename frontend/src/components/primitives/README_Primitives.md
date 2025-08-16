# Primitive Components

## Overview
Small, reusable components used across the application for consistent UI patterns. These primitives provide the building blocks for larger components and pages.

## Components

### Button
**Purpose**: Interactive button component with multiple variants and sizes
**Use Case**: All interactive actions, form submissions, navigation

**Props**:
- `variant?: 'primary' | 'secondary' | 'ghost'` - Button style variant
- `size?: 'sm' | 'md'` - Button size
- `onClick?: () => void` - Click handler function
- `children: React.ReactNode` - Button content
- `className?: string` - Additional CSS classes
- `disabled?: boolean` - Disabled state
- `type?: 'button' | 'submit' | 'reset'` - Button type

**Variants**:
- **Primary**: `bg-[#6C5CE7] text-white hover:opacity-90` - Main actions
- **Secondary**: `bg-white border border-slate-200 text-slate-900 hover:bg-slate-50` - Secondary actions
- **Ghost**: `bg-transparent hover:bg-slate-100` - Subtle actions

**Sizes**:
- **Small**: `px-3 py-1.5 text-sm` - Compact buttons
- **Medium**: `px-4 py-2 text-base` - Standard buttons

**Example**:
```tsx
import { Button } from './primitives';

// Basic usage
<Button onClick={handleClick}>Click Me</Button>

// With variants and sizes
<Button variant="primary" size="sm" onClick={handleSubmit}>
  Submit
</Button>

// Disabled state
<Button variant="secondary" disabled>
  Processing...
</Button>

// Form buttons
<Button type="submit" variant="primary">Save</Button>
<Button type="reset" variant="ghost">Cancel</Button>
```

### Badge
**Purpose**: Status indicators and labels with semantic color coding
**Use Case**: Status displays, priority indicators, metadata labels

**Props**:
- `tone?: 'success' | 'warning' | 'danger' | 'muted'` - Badge color tone
- `children: string` - Badge text content
- `className?: string` - Additional CSS classes

**Tones**:
- **Success**: `bg-emerald-100 text-emerald-800` - Positive states
- **Warning**: `bg-amber-100 text-amber-800` - Caution states
- **Danger**: `bg-red-100 text-red-800` - Error/critical states
- **Muted**: `bg-slate-100 text-slate-700` - Neutral states

**Example**:
```tsx
import { Badge } from './primitives';

// Basic usage
<Badge>Default</Badge>

// With specific tones
<Badge tone="success">Active</Badge>
<Badge tone="warning">Pending</Badge>
<Badge tone="danger">Failed</Badge>
<Badge tone="muted">Unknown</Badge>

// Custom styling
<Badge tone="success" className="border border-emerald-300">
  Success with Border
</Badge>
```

## Styling

### Base Classes
All primitive components include:
- **Responsive Design**: Adapts to different screen sizes
- **Focus States**: Proper focus rings for accessibility
- **Transitions**: Smooth hover and focus animations
- **Typography**: Consistent font weights and sizes

### Customization
Components support custom styling via the `className` prop:

```tsx
// Custom button styling
<Button 
  variant="primary" 
  className="shadow-lg hover:shadow-xl"
>
  Custom Button
</Button>

// Custom badge styling
<Badge 
  tone="success" 
  className="uppercase tracking-wide font-bold"
>
  Custom Badge
</Badge>
```

## Accessibility

### Button
- Proper `button` element semantics
- Focus ring indicators
- Disabled state handling
- ARIA support for screen readers
- Keyboard navigation support

### Badge
- Semantic color coding
- High contrast ratios
- Screen reader friendly
- No interactive behavior (purely presentational)

## Usage Patterns

### Common Button Combinations
```tsx
// Form actions
<div className="flex gap-2">
  <Button variant="primary" type="submit">Save</Button>
  <Button variant="secondary">Cancel</Button>
  <Button variant="ghost">Reset</Button>
</div>

// Action buttons
<div className="flex gap-2">
  <Button variant="primary" size="sm">Edit</Button>
  <Button variant="danger" size="sm">Delete</Button>
</div>
```

### Common Badge Combinations
```tsx
// Status indicators
<div className="flex items-center gap-2">
  <span>Status:</span>
  <Badge tone="success">Active</Badge>
</div>

// Priority levels
<div className="flex items-center gap-2">
  <span>Priority:</span>
  <Badge tone="danger">High</Badge>
  <Badge tone="warning">Medium</Badge>
  <Badge tone="success">Low</Badge>
</div>
```

### Integration with Other Components
```tsx
// In tables
<tr>
  <td>Assignment 1</td>
  <td><Badge tone="success">Submitted</Badge></td>
  <td>
    <Button variant="primary" size="sm">View</Button>
  </td>
</tr>

// In cards
<div className="card">
  <div className="flex justify-between items-start">
    <h3>Analysis Result</h3>
    <Badge tone="warning">Processing</Badge>
  </div>
  <Button variant="secondary" size="sm">Download</Button>
</div>
```

## Best Practices

### 1. Button Usage
- Use **Primary** for main actions (Submit, Save, Continue)
- Use **Secondary** for alternative actions (Cancel, Back, Edit)
- Use **Ghost** for subtle actions (Reset, Clear, Close)
- Match button size to context (small for inline, medium for standalone)

### 2. Badge Usage
- Use **Success** for positive states (Active, Completed, Valid)
- Use **Warning** for caution states (Pending, Draft, Processing)
- Use **Danger** for error states (Failed, Error, Critical)
- Use **Muted** for neutral states (Unknown, General, Default)

### 3. Consistency
- Maintain consistent spacing between related elements
- Use appropriate sizes for the context
- Ensure proper contrast ratios
- Follow established patterns across the application

### 4. Accessibility
- Always provide meaningful text content
- Use semantic colors appropriately
- Ensure keyboard navigation works
- Test with screen readers

## Demo Components

### Individual Demos
- `ButtonDemo` - Showcases all button variants and sizes
- `BadgeDemo` - Demonstrates all badge tones and usage patterns

### Comprehensive Demo
- `PrimitivesDemo` - Complete showcase of both components
- Interactive examples and combinations
- Real-world usage scenarios

## Testing

All primitive components include proper test IDs and accessibility attributes:

```tsx
// Button testing
<Button data-testid="submit-button" onClick={handleSubmit}>
  Submit
</Button>

// Badge testing
<Badge data-testid="status-badge" tone="success">
  Active
</Badge>
```

## Future Enhancements

1. **Additional Variants**: Outline, text-only buttons
2. **More Sizes**: Extra small, large, extra large
3. **Icon Support**: Built-in icon positioning and sizing
4. **Loading States**: Spinner and disabled states
5. **Theme Support**: Dark/light mode variants
6. **Animation Options**: Different transition effects
7. **Group Support**: Button groups and toolbars
8. **Advanced Badges**: With icons, dismissible, interactive

## Dependencies

- React 18+
- TypeScript
- Tailwind CSS
- No external component libraries 