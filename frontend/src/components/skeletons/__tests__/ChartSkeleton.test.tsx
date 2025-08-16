import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChartSkeleton } from '../ChartSkeleton';

describe('ChartSkeleton', () => {
  it('renders single skeleton by default', () => {
    render(<ChartSkeleton />);
    
    const skeletons = screen.getAllByTestId('chart-skeleton');
    expect(skeletons).toHaveLength(1);
  });

  it('renders multiple skeletons when count is specified', () => {
    render(<ChartSkeleton count={2} />);
    
    const skeletons = screen.getAllByTestId('chart-skeleton');
    expect(skeletons).toHaveLength(2);
  });

  it('applies custom className', () => {
    render(<ChartSkeleton className="bg-purple-100" />);
    
    const skeleton = screen.getByTestId('chart-skeleton');
    expect(skeleton).toHaveClass('bg-purple-100');
  });

  it('has correct base styling', () => {
    render(<ChartSkeleton />);
    
    const skeleton = screen.getByTestId('chart-skeleton');
    expect(skeleton).toHaveClass('h-48', 'bg-slate-100', 'animate-pulse');
  });

  it('renders with count 0', () => {
    render(<ChartSkeleton count={0} />);
    
    const skeletons = screen.queryAllByTestId('chart-skeleton');
    expect(skeletons).toHaveLength(0);
  });

  it('renders with negative count', () => {
    render(<ChartSkeleton count={-1} />);
    
    const skeletons = screen.queryAllByTestId('chart-skeleton');
    expect(skeletons).toHaveLength(0);
  });
}); 