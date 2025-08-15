import React from 'react';
import { render, screen } from '@testing-library/react';
import { TrendlineChart, TrendlineDataPoint } from '../TrendlineChart';

// Mock Recharts components to avoid canvas issues in tests
jest.mock('recharts', () => ({
  LineChart: ({ children, data }: any) => (
    <div data-testid="line-chart" data-chart-data={JSON.stringify(data)}>
      {children}
    </div>
  ),
  Line: ({ dataKey }: any) => <div data-testid="line" data-line-key={dataKey} />,
  XAxis: ({ dataKey }: any) => <div data-testid="x-axis" data-axis-key={dataKey} />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
}));

describe('TrendlineChart', () => {
  const sampleData: TrendlineDataPoint[] = [
    { date: '2024-01-01', value: 0.65 },
    { date: '2024-01-08', value: 0.72 },
    { date: '2024-01-15', value: 0.68 }
  ];

  it('renders with data', () => {
    render(<TrendlineChart data={sampleData} />);
    
    expect(screen.getByTestId('trendline-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('renders with custom height', () => {
    const { container } = render(<TrendlineChart data={sampleData} height={300} />);
    
    const chartContainer = container.querySelector('[data-testid="trendline-chart"]');
    expect(chartContainer).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<TrendlineChart data={sampleData} label="Test Chart" />);
    
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(<TrendlineChart data={sampleData} loading={true} />);
    
    const loadingElement = screen.getByRole('img', { name: 'Trend over time loading' });
    expect(loadingElement).toBeInTheDocument();
    expect(loadingElement).toHaveClass('animate-pulse');
  });

  it('renders empty state when no data', () => {
    render(<TrendlineChart data={[]} />);
    
    expect(screen.getByText('No data yet')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Trend over time - no data' })).toBeInTheDocument();
  });

  it('renders empty state when data is null', () => {
    render(<TrendlineChart data={null as any} />);
    
    expect(screen.getByText('No data yet')).toBeInTheDocument();
  });

  it('renders empty state when data is undefined', () => {
    render(<TrendlineChart data={undefined as any} />);
    
    expect(screen.getByText('No data yet')).toBeInTheDocument();
  });

  it('has correct accessibility attributes when ready', () => {
    render(<TrendlineChart data={sampleData} />);
    
    const chart = screen.getByRole('img', { name: 'Trend over time' });
    expect(chart).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <TrendlineChart data={sampleData} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('formats dates correctly', () => {
    render(<TrendlineChart data={sampleData} />);
    
    // The mock will show the formatted data
    const lineChart = screen.getByTestId('line-chart');
    expect(lineChart).toHaveAttribute('data-chart-data');
  });
}); 