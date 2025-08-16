# ErrorBoundary Component

## Overview

The `ErrorBoundary` component is a React error boundary that catches JavaScript errors anywhere in the child component tree, logs those errors, and displays a fallback UI instead of the crashed component tree.

## Purpose

- **Catch rendering errors** and prevent the entire app from crashing
- **Show a friendly message** to users when something goes wrong
- **Provide recovery options** with a "Try again" button that reloads the route
- **Log errors** to the console for debugging purposes

## Features

- **Automatic error catching**: Catches JavaScript errors in child components
- **User-friendly fallback UI**: Displays a centered card with clear messaging
- **Retry functionality**: "Try again" button reloads the current route
- **Customizable fallback**: Optional custom fallback UI via props
- **Error logging**: Logs errors to console for development debugging

## Usage

### Basic Usage

```tsx
import { ErrorBoundary } from '../components/error-boundary';

function App() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

### With Custom Fallback

```tsx
import { ErrorBoundary } from '../components/error-boundary';

const CustomFallback = () => (
  <div>Custom error message</div>
);

function App() {
  return (
    <ErrorBoundary fallback={<CustomFallback />}>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

### Wrapping Page Routes

```tsx
import { ErrorBoundary } from '../components/error-boundary';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/students" element={<StudentsPage />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | Yes | - | The components to wrap with error boundary |
| `fallback` | `ReactNode` | No | - | Custom fallback UI to display on error |

## State

| Property | Type | Description |
|----------|------|-------------|
| `hasError` | `boolean` | Whether an error has been caught |
| `error` | `Error \| undefined` | The caught error object |

## Methods

| Method | Description |
|--------|-------------|
| `getDerivedStateFromError` | Static method that updates state when an error occurs |
| `componentDidCatch` | Lifecycle method that logs errors to console |
| `handleRetry` | Reloads the current route by refreshing the page |

## Default Fallback UI

The default fallback UI includes:
- **Error icon**: Red warning icon in a circular background
- **Error message**: "Something went wrong" heading
- **Description**: Helpful text explaining the situation
- **Retry button**: Primary button to reload the page

## Styling

The component uses Tailwind CSS classes for styling:
- **Layout**: Centered card with responsive design
- **Colors**: Slate color palette with red accent for errors
- **Typography**: Clear hierarchy with appropriate font weights
- **Spacing**: Consistent padding and margins
- **Shadows**: Subtle shadow for the error card

## Integration Points

- **Route wrapping**: Wrap each page route element with the boundary
- **No API coupling**: Pure React component with no external dependencies
- **Component composition**: Can be nested within other components
- **Fallback customization**: Supports custom error UI via props

## Error Handling

- **JavaScript errors**: Catches runtime errors in React components
- **Render errors**: Handles errors during component rendering
- **Lifecycle errors**: Catches errors in component lifecycle methods
- **Child component errors**: Propagates error boundaries up the tree

## Best Practices

1. **Wrap at route level**: Place error boundaries around major route sections
2. **Avoid over-wrapping**: Don't wrap every small component
3. **Custom fallbacks**: Use custom fallbacks for specific error scenarios
4. **Error logging**: Monitor console logs for production error tracking
5. **User experience**: Keep fallback UI simple and actionable

## Example Implementation

```tsx
// In your main App component
import { ErrorBoundary } from './components/error-boundary';

function App() {
  return (
    <ErrorBoundary>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/students" element={<StudentsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
```

## Demo

Use the `ErrorBoundaryDemo` component to see the error boundary in action:

```tsx
import { ErrorBoundaryDemo } from './components/error-boundary';

// In your demo page
<ErrorBoundaryDemo />
```

## Dependencies

- React (Class Component)
- Tailwind CSS for styling
- Button component from primitives 