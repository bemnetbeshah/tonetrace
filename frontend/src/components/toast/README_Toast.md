# Toast Notification System

## Overview
A non-blocking feedback system for user actions that displays messages in the top-right corner with auto-dismiss functionality. Perfect for showing success, error, and info messages without interrupting the user workflow.

## Components

### Toast
**Purpose**: Individual toast message component
**Features**: Auto-dismiss, manual dismiss, type-based styling

**Props**:
- `toast: ToastMessage` - Toast message object
- `onDismiss: (id: string) => void` - Dismiss handler

**Types**:
- `info` - Blue styling for general information
- `success` - Green styling for successful operations
- `error` - Red styling for errors and failures

### ToastContainer
**Purpose**: Container that manages multiple toast messages
**Features**: Fixed positioning, stacking, responsive layout

**Props**:
- `toasts: ToastMessage[]` - Array of toast messages
- `onDismiss: (id: string) => void` - Dismiss handler

**Positioning**: Fixed top-right corner with z-index 50

### ToastProvider & useToast Hook
**Purpose**: Context provider and hook for managing toast state
**Features**: Global toast management, easy integration

**API**:
- `showToast(message: string, type: 'info' | 'success' | 'error')` - Display a new toast
- `dismiss(id: string)` - Remove a specific toast
- `toasts: ToastMessage[]` - Current toast messages

## Usage

### Basic Setup
Wrap your app with the ToastProvider:

```tsx
import { ToastProvider } from './components/toast';

function App() {
  return (
    <ToastProvider>
      <YourAppContent />
    </ToastProvider>
  );
}
```

### Using Toasts
Use the `useToast` hook in any component:

```tsx
import { useToast } from './components/toast';

const MyComponent = () => {
  const { showToast } = useToast();
  
  const handleSuccess = () => {
    showToast('Operation completed!', 'success');
  };
  
  const handleError = () => {
    showToast('Something went wrong', 'error');
  };
  
  const handleInfo = () => {
    showToast('Processing your request...', 'info');
  };
  
  return (
    <div>
      <button onClick={handleSuccess}>Success Action</button>
      <button onClick={handleError}>Error Action</button>
      <button onClick={handleInfo}>Info Action</button>
    </div>
  );
};
```

### ToastContainer Integration
Add the ToastContainer to your layout:

```tsx
import { ToastContainer, useToast } from './components/toast';

const Layout = () => {
  const { toasts, dismiss } = useToast();
  
  return (
    <div>
      <YourLayoutContent />
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
};
```

## Toast Message Interface

```tsx
interface ToastMessage {
  id: string;           // Unique identifier
  message: string;      // Display text
  type: 'info' | 'success' | 'error';  // Toast type
  duration?: number;    // Auto-dismiss delay (default: 5000ms)
}
```

## Styling

### Type-based Colors
- **Info**: Blue theme (`bg-blue-50 border-blue-200 text-blue-800`)
- **Success**: Green theme (`bg-emerald-50 border-emerald-200 text-emerald-800`)
- **Error**: Red theme (`bg-red-50 border-red-200 text-red-800`)

### Layout
- **Position**: Fixed top-right corner
- **Spacing**: 16px from top and right edges
- **Stacking**: Vertical stacking with 12px gaps
- **Width**: Maximum 384px (max-w-sm)
- **Shadow**: Large shadow for prominence

### Animations
- **Entry**: Smooth slide-in with opacity transition
- **Exit**: Fade out with scale reduction
- **Duration**: 300ms transitions for smooth UX

## Integration Points

### Assignments Run Analysis
Perfect for the mocked analysis functionality:

```tsx
const handleAnalyzeClick = async (id: string) => {
  try {
    showToast('Starting analysis...', 'info');
    
    // Simulate analysis process
    await new Promise(resolve => setTimeout(resolve, 1000));
    showToast('Analysis in progress...', 'info');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    showToast('Analysis completed successfully!', 'success');
    
  } catch (error) {
    showToast('Analysis failed. Please try again.', 'error');
  }
};
```

