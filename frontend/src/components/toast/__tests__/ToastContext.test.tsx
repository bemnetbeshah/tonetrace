import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { ToastProvider, useToast } from '../ToastContext';

describe('ToastContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ToastProvider>{children}</ToastProvider>
  );

  it('provides initial empty toasts array', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    
    expect(result.current.toasts).toEqual([]);
  });

  it('provides showToast function', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    
    expect(typeof result.current.showToast).toBe('function');
  });

  it('provides dismiss function', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    
    expect(typeof result.current.dismiss).toBe('function');
  });

  it('adds toast when showToast is called', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    
    act(() => {
      result.current.showToast('Test message', 'success');
    });
    
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]).toMatchObject({
      message: 'Test message',
      type: 'success',
      duration: 5000
    });
    expect(result.current.toasts[0].id).toBeDefined();
  });

  it('adds multiple toasts when showToast is called multiple times', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    
    act(() => {
      result.current.showToast('First message', 'info');
      result.current.showToast('Second message', 'error');
      result.current.showToast('Third message', 'success');
    });
    
    expect(result.current.toasts).toHaveLength(3);
    expect(result.current.toasts[0].message).toBe('First message');
    expect(result.current.toasts[1].message).toBe('Second message');
    expect(result.current.toasts[2].message).toBe('Third message');
  });

  it('removes toast when dismiss is called', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    
    act(() => {
      result.current.showToast('Test message', 'info');
    });
    
    const toastId = result.current.toasts[0].id;
    
    act(() => {
      result.current.dismiss(toastId);
    });
    
    expect(result.current.toasts).toHaveLength(0);
  });

  it('removes specific toast when dismiss is called with id', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    
    act(() => {
      result.current.showToast('First message', 'info');
      result.current.showToast('Second message', 'success');
      result.current.showToast('Third message', 'error');
    });
    
    const secondToastId = result.current.toasts[1].id;
    
    act(() => {
      result.current.dismiss(secondToastId);
    });
    
    expect(result.current.toasts).toHaveLength(2);
    expect(result.current.toasts[0].message).toBe('First message');
    expect(result.current.toasts[1].message).toBe('Third message');
  });

  it('generates unique ids for each toast', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    
    act(() => {
      result.current.showToast('First message', 'info');
      result.current.showToast('Second message', 'success');
    });
    
    const ids = result.current.toasts.map(toast => toast.id);
    expect(ids[0]).not.toBe(ids[1]);
  });

  it('sets correct default duration', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    
    act(() => {
      result.current.showToast('Test message', 'info');
    });
    
    expect(result.current.toasts[0].duration).toBe(5000);
  });

  it('handles all toast types correctly', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    
    act(() => {
      result.current.showToast('Info message', 'info');
      result.current.showToast('Success message', 'success');
      result.current.showToast('Error message', 'error');
    });
    
    expect(result.current.toasts).toHaveLength(3);
    expect(result.current.toasts[0].type).toBe('info');
    expect(result.current.toasts[1].type).toBe('success');
    expect(result.current.toasts[2].type).toBe('error');
  });

  it('throws error when useToast is used outside provider', () => {
    expect(() => {
      renderHook(() => useToast());
    }).toThrow('useToast must be used within a ToastProvider');
  });

  it('maintains toast order when adding and removing', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    
    act(() => {
      result.current.showToast('First message', 'info');
      result.current.showToast('Second message', 'success');
      result.current.showToast('Third message', 'error');
    });
    
    // Remove middle toast
    const secondToastId = result.current.toasts[1].id;
    act(() => {
      result.current.dismiss(secondToastId);
    });
    
    // Add new toast
    act(() => {
      result.current.showToast('Fourth message', 'info');
    });
    
    expect(result.current.toasts).toHaveLength(3);
    expect(result.current.toasts[0].message).toBe('First message');
    expect(result.current.toasts[1].message).toBe('Third message');
    expect(result.current.toasts[2].message).toBe('Fourth message');
  });
}); 