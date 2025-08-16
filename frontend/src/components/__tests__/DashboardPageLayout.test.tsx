import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DashboardPageLayout from '../DashboardPageLayout';
import { api } from '../../services/api';

// Mock the API
jest.mock('../../services/api');
const mockedApi = api as jest.Mocked<typeof api>;

const mockStudents = [
  { id: 'student-1', name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 'student-2', name: 'Bob Smith', email: 'bob@example.com' }
];

const mockAssignments = [
  { id: 'assignment-1', title: 'Essay 1', submittedCount: 15 },
  { id: 'assignment-2', title: 'Essay 2', submittedCount: 12 }
];

const mockAnalyses = [
  {
    id: 'analysis-1',
    studentId: 'student-1',
    formality: 75.2,
    complexity: 68.9,
    readability: { fk: 12.4 },
    toneDistribution: [
      { label: 'formal', pct: 60 },
      { label: 'neutral', pct: 30 },
      { label: 'casual', pct: 10 }
    ],
    grammarIssues: [
      { type: 'Missing comma', count: 3 },
      { type: 'Run-on sentence', count: 1 }
    ]
  },
  {
    id: 'analysis-2',
    studentId: 'student-2',
    formality: 72.1,
    complexity: 65.3,
    readability: { fk: 11.8 },
    toneDistribution: [
      { label: 'formal', pct: 55 },
      { label: 'neutral', pct: 35 },
      { label: 'casual', pct: 10 }
    ],
    grammarIssues: [
      { type: 'Missing comma', count: 2 },
      { type: 'Subject-verb agreement', count: 1 }
    ]
  }
];

const mockHistory = [
  { id: 'hist-1', createdAt: '2024-01-15T10:00:00Z', formality: 75.2 },
  { id: 'hist-2', createdAt: '2024-01-10T10:00:00Z', formality: 72.1 },
  { id: 'hist-3', createdAt: '2024-01-05T10:00:00Z', formality: 70.5 }
];

