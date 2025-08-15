# KPI Card Component

A modular, accessible summary tile component used across pages to display key performance indicators and metrics.

## Features

- **Three States**: Loading (skeleton), Error (error badge), Ready (normal display)
- **Flexible Layout**: Title top-left, icon top-right, value large below, hint at bottom
- **Accessibility**: Proper ARIA labels, roles, and test IDs
- **Responsive**: Adapts to different screen sizes
- **Interactive**: Hover effects and smooth transitions

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | ✅ | - | The title displayed at the top of the card |
| `value` | `string \| number \| ReactNode` | ✅ | - | The main value/metric to display |
| `icon` | `ReactNode` | ❌ | - | Optional icon displayed in the top-right |
| `hint` | `string` | ❌ | - | Optional small caption below the value |
| `state` | `'loading' \| 'error' \| 'ready'` | ❌ | `'ready'` | Current state of the card |
| `className` | `string` | ❌ | `''` | Additional CSS classes |

## States

### Loading State
- Shows skeleton bars with animation
- Useful when fetching data from API

### Error State
- Displays error badge
- Shows placeholder value
- Helps users understand when data failed to load

### Ready State
- Normal display of title, value, and hint
- Default state when component is working correctly

## Usage Examples

### Basic Usage
```tsx
import { KPICard } from './components';

<KPICard
  title="Total Students"
  value="1,247"
/>
```

### With Icon and Hint
```tsx
import { UserGroupIcon } from '@heroicons/react/24/outline';

<KPICard
  title="Total Students"
  value="1,247"
  icon={<UserGroupIcon className="w-5 h-5" />}
  hint="Active enrollments"
/>
```

### Loading State
```tsx
<KPICard
  title="Total Students"
  value="1,247"
  state="loading"
/>
```

### Error State
```tsx
<KPICard
  title="Total Students"
  value="1,247"
  state="error"
/>
```

## Integration Points

The component is designed to work with:
- **API Data**: Values fed by computed UI state from `api.history` or `api.performance`
- **State Management**: Can be controlled by parent components or global state
- **Icon Libraries**: Compatible with Heroicons, Lucide, or any React icon component

## Accessibility Features

- `role="region"` for screen readers
- `aria-label` with descriptive text
- Proper test IDs for testing frameworks
- Semantic HTML structure

## Test IDs

- `kpi-title`: The title element
- `kpi-value`: The main value/content area

## Styling

Uses Tailwind CSS classes for consistent styling:
- Responsive grid layout
- Hover effects and transitions
- Consistent spacing and typography
- Color scheme following design tokens

## Demo

Use the `KPICardDemo` component to see all states and configurations in action. 