import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StudentDetailCharts from '../StudentDetailCharts';
import { api } from '../../services/api';

// Mock the API
jest.mock('../../services/api');
const mockedApi = api as jest.Mocked<typeof api>;

const mockHistoryData = [
  {
    id: 'analysis-1',
    studentId: 'student-1',
    createdAt: '2024-01-15T10:00:00Z',
    formality: 75.2,
    toneDistribution: [
      { label: 'formal', pct: 60 },
      { label: 'neutral', pct: 30 },
      { label: 'casual', pct: 10 }
    ],
    grammarIssues: [
      { type: 'Missing comma', count: 3 },
      { type: 'Run-on sentence', count: 1 },
      { type: 'Subject-verb agreement', count: 2 }
    ]
  },
  {
    id: 'analysis-2',
    studentId: 'student-1',
    createdAt: '2024-01-10T10:00:00Z',
    formality: 72.1,
    toneDistribution: [
      { label: 'formal', pct: 55 },
      { label: 'neutral', pct: 35 },
      { label: 'casual', pct: 10 }
    ],
    grammarIssues: [
      { type: 'Missing comma', count: 2 },
      { type: 'Run-on sentence', count: 2 }
    ]
  }
];

const mockProfileData = {
  studentId: 'student-1',
  baselineFormality: 75.2,
  baselineComplexity: 68.9,
  baselineLexical: 0.72,
  fingerprintStability: 0.87,
  strengths: [
    'Strong formal writing style',
    'Good sentence structure',
    'Consistent tone throughout'
  ],
  weaknesses: [
    'Occasional comma placement errors',
    'Some run-on sentences',
    'Could improve vocabulary diversity'
  ]
};

