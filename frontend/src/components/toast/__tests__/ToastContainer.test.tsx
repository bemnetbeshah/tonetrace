import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ToastContainer } from '../ToastContainer';
import type { ToastMessage } from '../Toast';

describe('ToastContainer', () => {
  const mockToasts: ToastMessage[] = [
    {
      id: 'toast-1',
      message: 'First toast message',
      type: 'info'
    },
    {
      id: 'toast-2',
      message: 'Second toast message',
      type: 'success'
    },
    {
      id: 'toast-3',
      message: 'Third toast message',
      type: 'error'
    }
  ];

  const mockOnDismiss = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when no toasts are provided', () => {
    const { container } = render(<ToastContainer toasts={[]} onDismiss={mockOnDismiss} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('renders all toast messages', () => {
    render(<ToastContainer toasts={mockToasts} onDismiss={mockOnDismiss} />);
    
    expect(screen.getByText('First toast message')).toBeInTheDocument();
    expect(screen.getByText('Second toast message')).toBeInTheDocument();
    expect(screen.getByText('Third toast message')).toBeInTheDocument();
  });

  it('renders container with correct positioning classes', () => {
    render(<ToastContainer toasts={mockToasts} onDismiss={mockOnDismiss} />);
    
    const container = screen.getByTestId('toast-container');
    expect(container).toHaveClass(
      'fixed',
      'top-4',
      'right-4',
      'z-50',
      'space-y-3',
      'max-w-sm'
    );
  });

  it('renders correct number of toasts', () => {
    render(<ToastContainer toasts={mockToasts} onDismiss={mockOnDismiss} />);
    
    const toasts = screen.getAllByText(/toast message/);
    expect(toasts).toHaveLength(3);
  });

  it('renders toasts with correct test IDs', () => {
    render(<ToastContainer toasts={mockToasts} onDismiss={mockOnDismiss} />);
    
    expect(screen.getByTestId('toast-info')).toBeInTheDocument();
    expect(screen.getByTestId('toast-success')).toBeInTheDocument();
    expect(screen.getByTestId('toast-error')).toBeInTheDocument();
  });

  it('passes onDismiss to each toast', () => {
    render(<ToastContainer toasts={mockToasts} onDismiss={mockOnDismiss} />);
    
    // Each toast should have a dismiss button
    const dismissButtons = screen.getAllByTestId('toast-dismiss');
    expect(dismissButtons).toHaveLength(3);
  });

  it('renders single toast correctly', () => {
    const singleToast: ToastMessage[] = [mockToasts[0]];
    
    render(<ToastContainer toasts={singleToast} onDismiss={mockOnDismiss} />);
    
    expect(screen.getByText('First toast message')).toBeInTheDocument();
    expect(screen.queryByText('Second toast message')).not.toBeInTheDocument();
    expect(screen.queryByText('Third toast message')).not.toBeInTheDocument();
  });

  it('maintains toast order', () => {
    render(<ToastContainer toasts={mockToasts} onDismiss={mockOnDismiss} />);
    
    const container = screen.getByTestId('toast-container');
    const toastElements = container.children;
    
    expect(toastElements[0]).toHaveTextContent('First toast message');
    expect(toastElements[1]).toHaveTextContent('Second toast message');
    expect(toastElements[2]).toHaveTextContent('Third toast message');
  });
}); 