export const convertToCSV = (data: any[], headers: string[]): string => {
  if (data.length === 0) return '';
  
  // Create header row
  const csvRows = [headers.join(',')];
  
  // Create data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header.toLowerCase().replace(/\s+/g, '_')] || row[header] || '';
      // Escape quotes and wrap in quotes if contains comma or newline
      const escaped = String(value).replace(/"/g, '""');
      return escaped.includes(',') || escaped.includes('\n') ? `"${escaped}"` : escaped;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
};

export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportDashboardData = (data: any): void => {
  // Export KPI data
  const kpiHeaders = ['Title', 'Value', 'Sublabel', 'Trend Direction', 'Trend Value'];
  const kpiData = data.kpis.map((kpi: any) => ({
    title: kpi.title,
    value: kpi.value,
    sublabel: kpi.sublabel,
    trend_direction: kpi.trend.direction,
    trend_value: kpi.trend.value
  }));
  
  const kpiCSV = convertToCSV(kpiData, kpiHeaders);
  downloadCSV(kpiCSV, 'tonetrace-dashboard-kpis.csv');
  
  // Export student performance data
  const studentHeaders = ['Name', 'Email', 'Risk Level', 'Latest Assignment', 'Formality', 'Complexity'];
  const studentData = data.students?.map((student: any) => ({
    name: student.name,
    email: student.email,
    risk_level: student.riskLevel,
    latest_assignment: 'Argumentative Essay', // Mock data
    formality: '85%', // Mock data
    complexity: '72%' // Mock data
  })) || [];
  
  const studentCSV = convertToCSV(studentData, studentHeaders);
  downloadCSV(studentCSV, 'tonetrace-student-performance.csv');
};