describe('StudentDetailCharts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock implementations
    mockedApi.history.mockResolvedValue(mockHistoryData);
    mockedApi.profile.mockResolvedValue(mockProfileData);
  });

  it('renders all chart components correctly', async () => {
    render(<StudentDetailCharts studentId="student-1" />);

    // Check that all chart titles are rendered
    expect(screen.getByText('Formality Trend')).toBeInTheDocument();
    expect(screen.getByText('Tone Distribution')).toBeInTheDocument();
    expect(screen.getByText('Common Grammar Issues')).toBeInTheDocument();
    expect(screen.getByText('Strengths and Weaknesses')).toBeInTheDocument();
  });

  it('shows loading states initially', () => {
    render(<StudentDetailCharts studentId="student-1" />);

    // Check for loading skeletons
    const loadingElements = screen.getAllByText('', { selector: '.animate-pulse' });
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('loads and displays formality trend data', async () => {
    render(<StudentDetailCharts studentId="student-1" />);

    await waitFor(() => {
      expect(mockedApi.history).toHaveBeenCalledWith('student-1', 20);
    });

    // Check that the trendline chart is rendered
    expect(screen.getByTestId('student-trendline')).toBeInTheDocument();
  });

  it('loads and displays tone distribution data', async () => {
    render(<StudentDetailCharts studentId="student-1" />);

    await waitFor(() => {
      expect(mockedApi.history).toHaveBeenCalledWith('student-1', 1);
    });

    // Check that the tone pie chart is rendered
    expect(screen.getByTestId('student-tonepie')).toBeInTheDocument();
  });

  it('loads and displays grammar issues data', async () => {
    render(<StudentDetailCharts studentId="studentId-1" />);

    await waitFor(() => {
      expect(mockedApi.history).toHaveBeenCalledWith('studentId-1', 1);
    });

    // Check that the issues bar is rendered
    expect(screen.getByTestId('student-issuesbar')).toBeInTheDocument();
  });

  it('loads and displays profile data', async () => {
    render(<StudentDetailCharts studentId="student-1" />);

    await waitFor(() => {
      expect(mockedApi.profile).toHaveBeenCalledWith('student-1');
    });

    // Check that strengths and weaknesses are displayed
    expect(screen.getByText('Strong formal writing style')).toBeInTheDocument();
    expect(screen.getByText('Occasional comma placement errors')).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    // Mock API errors
    mockedApi.history.mockRejectedValue(new Error('API Error'));
    mockedApi.profile.mockRejectedValue(new Error('Profile Error'));

    render(<StudentDetailCharts studentId="student-1" />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load formality data')).toBeInTheDocument();
      expect(screen.getByText('Failed to load profile data')).toBeInTheDocument();
    });

    // Check that retry buttons are present
    const retryButtons = screen.getAllByText('Retry');
    expect(retryButtons.length).toBeGreaterThan(0);
  });

  it('retry buttons reload data when clicked', async () => {
    // Mock API errors first
    mockedApi.history.mockRejectedValueOnce(new Error('API Error'));
    mockedApi.history.mockResolvedValueOnce(mockHistoryData);

    render(<StudentDetailCharts studentId="student-1" />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load formality data')).toBeInTheDocument();
    });

    // Click retry button
    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);

    // Check that API is called again (may be called multiple times due to re-renders)
    await waitFor(() => {
      expect(mockedApi.history).toHaveBeenCalledWith('student-1', 20);
    });
  });

  it('displays strengths and weaknesses correctly', async () => {
    render(<StudentDetailCharts studentId="student-1" />);

    await waitFor(() => {
      expect(screen.getByText('Strengths')).toBeInTheDocument();
      expect(screen.getByText('Areas for Improvement')).toBeInTheDocument();
    });

    // Check strengths
    expect(screen.getByText('Strong formal writing style')).toBeInTheDocument();
    expect(screen.getByText('Good sentence structure')).toBeInTheDocument();
    expect(screen.getByText('Consistent tone throughout')).toBeInTheDocument();

    // Check weaknesses
    expect(screen.getByText('Occasional comma placement errors')).toBeInTheDocument();
    expect(screen.getByText('Some run-on sentences')).toBeInTheDocument();
    expect(screen.getByText('Could improve vocabulary diversity')).toBeInTheDocument();
  });

  it('handles empty strengths and weaknesses gracefully', async () => {
    const emptyProfile = {
      ...mockProfileData,
      strengths: [],
      weaknesses: []
    };
    mockedApi.profile.mockResolvedValue(emptyProfile);

    render(<StudentDetailCharts studentId="student-1" />);

    await waitFor(() => {
      expect(screen.getByText('No analysis data available yet.')).toBeInTheDocument();
    });
  });

  it('applies custom className correctly', () => {
    const { container } = render(
      <StudentDetailCharts studentId="student-1" className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders with responsive grid layout', () => {
    const { container } = render(<StudentDetailCharts studentId="student-1" />);

    // Check that the grid containers have responsive classes
    const gridContainers = container.querySelectorAll('.grid');
    expect(gridContainers.length).toBe(2); // Two rows

    // First row should have lg:grid-cols-2
    expect(gridContainers[0]).toHaveClass('lg:grid-cols-2');
    // Second row should have lg:grid-cols-2
    expect(gridContainers[1]).toHaveClass('lg:grid-cols-2');
  });

  it('reloads data when studentId changes', async () => {
    const { rerender } = render(<StudentDetailCharts studentId="student-1" />);

    // Wait for initial load
    await waitFor(() => {
      expect(mockedApi.history).toHaveBeenCalledWith('student-1', 20);
    });

    // Change student ID
    rerender(<StudentDetailCharts studentId="student-2" />);

    // Check that API is called with new student ID
    await waitFor(() => {
      expect(mockedApi.history).toHaveBeenCalledWith('student-2', 20);
      expect(mockedApi.profile).toHaveBeenCalledWith('student-2');
    });
  });

  it('handles missing tone distribution data gracefully', async () => {
    const historyWithoutTone = mockHistoryData.map(analysis => ({
      ...analysis,
      toneDistribution: []
    }));
    mockedApi.history.mockResolvedValue(historyWithoutTone);

    render(<StudentDetailCharts studentId="student-1" />);

    await waitFor(() => {
      expect(screen.getByTestId('student-tonepie')).toBeInTheDocument();
    });
  });

  it('handles missing grammar issues data gracefully', async () => {
    const historyWithoutGrammar = mockHistoryData.map(analysis => ({
      ...analysis,
      grammarIssues: []
    }));
    mockedApi.history.mockResolvedValue(historyWithoutGrammar);

    render(<StudentDetailCharts studentId="student-1" />);

    await waitFor(() => {
      expect(screen.getByTestId('student-issuesbar')).toBeInTheDocument();
    });
  });

  it('formats formality trend data correctly', async () => {
    render(<StudentDetailCharts studentId="student-1" />);

    await waitFor(() => {
      expect(mockedApi.history).toHaveBeenCalledWith('student-1', 20);
    });

    // The component should transform the data for the TrendlineChart
    // We can verify this by checking that the component renders without errors
    expect(screen.getByTestId('student-trendline')).toBeInTheDocument();
  });

  it('has correct test IDs for all chart components', async () => {
    render(<StudentDetailCharts studentId="student-1" />);

    await waitFor(() => {
      expect(screen.getByTestId('student-trendline')).toBeInTheDocument();
      expect(screen.getByTestId('student-tonepie')).toBeInTheDocument();
      expect(screen.getByTestId('student-issuesbar')).toBeInTheDocument();
    });
  });
}); 