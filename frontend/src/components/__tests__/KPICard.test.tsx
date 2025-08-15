import React from 'react';
import { render, screen } from '@testing-library/react';
import { KPICard } from '../KPICard';

describe('KPICard', () => {
  const defaultProps = {
    title: 'Test KPI',
    value: '100',
  };

  it('renders with basic props', () => {
    render(<KPICard {...defaultProps} />);
    
    expect(screen.getByTestId('kpi-title')).toHaveTextContent('Test KPI');
    expect(screen.getByTestId('kpi-value')).toHaveTextContent('100');
  });

  it('renders with icon', () => {
    const icon = <span data-testid="test-icon">📊</span>;
    render(<KPICard {...defaultProps} icon={icon} />);
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('renders with hint', () => {
    render(<KPICard {...defaultProps} hint="Test hint" />);
    
    expect(screen.getByText('Test hint')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(<KPICard {...defaultProps} state="loading" />);
    
    // Should show skeleton elements
    const skeletonElements = screen.getAllByRole('generic');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('renders error state', () => {
    render(<KPICard {...defaultProps} state="error" />);
    
    expect(screen.getByText('Error loading data')).toBeInTheDocument();
  });

  it('renders ready state by default', () => {
    render(<KPICard {...defaultProps} />);
    
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('has correct accessibility attributes', () => {
    render(<KPICard {...defaultProps} />);
    
    const card = screen.getByRole('region');
    expect(card).toHaveAttribute('aria-label', 'Summary card Test KPI');
  });

  it('applies custom className', () => {
    const { container } = render(
      <KPICard {...defaultProps} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
}); 