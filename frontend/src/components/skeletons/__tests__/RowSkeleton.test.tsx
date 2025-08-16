import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RowSkeleton } from '../RowSkeleton';

describe('RowSkeleton', () => {
  it('renders single skeleton by default', () => {
    render(<RowSkeleton />);
    
    const skeletons = screen.getAllByTestId('row-skeleton');
    expect(skeletons).toHaveLength(1);
  });

  it('renders multiple skeletons when count is specified', () => {
    render(<RowSkeleton count={5} />);
    
    const skeletons = screen.getAllByTestId('row-skeleton');
    expect(skeletons).toHaveLength(5);
  });

  it('applies custom className', () => {
    render(<RowSkeleton className="bg-green-100" />);
    
    const skeleton = screen.getByTestId('row-skeleton');
    expect(skeleton).toHaveClass('bg-green-100');
  });

  it('has correct base styling', () => {
    render(<RowSkeleton />);
    
    const skeleton = screen.getByTestId('row-skeleton');
    expect(skeleton).toHaveClass('h-10', 'bg-slate-100', 'animate-pulse');
  });

  it('renders with count 0', () => {
    render(<RowSkeleton count={0} />);
    
    const skeletons = screen.queryAllByTestId('row-skeleton');
    expect(skeletons).toHaveLength(0);
  });

  it('renders with negative count', () => {
    render(<RowSkeleton count={-1} />);
    
    const skeletons = screen.queryAllByTestId('row-skeleton');
    expect(skeletons).toHaveLength(0);
  });
}); 