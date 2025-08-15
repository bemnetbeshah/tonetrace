# Trendline Chart Component

A modular, accessible line chart component for visualizing time series data like formality trends, sentiment analysis, and readability metrics over time.

## Features

- **Time Series Visualization**: Line chart optimized for chronological data
- **Three States**: Loading (skeleton), Empty (no data message), Ready (chart display)
- **Interactive Tooltips**: Hover to see exact date and value
- **Responsive Design**: Adapts to container width automatically
- **Accessibility**: Proper ARIA labels, roles, and test IDs
- **Customizable**: Height, label, and styling options

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `data` | `TrendlineDataPoint[]` | ✅ | - | Array of data points with date and value |
| `height` | `number` | ❌ | `192` | Chart height in pixels |
| `label` | `string` | ❌ | - | Optional label displayed above the chart |
| `loading` | `boolean` | ❌ | `false` | Shows loading skeleton when true |
| `className` | `string` | ❌ | `''` | Additional CSS classes |

## Data Structure

```typescript
interface TrendlineDataPoint {
  date: string;    // ISO date string (e.g., "2024-01-01")
  value: number;   // Numeric value for the metric
}
```

## States

### Loading State
- Shows grey block skeleton with animation
- Useful when fetching data from API
- Maintains specified height

### Empty State
- Displays "No data yet" message
- Centered in a muted container
- Helps users understand when no data is available

### Ready State
- Renders the line chart with data
- Interactive tooltips on hover
- Responsive to container width

## Usage Examples

### Basic Usage
```tsx
import { TrendlineChart } from './components';

const data = [
  { date: '2024-01-01', value: 0.65 },
  { date: '2024-01-08', value: 0.72 },
  { date: '2024-01-15', value: 0.68 }
];

<TrendlineChart data={data} />
```

### With Custom Height and Label
```tsx
<TrendlineChart
  data={data}
  height={300}
  label="Formality Trend Over Time"
/>
```

### Loading State
```tsx
<TrendlineChart
  data={data}
  loading={true}
/>
```

### Empty State
```tsx
<TrendlineChart data={[]} />
```

## Interactions

- **Hover Tooltip**: Shows date and value when hovering over data points
- **Responsive**: Automatically adjusts to container width
- **No Zoom**: Version 1 focuses on basic trend visualization

## Accessibility Features

- `role="img"` for screen readers
- `aria-label` with descriptive text for each state
- Proper test ID for testing frameworks
- Semantic HTML structure

## Test IDs

- `trendline-chart`: The main chart container

## Styling

Uses Tailwind CSS classes for consistent styling:
- Responsive container with proper borders
- Consistent color scheme following design tokens
- Smooth animations and transitions
- Professional chart appearance

## Integration Points

The component is designed to work with:
- **API Data**: Values fed by computed UI state from `api.history` or `api.profileHistory('formality')`
- **State Management**: Can be controlled by parent components or global state
- **Data Sources**: Compatible with any time series data format

## Chart Library

Built with **Recharts** for:
- Reliable chart rendering
- Responsive design
- Accessibility support
- Customizable styling
- Performance optimization

## Demo

Use the `TrendlineChartDemo` component to see all states and configurations in action, including:
- Different data types (formality, sentiment, readability)
- Loading state simulation
- Empty state examples
- Interactive controls

## Performance Considerations

- Efficient rendering with Recharts
- Responsive container prevents unnecessary re-renders
- Minimal DOM manipulation
- Optimized for frequent data updates 