### Future POST Handlers
Ready for real API integration:

```tsx
const handleSubmit = async (data: FormData) => {
  try {
    showToast('Submitting form...', 'info');
    
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: data
    });
    
    if (response.ok) {
      showToast('Form submitted successfully!', 'success');
    } else {
      showToast('Submission failed. Please try again.', 'error');
    }
    
  } catch (error) {
    showToast('Network error. Please check your connection.', 'error');
  }
};
```

## Best Practices

### 1. Toast Timing
- **Info**: 3-5 seconds for general information
- **Success**: 3-4 seconds for completed actions
- **Error**: 5-7 seconds for error messages (users need time to read)

### 2. Message Content
- Keep messages concise and actionable
- Use present tense for ongoing actions
- Use past tense for completed actions
- Include specific details when helpful

### 3. Toast Frequency
- Don't overwhelm users with too many toasts
- Use appropriate types for the context
- Consider grouping related messages

### 4. Accessibility
- Toasts are positioned to not interfere with main content
- High contrast colors for readability
- Clear dismiss buttons for manual control
- Screen reader friendly content

## Examples

### Form Submission Flow
```tsx
const handleFormSubmit = async () => {
  showToast('Validating form...', 'info');
  
  if (!isValid) {
    showToast('Please fix validation errors', 'error');
    return;
  }
  
  showToast('Submitting form...', 'info');
  
  try {
    await submitForm();
    showToast('Form submitted successfully!', 'success');
  } catch (error) {
    showToast('Submission failed. Please try again.', 'error');
  }
};
```

### File Upload Progress
```tsx
const handleFileUpload = async (file: File) => {
  showToast('Starting upload...', 'info');
  
  const interval = setInterval(() => {
    showToast('Upload in progress...', 'info');
  }, 2000);
  
  try {
    await uploadFile(file);
    clearInterval(interval);
    showToast('File uploaded successfully!', 'success');
  } catch (error) {
    clearInterval(interval);
    showToast('Upload failed. Please try again.', 'error');
  }
};
```

### Analysis Workflow
```tsx
const handleAnalysis = async () => {
  showToast('Initializing analysis...', 'info');
  
  setTimeout(() => {
    showToast('Processing data...', 'info');
  }, 1000);
  
  setTimeout(() => {
    showToast('Generating results...', 'info');
  }, 3000);
  
  try {
    const results = await performAnalysis();
    showToast('Analysis completed successfully!', 'success');
    return results;
  } catch (error) {
    showToast('Analysis failed. Please try again.', 'error');
    throw error;
  }
};
```

## Testing

### Test IDs
All components include test IDs for easy testing:

```tsx
// Toast container
<div data-testid="toast-container">

// Individual toasts
<div data-testid="toast-info">
<div data-testid="toast-success">
<div data-testid="toast-error">

// Dismiss button
<button data-testid="toast-dismiss">
```

### Example Tests
```tsx
it('shows toast when showToast is called', () => {
  const { result } = renderHook(() => useToast(), {
    wrapper: ToastProvider
  });
  
  act(() => {
    result.current.showToast('Test message', 'success');
  });
  
  expect(result.current.toasts).toHaveLength(1);
  expect(result.current.toasts[0].message).toBe('Test message');
  expect(result.current.toasts[0].type).toBe('success');
});
```

## Future Enhancements

1. **Custom Durations**: Per-toast duration configuration
2. **Toast Actions**: Clickable toasts with action buttons
3. **Progress Indicators**: Progress bars for long-running operations
4. **Toast Queuing**: Smart queuing for high-frequency updates
5. **Sound Notifications**: Optional audio feedback
6. **Toast History**: Persistent toast log for debugging
7. **Custom Positioning**: Configurable toast positions
8. **Rich Content**: Support for HTML content and images
9. **Toast Groups**: Grouping related toasts
10. **Animation Variants**: Different entry/exit animations

## Dependencies

- React 18+ with hooks
- TypeScript
- Tailwind CSS
- Heroicons (for close button)
- No external toast libraries 