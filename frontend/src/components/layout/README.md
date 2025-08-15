# Root Layout Module

The **02_root_layout** module provides a responsive layout framework with a left sidebar, top header, and content area that wraps all pages in the ToneTrace application.

## Overview

This module implements a modern, accessible layout pattern that:
- Uses CSS Grid for responsive layout management
- Provides a collapsible sidebar for navigation
- Includes a top header with search and user controls
- Automatically adapts to different screen sizes
- Follows accessibility best practices

## Components

### RootLayout
The main layout wrapper that orchestrates the entire layout structure.

**Props:**
- None (manages internal state)

**Features:**
- Responsive grid layout
- Sidebar collapse/expand functionality
- Mobile overlay for small screens
- Proper ARIA landmarks and roles

### SidebarNav
Navigation sidebar with collapsible behavior and navigation links.

**Props:**
- `collapsed: boolean` - Controls sidebar collapsed state
- `onToggleSidebar: () => void` - Callback to toggle sidebar

**Features:**
- Collapsible navigation with icons and labels
- Current page highlighting
- User profile section at bottom
- Smooth transitions and hover effects

### TopHeader
Top header bar with search functionality and user controls.

**Props:**
- `onToggleSidebar: () => void` - Callback to toggle sidebar (mobile)
- `onSearchSubmit: (query: string) => void` - Search submission handler

**Features:**
- Responsive search bar (hidden on mobile)
- Notification indicator
- User profile dropdown menu
- Mobile menu toggle button

### OutletRouter
Content area placeholder that will eventually handle routing.

**Props:**
- None

**Features:**
- Demo dashboard content
- Responsive grid layouts
- Interactive elements
- Uses design system tokens

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│                    TopHeader                            │
├─────────────┬───────────────────────────────────────────┤
│             │                                           │
│ SidebarNav  │              Content Area                 │
│             │                                           │
│             │                                           │
│             │                                           │
│             │                                           │
└─────────────┴───────────────────────────────────────────┘
```

## Responsive Behavior

### Desktop (≥ md breakpoint)
- **Grid Layout**: `grid-cols-[240px_1fr]`
- **Sidebar**: Fixed 240px width, always visible
- **Header**: Full width with search bar
- **Content**: Fills remaining space

### Mobile (< md breakpoint)
- **Grid Layout**: `grid-cols-[1fr]`
- **Sidebar**: Fixed panel off-canvas, toggled by hamburger menu
- **Header**: Mobile menu button, search hidden
- **Content**: Full width
- **Overlay**: Dark overlay when sidebar is open

## Accessibility Features

### ARIA Landmarks
- `<aside>` with `aria-label="Navigation"`
- `<header>` with `role="banner"`
- `<main>` with `role="main"`
- `<nav>` for navigation elements

### Keyboard Navigation
- **Tab Order**: Sidebar links → Search → Profile menu → Main content
- **Escape Key**: Closes user dropdown menu
- **Enter Key**: Activates buttons and links
- **Arrow Keys**: Navigate dropdown menus

### Screen Reader Support
- Proper heading hierarchy (h1, h2, h3)
- Descriptive button labels
- Current page indicators
- Status messages for dynamic content

## State Management

### Sidebar State
```typescript
const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
```

**Behavior:**
- **Default**: `false` (expanded)
- **Desktop**: User can toggle manually
- **Mobile**: Auto-collapses, shows as overlay

### Events
- `onToggleSidebar`: Toggles sidebar collapsed state
- `onSearchSubmit`: Handles search form submission (client-side navigation)

## CSS Classes

### Layout Wrapper
```css
min-h-screen grid bg-surfaceAlt
```

### Sidebar
```css
bg-sidebar text-white p-4
```

### Header
```css
h-16 bg-white shadow flex items-center justify-between px-6
```

### Content
```css
p-6
```

## Usage Examples

### Basic Implementation
```tsx
import { RootLayout } from '@/components/layout';

function App() {
  return (
    <RootLayout>
      {/* Your page content will go here */}
    </RootLayout>
  );
}
```

### Customizing the Layout
```tsx
// You can modify the layout by editing the components
// or extending them with additional props as needed
```

## Testing

### Test IDs
- `root-layout` - Main layout wrapper
- `layout-sidebar` - Sidebar navigation
- `layout-header` - Top header
- `layout-content` - Main content area
- `sidebar-toggle` - Sidebar toggle button
- `mobile-menu-toggle` - Mobile menu button

### Testing Considerations
- Test responsive behavior at different breakpoints
- Verify keyboard navigation works correctly
- Check screen reader compatibility
- Test sidebar collapse/expand functionality
- Verify mobile overlay behavior

## Future Enhancements

### Planned Features
- **Routing Integration**: Replace OutletRouter with actual router
- **Theme Switching**: Dark/light mode support
- **Breadcrumbs**: Dynamic breadcrumb navigation
- **Search API**: Backend search integration
- **User Authentication**: Real user management
- **Notifications**: Real-time notification system

### Customization Points
- **Sidebar Width**: Configurable sidebar width
- **Header Height**: Adjustable header height
- **Color Schemes**: Additional theme options
- **Layout Variants**: Different layout patterns
- **Animation Timing**: Customizable transitions

## Dependencies

- **React**: Core component library
- **Heroicons**: Icon library for navigation and UI elements
- **Tailwind CSS**: Utility-first CSS framework
- **Design System Tokens**: Custom design tokens for consistency

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **CSS Grid**: Full support for layout system
- **CSS Custom Properties**: Used for theming
- **ES6+ Features**: Modern JavaScript features

## Performance Considerations

- **Lazy Loading**: Components are loaded on demand
- **CSS Transitions**: Hardware-accelerated animations
- **Minimal Re-renders**: Optimized state management
- **Responsive Images**: Optimized for different screen sizes

## Troubleshooting

### Common Issues

1. **Sidebar not collapsing on mobile**
   - Check CSS breakpoint definitions
   - Verify Tailwind CSS is properly configured

2. **Layout breaking on small screens**
   - Ensure responsive classes are applied
   - Check for conflicting CSS rules

3. **Accessibility issues**
   - Verify ARIA attributes are present
   - Test with screen readers
   - Check keyboard navigation

### Debug Mode
Enable debug logging by setting environment variable:
```bash
VITE_DEBUG_LAYOUT=true
```

## Contributing

When modifying the layout:

1. **Maintain Responsiveness**: Test on all breakpoints
2. **Preserve Accessibility**: Keep ARIA attributes and keyboard support
3. **Follow Design System**: Use established tokens and patterns
4. **Update Tests**: Ensure all test IDs are maintained
5. **Document Changes**: Update this README as needed

## Related Documentation

- [Design System Tokens](../design-system/README.md)
- [Tailwind CSS Configuration](../../tailwind.config.js)
- [Component Guidelines](../../README.md) 