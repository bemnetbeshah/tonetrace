# Skeleton Components

## Overview
A collection of consistent loading placeholder components that provide a better user experience while data is being fetched. These skeletons automatically show while `api.*` mock methods await the fake delay.

## Components

### CardSkeleton
**Purpose**: Loading placeholder for card components
**Size**: `h-28 rounded-xl bg-slate-100 animate-pulse`
**Use Case**: KPI cards, assignment cards, student cards

**Props**:
- `className?: string` - Additional CSS classes
- `count?: number` - Number of skeleton cards to render (default: 1)

**Example**:
```tsx
import { CardSkeleton } from './skeletons';

// Single card skeleton
<CardSkeleton />

// Multiple card skeletons
<CardSkeleton count={4} />

// Custom styling
<CardSkeleton className="bg-blue-100" />
```

### RowSkeleton
**Purpose**: Loading placeholder for table rows or list items
**Size**: `h-10 bg-slate-100 animate-pulse`
**Use Case**: Table rows, list items, form fields

**Props**:
- `className?: string` - Additional CSS classes
- `count?: number` - Number of skeleton rows to render (default: 1)

**Example**:
```tsx
import { RowSkeleton } from './skeletons';

// Single row skeleton
<RowSkeleton />

// Multiple row skeletons
<RowSkeleton count={5} />

// Table-like layout
<div className="space-y-2">
  <RowSkeleton count={4} className="rounded" />
</div>
```

### ChartSkeleton
**Purpose**: Loading placeholder for charts and graphs
**Size**: `h-48 bg-slate-100 animate-pulse`
**Use Case**: Trendline charts, pie charts, bar charts

**Props**:
- `className?: string` - Additional CSS classes
- `count?: number` - Number of skeleton charts to render (default: 1)

**Example**:
```tsx
import { ChartSkeleton } from './skeletons';

// Single chart skeleton
<ChartSkeleton />

// Multiple chart skeletons
<ChartSkeleton count={2} />

// Dashboard layout
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <ChartSkeleton className="rounded-lg" />
  <ChartSkeleton className="rounded-lg" />
  <ChartSkeleton className="rounded-lg" />
</div>
```

## Integration

### Automatic Loading States
The skeleton components are designed to work seamlessly with the existing API mock system:

```tsx
const [loading, setLoading] = useState(true);
const [data, setData] = useState(null);

useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);
      // This will show skeleton while waiting for the fake delay
      const result = await api.someMethod();
      setData(result);
    } finally {
      setLoading(false);
    }
  };
  
  loadData();
}, []);

if (loading) {
  return <CardSkeleton count={3} />;
}

return <ActualComponent data={data} />;
```

### Common Patterns

#### Dashboard Loading
```tsx
{loading ? (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <CardSkeleton count={4} />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ChartSkeleton />
      <ChartSkeleton />
    </div>
  </div>
) : (
  <DashboardContent data={data} />
)}
```

#### Table Loading
```tsx
{loading ? (
  <div className="space-y-2">
    <RowSkeleton count={10} />
  </div>
) : (
  <DataTable data={data} />
)}
```

#### Mixed Content Loading
```tsx
{loading ? (
  <div className="space-y-6">
    <CardSkeleton count={2} />
    <ChartSkeleton />
    <RowSkeleton count={5} />
  </div>
) : (
  <MixedContent data={data} />
)}
```

## Styling

### Base Classes
All skeleton components use consistent base styling:
- `bg-slate-100` - Light gray background
- `animate-pulse` - Smooth pulsing animation
- Responsive sizing based on component type

### Customization
Skeletons can be customized using the `className` prop:

```tsx
// Different background colors
<CardSkeleton className="bg-blue-100" />
<CardSkeleton className="bg-green-100" />

// Additional styling
<RowSkeleton className="bg-gray-200 rounded-lg" />
<ChartSkeleton className="bg-slate-200 border border-gray-300" />
```

### Animation
The `animate-pulse` class provides a subtle, professional loading animation that:
- Runs continuously while the skeleton is visible
- Automatically stops when the component unmounts
- Provides visual feedback that content is loading

## Best Practices

### 1. Match Content Structure
Ensure skeleton layouts closely match the actual content structure:
```tsx
// Good: Skeleton matches actual layout
{loading ? (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <CardSkeleton count={3} />
  </div>
) : (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {cards.map(card => <Card key={card.id} {...card} />)}
  </div>
)}
```

### 2. Appropriate Counts
Use realistic counts that match expected data:
```tsx
// Good: Shows reasonable number of skeletons
<RowSkeleton count={5} />

// Avoid: Too many or too few
<RowSkeleton count={50} /> // Too many
<RowSkeleton count={1} />  // Too few for table
```

### 3. Consistent Spacing
Maintain consistent spacing between skeleton and actual content:
```tsx
// Good: Same spacing structure
<div className="space-y-4">
  {loading ? <CardSkeleton count={3} /> : <CardList cards={cards} />}
</div>
```

### 4. Accessibility
Skeletons are automatically accessible:
- No text content that screen readers need to announce
- Visual loading indication for all users
- Smooth animations that respect user preferences

## Demo Components

### Individual Demos
- `CardSkeletonDemo` - Showcases card skeleton variants
- `RowSkeletonDemo` - Demonstrates row skeleton usage
- `ChartSkeletonDemo` - Examples of chart skeleton layouts

### Comprehensive Demo
- `SkeletonsDemo` - Complete showcase of all skeleton components
- Combined layout examples
- Usage instructions and best practices

## Testing

All skeleton components include test IDs for easy testing:
- `data-testid="card-skeleton"`
- `data-testid="row-skeleton"`
- `data-testid="chart-skeleton"`

Example test:
```tsx
it('shows skeleton while loading', () => {
  render(<Component loading={true} />);
  expect(screen.getByTestId('card-skeleton')).toBeInTheDocument();
});
```

## Future Enhancements

1. **Content-Aware Skeletons**: Skeletons that adapt to content type
2. **Progressive Loading**: Staggered skeleton animations
3. **Custom Shapes**: More specific skeleton shapes for different content types
4. **Theme Support**: Dark/light mode skeleton variants
5. **Performance**: Optimized animations for better performance 