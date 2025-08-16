import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AssignmentsPage from '../../pages/AssignmentsPage';

// Mock the API service
jest.mock('../../services/api', () => ({
  api: {
    listAssignments: jest.fn()
  }
}));

const mockApi = require('../../services/api').api;

describe('AssignmentsPage', () => {
  const mockAssignments = [
    {
      id: 'a1',
      title: 'Privacy and Drones',
      dueDate: '2025-09-01',
      submittedCount: 3,
      totalCount: 4
    },
    {
      id: 'a2',
      title: 'What Causes Racism',
      dueDate: '2025-09-15',
      submittedCount: 0,
      totalCount: 4
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock alert to prevent it from showing during tests
    global.alert = jest.fn();
  });

  it('renders assignments page with test ID', async () => {
    mockApi.listAssignments.mockResolvedValue(mockAssignments);
    
    render(<AssignmentsPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('assignments-page')).toBeInTheDocument();
    });
  });

  it('displays page title and new assignment button', async () => {
    mockApi.listAssignments.mockResolvedValue(mockAssignments);
    
    render(<AssignmentsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Assignments')).toBeInTheDocument();
      expect(screen.getByText('New Assignment')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    mockApi.listAssignments.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<AssignmentsPage />);
    
    // Check for skeleton components instead of role="status"
    const skeletons = screen.getAllByTestId('row-skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('displays assignments list when data is loaded', async () => {
    mockApi.listAssignments.mockResolvedValue(mockAssignments);
    
    render(<AssignmentsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Privacy and Drones')).toBeInTheDocument();
      expect(screen.getByText('What Causes Racism')).toBeInTheDocument();
    });
  });

  it('shows empty state when no assignments exist', async () => {
    mockApi.listAssignments.mockResolvedValue([]);
    
    render(<AssignmentsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('No assignments yet')).toBeInTheDocument();
    });
  });

  it('handles analyze button click with mocked behavior', async () => {
    mockApi.listAssignments.mockResolvedValue(mockAssignments);
    
    render(<AssignmentsPage />);
    
    await waitFor(() => {
      const analyzeButtons = screen.getAllByTestId('assignments-run-analysis');
      expect(analyzeButtons).toHaveLength(2);
    });
    
    const firstAnalyzeButton = screen.getAllByTestId('assignments-run-analysis')[0];
    fireEvent.click(firstAnalyzeButton);
    
    expect(global.alert).toHaveBeenCalledWith('mocked');
  });

  it('handles new assignment button click', async () => {
    mockApi.listAssignments.mockResolvedValue(mockAssignments);
    
    render(<AssignmentsPage />);
    
    await waitFor(() => {
      const newAssignmentButton = screen.getByText('New Assignment');
      fireEvent.click(newAssignmentButton);
    });
    
    expect(global.alert).toHaveBeenCalledWith('New Assignment button clicked - stub implementation');
  });

  it('displays assignment details correctly', async () => {
    mockApi.listAssignments.mockResolvedValue(mockAssignments);
    
    render(<AssignmentsPage />);
    
    await waitFor(() => {
      // Use getAllByText since there are multiple "Due:" elements
      const dueElements = screen.getAllByText(/Due:/);
      expect(dueElements).toHaveLength(2);
      expect(screen.getByText('3 of 4 submitted')).toBeInTheDocument();
      expect(screen.getByText('0 of 4 submitted')).toBeInTheDocument();
    });
  });
}); 