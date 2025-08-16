import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CardSkeleton } from '../CardSkeleton';

describe('CardSkeleton', () => {
  it('renders single skeleton by default', () => {
    render(<CardSkeleton />);
    
    const skeletons = screen.getAllByTestId('card-skeleton');
    expect(skeletons).toHaveLength(1);
  });

  it('renders multiple skeletons when count is specified', () => {
    render(<CardSkeleton count={3} />);
    
    const skeletons = screen.getAllByTestId('card-skeleton');
    expect(skeletons).toHaveLength(3);
  });

  it('applies custom className', () => {
    render(<CardSkeleton className="bg-blue-100" />);
    
    const skeleton = screen.getByTestId('card-skeleton');
    expect(skeleton).toHaveClass('bg-blue-100');
  });

  it('has correct base styling', () => {
    render(<CardSkeleton />);
    
    const skeleton = screen.getByTestId('card-skeleton');
    expect(skeleton).toHaveClass('h-28', 'rounded-xl', 'bg-slate-100', 'animate-pulse');
  });

  it('renders with count 0', () => {
    render(<CardSkeleton count={0} />);
    
    const skeletons = screen.queryAllByTestId('card-skeleton');
    expect(skeletons).toHaveLength(0);
  });

  it('renders with negative count', () => {
    render(<CardSkeleton count={-1} />);
    
    const skeletons = screen.queryAllByTestId('card-skeleton');
    expect(skeletons).toHaveLength(0);
  });
}); 