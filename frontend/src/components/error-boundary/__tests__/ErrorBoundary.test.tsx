import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';

// Mock console.error to avoid noise in tests
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

// Component that throws an error
const ThrowError: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Component that throws an error during render
const ThrowErrorInRender: React.FC = () => {
  throw new Error('Render error');
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders fallback UI when child throws an error', () => {
    render(
      <ErrorBoundary>
        <ThrowErrorInRender />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('We encountered an unexpected error. Please try again.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    const CustomFallback = () => <div>Custom error message</div>;

    render(
      <ErrorBoundary fallback={<CustomFallback />}>
        <ThrowErrorInRender />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('calls window.location.reload when retry button is clicked', () => {
    const reloadMock = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <ThrowErrorInRender />
      </ErrorBoundary>
    );

    const retryButton = screen.getByRole('button', { name: 'Try again' });
    fireEvent.click(retryButton);

    expect(reloadMock).toHaveBeenCalled();
  });

  it('logs error to console when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowErrorInRender />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalledWith(
      'ErrorBoundary caught an error:',
      expect.any(Error),
      expect.any(Object)
    );
  });

  it('maintains error state after error occurs', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    // Initially no error
    expect(screen.getByText('No error')).toBeInTheDocument();

    // Trigger error
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Should show error UI
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders error icon and styling correctly', () => {
    render(
      <ErrorBoundary>
        <ThrowErrorInRender />
      </ErrorBoundary>
    );

    // Check for error icon (SVG)
    const errorIcon = document.querySelector('svg');
    expect(errorIcon).toBeInTheDocument();

    // Check for error card styling
    const errorCard = screen.getByText('Something went wrong').closest('div');
    expect(errorCard).toHaveClass('bg-white', 'rounded-lg', 'shadow-lg');
  });

  it('handles multiple error boundaries correctly', () => {
    render(
      <ErrorBoundary>
        <div>Outer content</div>
        <ErrorBoundary>
          <ThrowErrorInRender />
        </ErrorBoundary>
      </ErrorBoundary>
    );

    // Outer boundary should still work
    expect(screen.getByText('Outer content')).toBeInTheDocument();
    
    // Inner boundary should catch the error
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
}); 