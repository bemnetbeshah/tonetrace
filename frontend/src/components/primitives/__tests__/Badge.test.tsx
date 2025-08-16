import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('renders with default props', () => {
    render(<Badge>Default Badge</Badge>);
    
    const badge = screen.getByText('Default Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-slate-100', 'text-slate-700');
  });

  it('renders with success tone', () => {
    render(<Badge tone="success">Success Badge</Badge>);
    
    const badge = screen.getByText('Success Badge');
    expect(badge).toHaveClass('bg-emerald-100', 'text-emerald-800');
  });

  it('renders with warning tone', () => {
    render(<Badge tone="warning">Warning Badge</Badge>);
    
    const badge = screen.getByText('Warning Badge');
    expect(badge).toHaveClass('bg-amber-100', 'text-amber-800');
  });

  it('renders with danger tone', () => {
    render(<Badge tone="danger">Danger Badge</Badge>);
    
    const badge = screen.getByText('Danger Badge');
    expect(badge).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('renders with muted tone', () => {
    render(<Badge tone="muted">Muted Badge</Badge>);
    
    const badge = screen.getByText('Muted Badge');
    expect(badge).toHaveClass('bg-slate-100', 'text-slate-700');
  });

  it('renders with custom className', () => {
    render(<Badge className="custom-class">Custom Badge</Badge>);
    
    const badge = screen.getByText('Custom Badge');
    expect(badge).toHaveClass('custom-class');
  });

  it('has correct base styling', () => {
    render(<Badge>Styled Badge</Badge>);
    
    const badge = screen.getByText('Styled Badge');
    expect(badge).toHaveClass(
      'inline-flex',
      'items-center',
      'px-2.5',
      'py-0.5',
      'rounded-full',
      'text-xs',
      'font-medium'
    );
  });

  it('renders as span element', () => {
    render(<Badge>Span Badge</Badge>);
    
    const badge = screen.getByText('Span Badge');
    expect(badge.tagName).toBe('SPAN');
  });

  it('renders with string children', () => {
    render(<Badge>String Content</Badge>);
    
    const badge = screen.getByText('String Content');
    expect(badge).toBeInTheDocument();
  });

  it('combines custom className with default classes', () => {
    render(<Badge tone="success" className="border border-emerald-300">Bordered Badge</Badge>);
    
    const badge = screen.getByText('Bordered Badge');
    expect(badge).toHaveClass('bg-emerald-100', 'text-emerald-800', 'border', 'border-emerald-300');
  });

  it('renders multiple badges with different tones', () => {
    render(
      <div>
        <Badge tone="success">Success</Badge>
        <Badge tone="warning">Warning</Badge>
        <Badge tone="danger">Danger</Badge>
      </div>
    );
    
    expect(screen.getByText('Success')).toHaveClass('bg-emerald-100', 'text-emerald-800');
    expect(screen.getByText('Warning')).toHaveClass('bg-amber-100', 'text-amber-800');
    expect(screen.getByText('Danger')).toHaveClass('bg-red-100', 'text-red-800');
  });
}); 