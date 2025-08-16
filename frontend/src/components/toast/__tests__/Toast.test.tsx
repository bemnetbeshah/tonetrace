import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Toast } from '../Toast';
import type { ToastMessage } from '../Toast';

describe('Toast', () => {
  const mockToast: ToastMessage = {
    id: 'test-1',
    message: 'Test message',
    type: 'info',
    duration: 5000
  };

  const mockOnDismiss = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders toast message correctly', () => {
    render(<Toast toast={mockToast} onDismiss={mockOnDismiss} />);
    
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('renders info toast with correct styling', () => {
    render(<Toast toast={mockToast} onDismiss={mockOnDismiss} />);
    
    const toast = screen.getByTestId('toast-info');
    expect(toast).toHaveClass('bg-blue-50', 'border-blue-200', 'text-blue-800');
  });

  it('renders success toast with correct styling', () => {
    const successToast: ToastMessage = { ...mockToast, type: 'success' };
    render(<Toast toast={successToast} onDismiss={mockOnDismiss} />);
    
    const toast = screen.getByTestId('toast-success');
    expect(toast).toHaveClass('bg-emerald-50', 'border-emerald-200', 'text-emerald-800');
  });

  it('renders error toast with correct styling', () => {
    const errorToast: ToastMessage = { ...mockToast, type: 'error' };
    render(<Toast toast={errorToast} onDismiss={mockOnDismiss} />);
    
    const toast = screen.getByTestId('toast-error');
    expect(toast).toHaveClass('bg-red-50', 'border-red-200', 'text-red-800');
  });

  it('calls onDismiss when dismiss button is clicked', () => {
    render(<Toast toast={mockToast} onDismiss={mockOnDismiss} />);
    
    const dismissButton = screen.getByTestId('toast-dismiss');
    fireEvent.click(dismissButton);
    
    expect(mockOnDismiss).toHaveBeenCalledWith('test-1');
  });

  it('auto-dismisses after specified duration', () => {
    render(<Toast toast={mockToast} onDismiss={mockOnDismiss} />);
    
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    expect(mockOnDismiss).toHaveBeenCalledWith('test-1');
  });

  it('auto-dismisses after default duration when not specified', () => {
    const toastWithoutDuration: ToastMessage = { ...mockToast, duration: undefined };
    render(<Toast toast={toastWithoutDuration} onDismiss={mockOnDismiss} />);
    
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    expect(mockOnDismiss).toHaveBeenCalledWith('test-1');
  });

  it('cleans up timer on unmount', () => {
    const { unmount } = render(<Toast toast={mockToast} onDismiss={mockOnDismiss} />);
    
    unmount();
    
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    expect(mockOnDismiss).not.toHaveBeenCalled();
  });

  it('has correct base styling classes', () => {
    render(<Toast toast={mockToast} onDismiss={mockOnDismiss} />);
    
    const toast = screen.getByTestId('toast-info');
    expect(toast).toHaveClass(
      'flex',
      'items-start',
      'p-4',
      'border',
      'rounded-lg',
      'shadow-lg',
      'max-w-sm',
      'w-full',
      'transition-all',
      'duration-300',
      'ease-in-out'
    );
  });

  it('displays the correct icon for each type', () => {
    const { rerender } = render(<Toast toast={mockToast} onDismiss={mockOnDismiss} />);
    
    // Info toast should have info icon
    expect(screen.getByTestId('toast-info')).toBeInTheDocument();
    
    // Success toast should have success icon
    const successToast: ToastMessage = { ...mockToast, type: 'success' };
    rerender(<Toast toast={successToast} onDismiss={mockOnDismiss} />);
    expect(screen.getByTestId('toast-success')).toBeInTheDocument();
    
    // Error toast should have error icon
    const errorToast: ToastMessage = { ...mockToast, type: 'error' };
    rerender(<Toast toast={errorToast} onDismiss={mockOnDismiss} />);
    expect(screen.getByTestId('toast-error')).toBeInTheDocument();
  });
}); 