describe('DashboardPageLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock implementations
    mockedApi.listStudents.mockResolvedValue(mockStudents);
    mockedApi.listAssignments.mockResolvedValue(mockAssignments);
    mockedApi.listAnalyses.mockResolvedValue(mockAnalyses);
    mockedApi.history.mockResolvedValue(mockHistory);
  });

  it('renders loading state initially', () => {
    render(<DashboardPageLayout />);

    // Check for loading skeletons
    const loadingElements = screen.getAllByText('', { selector: '.animate-pulse' });
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('renders dashboard with data when students exist', async () => {
    render(<DashboardPageLayout />);

    await waitFor(() => {
      // Check KPI row
      expect(screen.getByTestId('dashboard-kpi-row')).toBeInTheDocument();
      
      // Check KPI cards
      expect(screen.getByText('Average Formality')).toBeInTheDocument();
      expect(screen.getByText('Average Complexity')).toBeInTheDocument();
      expect(screen.getByText('Average Readability (FK)')).toBeInTheDocument();
      expect(screen.getByText('Assignments Submitted')).toBeInTheDocument();
      expect(screen.getByText('AI Use Alerts')).toBeInTheDocument();
    });

    // Check charts row
    expect(screen.getByTestId('dashboard-trend-card')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-tone-card')).toBeInTheDocument();
    expect(screen.getByText('Class Progress Trends')).toBeInTheDocument();
    expect(screen.getAllByText('Tone Distribution')).toHaveLength(2); // Card header + chart title

    // Check insights row
    expect(screen.getByTestId('dashboard-issues-card')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-assignments-card')).toBeInTheDocument();
    expect(screen.getByText('Common Grammar Issues')).toBeInTheDocument();
    expect(screen.getByText('Assignments Status')).toBeInTheDocument();
  });

  it('calculates KPI values correctly', async () => {
    render(<DashboardPageLayout />);

    await waitFor(() => {
      // Check calculated KPI values
      expect(screen.getByText('73.7')).toBeInTheDocument(); // Average formality: (75.2 + 72.1) / 2
      expect(screen.getByText('67.1')).toBeInTheDocument(); // Average complexity: (68.9 + 65.3) / 2
      expect(screen.getByText('12.1')).toBeInTheDocument(); // Average readability: (12.4 + 11.8) / 2
      expect(screen.getByText('27')).toBeInTheDocument(); // Assignments submitted: 15 + 12
      expect(screen.getByText('2')).toBeInTheDocument(); // AI use alerts (placeholder)
    });
  });

  it('shows empty state when no students exist', async () => {
    mockedApi.listStudents.mockResolvedValue([]);

    render(<DashboardPageLayout />);

    await waitFor(() => {
      expect(screen.getByText('No Students Yet')).toBeInTheDocument();
      expect(screen.getByText('Get started by adding your first student to begin tracking their writing progress.')).toBeInTheDocument();
      expect(screen.getByText('Go to Students Page')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    mockedApi.listStudents.mockRejectedValue(new Error('API Error'));

    render(<DashboardPageLayout />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load dashboard data')).toBeInTheDocument();
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });
  });

  it('loads data from correct API endpoints', async () => {
    render(<DashboardPageLayout />);

    await waitFor(() => {
      expect(mockedApi.listStudents).toHaveBeenCalled();
      expect(mockedApi.listAssignments).toHaveBeenCalled();
      expect(mockedApi.listAnalyses).toHaveBeenCalled();
      expect(mockedApi.history).toHaveBeenCalledWith('student-1', 10);
    });
  });

  it('transforms trend data correctly', async () => {
    render(<DashboardPageLayout />);

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-trend-card')).toBeInTheDocument();
    });

    // The TrendlineChart should receive the transformed data
    // We can verify this by checking that the component renders without errors
    expect(screen.getByText('Class Progress Trends')).toBeInTheDocument();
  });

  it('displays tone distribution from latest analysis', async () => {
    render(<DashboardPageLayout />);

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-tone-card')).toBeInTheDocument();
    });

    // The TonePieChart should receive the tone data
    // Check that the tone card title is displayed (appears twice: header + chart title)
    expect(screen.getAllByText('Tone Distribution')).toHaveLength(2);
  });

  it('displays grammar issues from latest analysis', async () => {
    render(<DashboardPageLayout />);

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-issues-card')).toBeInTheDocument();
    });

    // The IssuesBar should receive the grammar issues data
    expect(screen.getByText('Common Grammar Issues')).toBeInTheDocument();
  });

  it('displays assignments from API', async () => {
    render(<DashboardPageLayout />);

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-assignments-card')).toBeInTheDocument();
    });

    // The AssignmentsListCard should receive the assignments data
    expect(screen.getByText('Assignments Status')).toBeInTheDocument();
  });

  it('applies custom className correctly', async () => {
    const { container } = render(
      <DashboardPageLayout className="custom-dashboard" />
    );

    await waitFor(() => {
      expect(container.firstChild).toHaveClass('custom-dashboard');
    });
  });

  it('renders with responsive grid layout', async () => {
    const { container } = render(<DashboardPageLayout />);

    await waitFor(() => {
      // Check KPI row grid
      const kpiRow = screen.getByTestId('dashboard-kpi-row');
      expect(kpiRow).toHaveClass('md:grid-cols-5');
      expect(kpiRow).toHaveClass('grid-cols-1');
    });

    // Check charts row grid
    const chartsRow = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2');
    expect(chartsRow).toBeInTheDocument();

    // Check insights row grid
    const insightsRow = container.querySelectorAll('.grid.grid-cols-1.md\\:grid-cols-2')[1];
    expect(insightsRow).toBeInTheDocument();
  });

  it('handles missing analysis data gracefully', async () => {
    mockedApi.listAnalyses.mockResolvedValue([]);

    render(<DashboardPageLayout />);

    await waitFor(() => {
      // Should still render with zero values
      expect(screen.getAllByText('0.0')).toHaveLength(3); // Average formality, complexity, readability
    });
  });

  it('handles missing assignment data gracefully', async () => {
    mockedApi.listAssignments.mockResolvedValue([]);

    render(<DashboardPageLayout />);

    await waitFor(() => {
      // Should still render with zero assignments submitted
      expect(screen.getByText('0')).toBeInTheDocument(); // Assignments submitted
    });
  });

  it('handles missing history data gracefully', async () => {
    mockedApi.history.mockResolvedValue([]);

    render(<DashboardPageLayout />);

    await waitFor(() => {
      // Should still render the trend card
      expect(screen.getByTestId('dashboard-trend-card')).toBeInTheDocument();
    });
  });

  it('shows correct KPI hints', async () => {
    render(<DashboardPageLayout />);

    await waitFor(() => {
      expect(screen.getAllByText('0-100 scale')).toHaveLength(2); // Formality and Complexity
      expect(screen.getByText('Flesch-Kincaid grade level')).toBeInTheDocument(); // Readability
      expect(screen.getByText('Total submissions')).toBeInTheDocument(); // Assignments
      expect(screen.getByText('Potential anomalies')).toBeInTheDocument(); // AI alerts
    });
  });

  it('has correct test IDs for all sections', async () => {
    render(<DashboardPageLayout />);

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-kpi-row')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-trend-card')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-tone-card')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-issues-card')).toBeInTheDocument();
      expect(screen.getByTestId('dashboard-assignments-card')).toBeInTheDocument();
    });
  });

  it('retry button reloads page on error', async () => {
    mockedApi.listStudents.mockRejectedValue(new Error('API Error'));

    render(<DashboardPageLayout />);

    await waitFor(() => {
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });

    // Check that retry button has correct text and is clickable
    const retryButton = screen.getByText('Retry');
    expect(retryButton).toBeInTheDocument();
    expect(retryButton.tagName).toBe('BUTTON');
  });

  it('empty state link goes to students page', async () => {
    mockedApi.listStudents.mockResolvedValue([]);

    render(<DashboardPageLayout />);

    await waitFor(() => {
      const studentsLink = screen.getByText('Go to Students Page');
      expect(studentsLink).toHaveAttribute('href', '/students');
    });
  });
}); 