import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StudentsTable from '../StudentsTable';

describe('StudentsTable', () => {
  const mockStudents = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice.johnson@university.edu',
      lastSubmissionAt: '2024-02-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob.smith@university.edu',
      lastSubmissionAt: '2024-02-14T15:45:00Z'
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol.davis@university.edu',
      lastSubmissionAt: '2024-02-13T09:20:00Z'
    }
  ];

  it('renders students table correctly', () => {
    render(<StudentsTable students={mockStudents} />);
    
    expect(screen.getByTestId('students-table')).toBeInTheDocument();
    expect(screen.getAllByTestId('students-row')).toHaveLength(3);
    expect(screen.getAllByTestId('students-open-link')).toHaveLength(3);
  });

  it('displays student information correctly', () => {
    render(<StudentsTable students={mockStudents} />);
    
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('alice.johnson@university.edu')).toBeInTheDocument();
    expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    expect(screen.getByText('bob.smith@university.edu')).toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    render(<StudentsTable students={mockStudents} />);
    
    // Check that dates are displayed (more flexible date matching)
    expect(screen.getByText(/2\/15\/2024/)).toBeInTheDocument();
    expect(screen.getByText(/2\/14\/2024/)).toBeInTheDocument();
  });

  it('shows loading state with skeleton rows', () => {
    render(<StudentsTable students={mockStudents} loading={true} />);
    
    expect(screen.getByTestId('students-table')).toBeInTheDocument();
    // Check for skeleton loading elements
    const skeletonElements = screen.getAllByRole('row');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('displays empty state when no students', () => {
    render(<StudentsTable students={[]} />);
    
    expect(screen.getByText('No students found')).toBeInTheDocument();
    expect(screen.getByTestId('students-table')).toBeInTheDocument();
  });

  it('filters students by search term', () => {
    render(<StudentsTable students={mockStudents} />);
    
    const searchInput = screen.getByPlaceholderText('Search by name or email...');
    fireEvent.change(searchInput, { target: { value: 'alice' } });
    
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.queryByText('Bob Smith')).not.toBeInTheDocument();
    expect(screen.queryByText('Carol Davis')).not.toBeInTheDocument();
  });

  it('filters students by email search', () => {
    render(<StudentsTable students={mockStudents} />);
    
    const searchInput = screen.getByPlaceholderText('Search by name or email...');
    fireEvent.change(searchInput, { target: { value: 'bob.smith' } });
    
    expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    expect(screen.queryByText('Alice Johnson')).not.toBeInTheDocument();
    expect(screen.queryByText('Carol Davis')).not.toBeInTheDocument();
  });

  it('shows no results message for search with no matches', () => {
    render(<StudentsTable students={mockStudents} />);
    
    const searchInput = screen.getByPlaceholderText('Search by name or email...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    expect(screen.getByText('No students found matching your search')).toBeInTheDocument();
  });

  it('provides clear search option when search has no results', () => {
    render(<StudentsTable students={mockStudents} />);
    
    const searchInput = screen.getByPlaceholderText('Search by name or email...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    const clearButton = screen.getByText('Clear search');
    expect(clearButton).toBeInTheDocument();
    
    fireEvent.click(clearButton);
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    expect(screen.getByText('Carol Davis')).toBeInTheDocument();
  });

  it('resets to first page when search changes', () => {
    // Create enough students to trigger pagination
    const manyStudents = Array.from({ length: 15 }, (_, i) => ({
      id: String(i + 1),
      name: `Student ${i + 1}`,
      email: `student${i + 1}@university.edu`,
      lastSubmissionAt: '2024-02-15T10:30:00Z'
    }));
    
    render(<StudentsTable students={manyStudents} />);
    
    // Go to second page
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    
    // Search for something that will return only 1 result
    const searchInput = screen.getByPlaceholderText('Search by name or email...');
    fireEvent.change(searchInput, { target: { value: 'student15@university.edu' } });
    
    // Should be back on first page
    expect(screen.getByText('Showing 1 to 1 of 1 results')).toBeInTheDocument();
  });

  it('handles pagination correctly', () => {
    // Create enough students to trigger pagination
    const manyStudents = Array.from({ length: 15 }, (_, i) => ({
      id: String(i + 1),
      name: `Student ${i + 1}`,
      email: `student${i + 1}@university.edu`,
      lastSubmissionAt: '2024-02-15T10:30:00Z'
    }));
    
    render(<StudentsTable students={manyStudents} />);
    
    // Check initial state
    expect(screen.getByText('Showing 1 to 10 of 15 results')).toBeInTheDocument();
    expect(screen.getByText('Student 1')).toBeInTheDocument();
    expect(screen.queryByText('Student 11')).not.toBeInTheDocument();
    
    // Go to next page
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    
    expect(screen.getByText('Showing 11 to 15 of 15 results')).toBeInTheDocument();
    expect(screen.getByText('Student 11')).toBeInTheDocument();
    expect(screen.queryByText('Student 1')).not.toBeInTheDocument();
    
    // Go back to first page
    const prevButton = screen.getByText('Previous');
    fireEvent.click(prevButton);
    
    expect(screen.getByText('Showing 1 to 10 of 15 results')).toBeInTheDocument();
    expect(screen.getByText('Student 1')).toBeInTheDocument();
  });

  it('disables pagination buttons appropriately', () => {
    // Create enough students to trigger pagination
    const manyStudents = Array.from({ length: 15 }, (_, i) => ({
      id: String(i + 1),
      name: `Student ${i + 1}`,
      email: `student${i + 1}@university.edu`,
      lastSubmissionAt: '2024-02-15T10:30:00Z'
    }));
    
    render(<StudentsTable students={manyStudents} />);
    
    // Previous button should be disabled on first page
    const prevButton = screen.getByText('Previous');
    expect(prevButton).toBeDisabled();
    
    // Next button should be enabled
    const nextButton = screen.getByText('Next');
    expect(nextButton).not.toBeDisabled();
    
    // Go to next page
    fireEvent.click(nextButton);
    
    // Previous button should be enabled
    expect(prevButton).not.toBeDisabled();
    
    // Next button should be disabled on last page
    expect(nextButton).toBeDisabled();
  });

  it('has correct accessibility attributes', () => {
    render(<StudentsTable students={mockStudents} />);
    
    const table = screen.getByTestId('students-table');
    expect(table).toHaveAttribute('role', 'table');
    
    // Check table headers have scope="col"
    const headers = screen.getAllByRole('columnheader');
    headers.forEach(header => {
      expect(header).toHaveAttribute('scope', 'col');
    });
    
    // Check rows have role="row"
    const rows = screen.getAllByTestId('students-row');
    rows.forEach(row => {
      expect(row).toHaveAttribute('role', 'row');
    });
  });

  it('has correct test IDs', () => {
    render(<StudentsTable students={mockStudents} />);
    
    expect(screen.getByTestId('students-table')).toBeInTheDocument();
    expect(screen.getAllByTestId('students-row')).toHaveLength(3);
    expect(screen.getAllByTestId('students-open-link')).toHaveLength(3);
  });

  it('renders with proper styling classes', () => {
    render(<StudentsTable students={mockStudents} />);
    
    const table = screen.getByTestId('students-table');
    expect(table).toHaveClass('bg-white', 'rounded-xl', 'shadow');
    
    const searchInput = screen.getByPlaceholderText('Search by name or email...');
    expect(searchInput).toHaveClass('border', 'rounded-lg');
  });

  it('handles students without last submission date', () => {
    const studentsWithoutDate = [
      {
        id: '1',
        name: 'Alice Johnson',
        email: 'alice.johnson@university.edu'
        // No lastSubmissionAt
      }
    ];
    
    render(<StudentsTable students={studentsWithoutDate} />);
    
    expect(screen.getByText('—')).toBeInTheDocument();
  });
}); 