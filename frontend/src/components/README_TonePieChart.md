# Tone Pie Chart Component

A modular, accessible pie chart component for visualizing tone distribution in writing analysis. Shows the breakdown of different tones with a right-side legend and interactive tooltips.

## Features

- **Pie Chart Visualization**: Shows tone distribution with custom color palette
- **Right Side Legend**: Colored dots with tone labels for easy identification
- **Interactive Tooltips**: Hover to see tone details and percentages
- **Empty State Handling**: Shows "No tone data" message when no data available
- **Accessibility**: Proper ARIA labels, roles, and test IDs
- **Responsive Design**: Adapts to container width automatically

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `data` | `ToneDataPoint[]` | ✅ | - | Array of tone data points with name and value |
| `className` | `string` | ❌ | `''` | Additional CSS classes |

## Data Structure

```typescript
interface ToneDataPoint {
  name: string;    // Tone name (e.g., "Formal", "Neutral", "Objective")
  value: number;   // Numeric value representing the tone frequency
}
```

## States

### With Data
- Renders pie chart with tone distribution
- Shows right-side legend with colored dots
- Interactive tooltips on hover
- Responsive to container size

### Empty State
- Displays "No tone data" message
- Centered in a muted container
- Maintains consistent height for layout stability

## Usage Examples

### Basic Usage
```tsx
import { TonePieChart } from './components';

const toneData = [
  { name: 'Formal', value: 45 },
  { name: 'Neutral', value: 30 },
  { name: 'Objective', value: 15 }
];

<TonePieChart data={toneData} />
```

### With Custom Styling
```tsx
<TonePieChart
  data={toneData}
  className="max-w-2xl mx-auto"
/>
```

### Empty State
```tsx
<TonePieChart data={[]} />
```

## Chart Features

### Color Palette
The component uses a predefined color palette that automatically cycles through:
- Primary purple (#6C5CE7)
- Light purple (#A78BFA)
- Success green (#10B981)
- Warning orange (#F59E0B)
- Danger red (#EF4444)
- Blue (#3B82F6)
- Violet (#8B5CF6)
- Cyan (#06B6D4)
- Lime (#84CC16)
- Orange (#F97316)

### Chart Configuration
- **Inner Radius**: 40px (creates a donut effect)
- **Outer Radius**: 80px (chart size)
- **Padding Angle**: 2px (separation between segments)
- **Responsive**: Automatically adapts to container width

## Interactions

- **Hover Tooltip**: Shows tone name, value, and percentage
- **Legend**: Clickable legend items (can be extended for interactivity)
- **Responsive**: Chart resizes with container

## Accessibility Features

- `role="img"` for screen readers
- `aria-label` with descriptive text for each state
- Proper test IDs for testing frameworks
- Semantic HTML structure
- Color contrast compliance

## Test IDs

- `tone-pie-chart`: The main chart container
- `tone-legend`: The legend section

## Styling

Uses Tailwind CSS classes for consistent styling:
- Responsive container with proper borders
- Consistent color scheme following design tokens
- Professional chart appearance
- Clean legend layout

## Integration Points

The component is designed to work with:
- **API Data**: Values from `api.profileHistory('tone')`
- **Analysis Results**: `toneDistribution` from latest analysis
- **State Management**: Can be controlled by parent components or global state
- **Data Sources**: Compatible with any tone analysis data format

## Chart Library

Built with **Recharts** for:
- Reliable pie chart rendering
- Responsive design
- Accessibility support
- Customizable styling
- Performance optimization

## Demo

Use the `TonePieChartDemo` component to see all features in action, including:
- Different tone datasets (academic, business, creative)
- Empty state demonstration
- Interactive dataset switching
- Data breakdown table
- Comprehensive documentation

## Performance Considerations

- Efficient rendering with Recharts
- Minimal DOM manipulation
- Optimized for frequent data updates
- Responsive container prevents unnecessary re-renders

## Use Cases

- **Writing Analysis**: Show tone distribution in analyzed text
- **Content Review**: Visualize tone balance in documents
- **Style Assessment**: Compare tone usage across different writing samples
- **Educational Tools**: Help students understand tone variety in writing 