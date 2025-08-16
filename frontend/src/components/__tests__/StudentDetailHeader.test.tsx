import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StudentDetailHeader from '../StudentDetailHeader';

const mockStudent = {
  id: 'test-1',
  name: 'Test Student',
  email: 'test@example.com'
};

const mockProfile = {
  baselineFormality: 75.2,
  baselineComplexity: 68.9,
  fingerprintStability: 0.87
};

const mockPerformance = {
  avgFormality: 72.1,
  avgComplexity: 65.3,
  avgReadability: 12.4,
  avgGrammarIssues: 2.1
};

describe('StudentDetailHeader', () => {
  it('renders student identity section correctly', () => {
    render(
      <StudentDetailHeader
        student={mockStudent}
        profile={mockProfile}
        performance={mockPerformance}
      />
    );

    // Check student name
    expect(screen.getByTestId('student-name')).toHaveTextContent('Test Student');
    
    // Check email
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    
    // Check avatar placeholder
    expect(screen.getByTestId('student-avatar')).toBeInTheDocument();
    expect(screen.getByTestId('student-avatar')).toHaveTextContent('T');
  });

  it('renders KPI cards with correct data', () => {
    render(
      <StudentDetailHeader
        student={mockStudent}
        profile={mockProfile}
        performance={mockPerformance}
      />
    );

    // Check KPI cards are rendered
    expect(screen.getByTestId('student-kpi-formality')).toBeInTheDocument();
    expect(screen.getByTestId('student-kpi-complexity')).toBeInTheDocument();
    expect(screen.getByTestId('student-kpi-stability')).toBeInTheDocument();
    
    // Check KPI values
    expect(screen.getByText('75.2')).toBeInTheDocument(); // Baseline Formality
    expect(screen.getByText('68.9')).toBeInTheDocument(); // Baseline Complexity
    expect(screen.getByText('87.0%')).toBeInTheDocument(); // Fingerprint Stability
    expect(screen.getByText('2.1')).toBeInTheDocument(); // Avg Grammar Issues
  });

  it('renders action buttons correctly', () => {
    render(
      <StudentDetailHeader
        student={mockStudent}
        profile={mockProfile}
        performance={mockPerformance}
      />
    );

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
  });

  it('calls onActionClick when action buttons are clicked', () => {
    const mockOnActionClick = jest.fn();
    
    render(
      <StudentDetailHeader
        student={mockStudent}
        profile={mockProfile}
        performance={mockPerformance}
        onActionClick={mockOnActionClick}
      />
    );

    fireEvent.click(screen.getByText('Edit'));
    expect(mockOnActionClick).toHaveBeenCalledWith('edit');

    fireEvent.click(screen.getByText('Export'));
    expect(mockOnActionClick).toHaveBeenCalledWith('export');
  });

  it('handles missing email gracefully', () => {
    const studentWithoutEmail = { ...mockStudent, email: undefined };
    
    render(
      <StudentDetailHeader
        student={studentWithoutEmail}
        profile={mockProfile}
        performance={mockPerformance}
      />
    );

    expect(screen.queryByText('test@example.com')).not.toBeInTheDocument();
  });

  it('handles missing profile data gracefully', () => {
    render(
      <StudentDetailHeader
        student={mockStudent}
        performance={mockPerformance}
      />
    );

    // KPI cards should show loading state or fallback values
    expect(screen.getByTestId('student-kpi-formality')).toBeInTheDocument();
    expect(screen.getByTestId('student-kpi-complexity')).toBeInTheDocument();
    expect(screen.getByTestId('student-kpi-stability')).toBeInTheDocument();
  });

  it('handles missing performance data gracefully', () => {
    render(
      <StudentDetailHeader
        student={mockStudent}
        profile={mockProfile}
      />
    );

    // KPI cards should show loading state or fallback values
    expect(screen.getByTestId('student-kpi-grammar')).toBeInTheDocument();
  });

  it('applies custom className correctly', () => {
    const { container } = render(
      <StudentDetailHeader
        student={mockStudent}
        profile={mockProfile}
        performance={mockPerformance}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders with responsive grid layout classes', () => {
    const { container } = render(
      <StudentDetailHeader
        student={mockStudent}
        profile={mockProfile}
        performance={mockPerformance}
      />
    );

    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass(
      'grid-cols-1',
      'md:grid-cols-2',
      'lg:grid-cols-4'
    );
  });

  it('displays correct KPI titles and hints', () => {
    render(
      <StudentDetailHeader
        student={mockStudent}
        profile={mockProfile}
        performance={mockPerformance}
      />
    );

    // Check KPI titles
    expect(screen.getByText('Baseline Formality')).toBeInTheDocument();
    expect(screen.getByText('Baseline Complexity')).toBeInTheDocument();
    expect(screen.getByText('Fingerprint Stability %')).toBeInTheDocument();
    expect(screen.getByText('Avg Grammar Issues')).toBeInTheDocument();

    // Check hints
    expect(screen.getAllByText('0-100 scale')).toHaveLength(2); // Formality and Complexity
    expect(screen.getByText('Higher is more stable')).toBeInTheDocument();
    expect(screen.getByText('Per submission')).toBeInTheDocument();
  });

  it('formats fingerprint stability as percentage correctly', () => {
    const profileWithHighStability = {
      ...mockProfile,
      fingerprintStability: 0.95
    };

    render(
      <StudentDetailHeader
        student={mockStudent}
        profile={profileWithHighStability}
        performance={mockPerformance}
      />
    );

    expect(screen.getByText('95.0%')).toBeInTheDocument();
  });

  it('handles zero values correctly', () => {
    const profileWithZeros = {
      baselineFormality: 0,
      baselineComplexity: 0,
      fingerprintStability: 0
    };

    render(
      <StudentDetailHeader
        student={mockStudent}
        profile={profileWithZeros}
        performance={mockPerformance}
      />
    );

    expect(screen.getAllByText('0.0')).toHaveLength(2); // Baseline Formality and Complexity
    expect(screen.getByText('0.0%')).toBeInTheDocument(); // Fingerprint Stability
  });

  it('handles missing data gracefully', () => {
    render(
      <StudentDetailHeader
        student={mockStudent}
        performance={mockPerformance}
      />
    );

    // When profile is missing, should show loading state
    // Check that the KPI cards are rendered but in loading state
    expect(screen.getByTestId('student-kpi-formality')).toBeInTheDocument();
    expect(screen.getByTestId('student-kpi-complexity')).toBeInTheDocument();
    expect(screen.getByTestId('student-kpi-stability')).toBeInTheDocument();
  });
}); 