# Design System Tokens

This module provides a single source of design tokens for consistent styling across the ToneTrace application. All components should use these tokens to maintain visual consistency and make future restyling easier.

## Overview

The design system tokens are organized into several categories:
- **Colors**: Primary, surface, text, and semantic colors
- **Typography**: Heading and body text styles
- **Spacing**: Consistent spacing scale (0-32px)
- **Border Radius**: Rounded corner values
- **Shadows**: Box shadow definitions
- **Breakpoints**: Responsive design breakpoints

## File Structure

```
src/design-system/
├── tokens.ts          # Main TypeScript tokens object
├── tokens.css         # CSS custom properties
└── README.md          # This documentation
```

## Usage

### 1. TypeScript/JavaScript Usage

Import the tokens directly:

```typescript
import { tokens, getColor, getRadius } from './design-system/tokens';

// Access tokens directly
const primaryColor = tokens.colors.primary;
const cardRadius = tokens.radius.md;

// Use utility functions
const buttonColor = getColor('primary');
const borderRadius = getRadius('sm');
```

### 2. Tailwind CSS Usage

The tokens are automatically available as Tailwind classes:

```tsx
// Colors
<div className="bg-primary text-surface">Primary background</div>
<div className="bg-surface-alt border border-border">Alt surface with border</div>

// Typography
<h1 className="text-h1">Heading 1</h1>
<p className="text-body text-muted">Body text with muted color</p>

// Spacing
<div className="p-16 m-8">16px padding, 8px margin</div>

// Border radius
<div className="rounded-md">Medium border radius</div>

// Shadows
<div className="shadow-card">Card with shadow</div>
```

### 3. CSS Custom Properties

Use CSS custom properties in your stylesheets:

```css
.my-component {
  background-color: var(--color-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  padding: var(--spacing-16);
}
```

### 4. Inline Styles

Use tokens with inline styles:

```tsx
<div style={{ 
  backgroundColor: tokens.colors.primary,
  borderRadius: `${tokens.radius.md}px`,
  padding: `${tokens.spacing_scale[4]}px`
}}>
  Inline styled component
</div>
```

## Token Reference

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#6C5CE7` | Main brand color, primary buttons |
| `primarySoft` | `#A78BFA` | Hover states, secondary elements |
| `surface` | `#FFFFFF` | Main background, cards |
| `surfaceAlt` | `#F8FAFC` | Alternative backgrounds |
| `text` | `#0F172A` | Primary text color |
| `muted` | `#64748B` | Secondary text, labels |
| `border` | `#E2E8F0` | Borders, dividers |
| `sidebarBg` | `#0B1020` | Sidebar background |
| `sidebarHover` | `#11172B` | Sidebar hover states |
| `success` | `#10B981` | Success states, confirmations |
| `warning` | `#F59E0B` | Warning states, alerts |
| `danger` | `#EF4444` | Error states, destructive actions |

### Typography

| Token | Classes | Usage |
|-------|---------|-------|
| `h1` | `text-2xl font-semibold` | Page titles, main headings |
| `h2` | `text-xl font-semibold` | Section headings |
| `h3` | `text-lg font-semibold` | Subsection headings |
| `body` | `text-sm text-slate-700` | Body text, paragraphs |
| `muted` | `text-xs text-slate-500` | Captions, metadata |

### Spacing Scale

| Value | Usage |
|-------|-------|
| `0` | No spacing |
| `4` | Minimal spacing, tight layouts |
| `8` | Small spacing, component padding |
| `12` | Medium spacing, section margins |
| `16` | Standard spacing, card padding |
| `20` | Large spacing, section padding |
| `24` | Extra large spacing, major sections |
| `28` | Huge spacing, page margins |
| `32` | Maximum spacing, page sections |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | `8px` | Small elements, buttons |
| `md` | `12px` | Cards, panels |
| `lg` | `16px` | Large containers, modals |

### Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `card` | `0 8px 20px rgba(2,6,23,.06)` | Cards, elevated elements |

### Breakpoints

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | `640px` | Small devices |
| `md` | `768px` | Medium devices |
| `lg` | `1024px` | Large devices |
| `xl` | `1280px` | Extra large devices |

## Best Practices

### 1. Always Use Tokens

❌ **Don't** hardcode values:
```tsx
<div style={{ color: '#6C5CE7' }}>Hardcoded color</div>
```

✅ **Do** use tokens:
```tsx
<div className="text-primary">Token-based color</div>
```

### 2. Prefer Tailwind Classes

When possible, use Tailwind classes over inline styles:

```tsx
// Good
<div className="bg-primary text-surface p-16 rounded-md shadow-card">
  Content
</div>

// Less ideal
<div style={{ 
  backgroundColor: tokens.colors.primary,
  color: tokens.colors.surface,
  padding: `${tokens.spacing_scale[4]}px`,
  borderRadius: `${tokens.radius.md}px`,
  boxShadow: tokens.shadow.card
}}>
  Content
</div>
```

### 3. Use Semantic Colors

Choose colors based on their meaning, not just appearance:

```tsx
// Good - semantic meaning
<button className="bg-success">Save Changes</button>
<button className="bg-danger">Delete Item</button>

// Less ideal - arbitrary colors
<button className="bg-green-500">Save Changes</button>
<button className="bg-red-500">Delete Item</button>
```

### 4. Consistent Spacing

Use the spacing scale consistently:

```tsx
// Good - consistent spacing
<div className="p-16 mb-8">
  <h2 className="mb-4">Section Title</h2>
  <p className="mb-8">Content with consistent spacing</p>
</div>

// Less ideal - arbitrary spacing
<div className="p-20 mb-6">
  <h2 className="mb-3">Section Title</h2>
  <p className="mb-10">Content with inconsistent spacing</p>
</div>
```

## Adding New Tokens

To add new tokens:

1. **Add to `tokens.ts`**:
```typescript
export const tokens = {
  // ... existing tokens
  newCategory: {
    newToken: 'value'
  }
} as const;
```

2. **Add to `tokens.css`** (if needed):
```css
:root {
  /* ... existing properties */
  --new-category-new-token: value;
}
```

3. **Update Tailwind config** (if needed):
```javascript
theme: {
  extend: {
    newCategory: {
      newToken: 'value'
    }
  }
}
```

4. **Update this README** with documentation

## Examples

See `TokenDemo.tsx` for a comprehensive example of how to use all tokens in practice.

## Migration Guide

When migrating existing components to use tokens:

1. Replace hardcoded colors with token references
2. Update spacing values to use the spacing scale
3. Replace custom border-radius values with token values
4. Update typography classes to use token classes
5. Test visual consistency across the application

## Support

For questions about the design system or to suggest improvements, please refer to the project documentation or create an issue in the repository. 