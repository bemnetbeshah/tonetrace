import React from 'react';
import { render, screen } from '@testing-library/react';
import { TonePieChart, ToneDataPoint } from '../TonePieChart';

// Mock Recharts components to avoid canvas issues in tests
jest.mock('recharts', () => ({
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ data, children }: any) => (
    <div data-testid="pie" data-chart-data={JSON.stringify(data)}>
      {children}
    </div>
  ),
  Cell: ({ fill }: any) => <div data-testid="cell" data-fill={fill} />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  Tooltip: () => <div data-testid="tooltip" />,
}));

describe('TonePieChart', () => {
  const sampleData: ToneDataPoint[] = [
    { name: 'Formal', value: 45 },
    { name: 'Neutral', value: 30 },
    { name: 'Objective', value: 15 }
  ];

  it('renders with data', () => {
    render(<TonePieChart data={sampleData} />);
    
    expect(screen.getByTestId('tone-pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('tone-legend')).toBeInTheDocument();
  });

  it('renders empty state when no data', () => {
    render(<TonePieChart data={[]} />);
    
    expect(screen.getByText('No tone data')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Tone distribution pie chart - no data' })).toBeInTheDocument();
  });

  it('renders empty state when data is null', () => {
    render(<TonePieChart data={null as any} />);
    
    expect(screen.getByText('No tone data')).toBeInTheDocument();
  });

  it('renders empty state when data is undefined', () => {
    render(<TonePieChart data={undefined as any} />);
    
    expect(screen.getByText('No tone data')).toBeInTheDocument();
  });

  it('shows legend with correct tone names', () => {
    render(<TonePieChart data={sampleData} />);
    
    expect(screen.getByText('Formal')).toBeInTheDocument();
    expect(screen.getByText('Neutral')).toBeInTheDocument();
    expect(screen.getByText('Objective')).toBeInTheDocument();
  });

  it('shows legend title', () => {
    render(<TonePieChart data={sampleData} />);
    
    expect(screen.getByText('Tone Distribution')).toBeInTheDocument();
  });

  it('has correct accessibility attributes when rendering chart', () => {
    render(<TonePieChart data={sampleData} />);
    
    const chart = screen.getByRole('img', { name: 'Tone distribution pie chart' });
    expect(chart).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <TonePieChart data={sampleData} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders pie chart with correct data', () => {
    render(<TonePieChart data={sampleData} />);
    
    const pie = screen.getByTestId('pie');
    expect(pie).toHaveAttribute('data-chart-data');
  });

  it('renders cells with colors', () => {
    render(<TonePieChart data={sampleData} />);
    
    const cells = screen.getAllByTestId('cell');
    expect(cells.length).toBe(3);
  });
}); 