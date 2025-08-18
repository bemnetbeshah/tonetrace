import React, { useState } from 'react';
import { 
  AccessibleButton, 
  AccessibleChart, 
  AccessibleTable, 
  AccessibleTableHead,
  AccessibleTableBody,
  AccessibleTableRow,
  AccessibleTableCell,
  AccessibleTableAction,
  AccessibleTableActions,
  AccessibleSearch,
  AccessibleSidebar,
  AccessibleSidebarTrigger,
  AccessibleSidebarSection,
  AccessibleSidebarItem,
  useKeyboardNavigation,
  KEY_CODES,
  ARIA_ROLES
} from './index';
import { 
  HomeIcon, 
  UsersIcon, 
  ChartBarIcon,
  CogIcon,
  BellIcon
} from '@heroicons/react/24/outline';

/**
 * AccessibilityDemo Component
 * Demonstrates all accessibility features and keyboard navigation patterns
 */
export const AccessibilityDemo: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  // Sample data for charts and tables
  const chartData = [
    { name: 'Q1', value: 400 },
    { name: 'Q2', value: 300 },
    { name: 'Q3', value: 300 },
    { name: 'Q4', value: 200 }
  ];

  const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Student' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Student' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Student' }
  ];

  // Handle search
  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    setSearchQuery(query);
  };

  // Handle table row selection
  const handleRowClick = (id: number) => {
    setSelectedRow(selectedRow === id ? null : id);
  };

  // Keyboard navigation hook for demo section
  const { containerRef } = useKeyboardNavigation({
    onEscape: () => console.log('Escape pressed in demo section'),
    onEnter: () => console.log('Enter pressed in demo section')
  });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Accessibility & Keyboard Navigation Demo
        </h1>
        <p className="text-slate-600">
          This demonstrates consistent patterns for keyboard and ARIA support across the application.
        </p>
      </div>

      {/* Keyboard Navigation Demo */}
      <div 
        ref={containerRef}
        className="bg-white rounded-lg border border-slate-200 p-6"
        tabIndex={0}
      >
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Keyboard Navigation Demo
        </h2>
        <p className="text-slate-600 mb-4">
          This section demonstrates keyboard navigation. Press Escape or Enter to see console logs.
        </p>
        <div className="space-y-2 text-sm text-slate-700">
          <p>• Press <kbd className="px-2 py-1 bg-slate-100 rounded text-xs">Escape</kbd> to see escape handling</p>
          <p>• Press <kbd className="px-2 py-1 bg-slate-100 rounded text-xs">Enter</kbd> to see enter handling</p>
          <p>• Use <kbd className="px-2 py-1 bg-slate-100 rounded text-xs">Tab</kbd> to navigate between focusable elements</p>
        </div>
      </div>

      {/* Accessible Buttons Demo */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Accessible Buttons
        </h2>
        <p className="text-slate-600 mb-6">
          All clickable items are proper buttons with clear labels and focus styles.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AccessibleButton
            onClick={() => console.log('Primary button clicked')}
            variant="primary"
            ariaLabel="Primary action button"
            testId="demo-primary-btn"
          >
            Primary Button
          </AccessibleButton>
          
          <AccessibleButton
            onClick={() => console.log('Secondary button clicked')}
            variant="secondary"
            ariaLabel="Secondary action button"
            testId="demo-secondary-btn"
          >
            Secondary Button
          </AccessibleButton>
          
          <AccessibleButton
            onClick={() => console.log('Ghost button clicked')}
            variant="ghost"
            ariaLabel="Ghost action button"
            testId="demo-ghost-btn"
          >
            Ghost Button
          </AccessibleButton>
          
          <AccessibleButton
            onClick={() => console.log('Danger button clicked')}
            variant="danger"
            ariaLabel="Danger action button"
            testId="demo-danger-btn"
          >
            Danger Button
          </AccessibleButton>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <AccessibleButton
            onClick={() => console.log('Small button clicked')}
            size="sm"
            icon={HomeIcon}
            ariaLabel="Home navigation button"
            testId="demo-small-btn"
          >
            Small Button
          </AccessibleButton>
          
          <AccessibleButton
            onClick={() => console.log('Medium button clicked')}
            size="md"
            icon={UsersIcon}
            ariaLabel="Users navigation button"
            testId="demo-medium-btn"
          >
            Medium Button
          </AccessibleButton>
          
          <AccessibleButton
            onClick={() => console.log('Large button clicked')}
            size="lg"
            icon={ChartBarIcon}
            ariaLabel="Charts navigation button"
            testId="demo-large-btn"
          >
            Large Button
          </AccessibleButton>
        </div>
      </div>

      {/* Accessible Charts Demo */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Accessible Charts
        </h2>
        <p className="text-slate-600 mb-6">
          Charts include aria-label and concise captions for screen readers.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AccessibleChart
            ariaLabel="Quarterly performance data showing Q1: 400, Q2: 300, Q3: 300, Q4: 200"
            caption="Quarterly Performance Metrics"
            testId="demo-chart-1"
          >
            <div className="h-48 bg-slate-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-700">Chart Visualization</div>
                <div className="text-sm text-slate-500 mt-2">Interactive chart would go here</div>
              </div>
            </div>
          </AccessibleChart>
          
          <AccessibleChart
            ariaLabel="Student enrollment trends over time"
            caption="Student Enrollment Trends"
            testId="demo-chart-2"
          >
            <div className="h-48 bg-slate-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-700">Trend Chart</div>
                <div className="text-sm text-slate-500 mt-2">Line chart would go here</div>
              </div>
            </div>
          </AccessibleChart>
        </div>
      </div>

      {/* Accessible Search Demo */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Accessible Search
        </h2>
        <p className="text-slate-600 mb-6">
          Enter triggers search in header, Escape clears the input.
        </p>
        
        <div className="max-w-md">
          <AccessibleSearch
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            placeholder="Search students..."
            ariaLabel="Search students by name or email"
            testId="demo-search"
          />
        </div>
        
        <div className="mt-4 text-sm text-slate-600">
          <p>• Press <kbd className="px-2 py-1 bg-slate-100 rounded text-xs">Enter</kbd> to search</p>
          <p>• Press <kbd className="px-2 py-1 bg-slate-100 rounded text-xs">Escape</kbd> to clear</p>
        </div>
      </div>

      {/* Accessible Table Demo */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Accessible Table
        </h2>
        <p className="text-slate-600 mb-6">
          Table rows don't steal focus. Open action is a proper link.
        </p>
        
        <AccessibleTable
          ariaLabel="Student information table"
          caption="Student Directory"
          testId="demo-table"
        >
          <AccessibleTableHead>
            <AccessibleTableRow isHeader>
              <AccessibleTableCell isHeader scope="col">ID</AccessibleTableCell>
              <AccessibleTableCell isHeader scope="col">Name</AccessibleTableCell>
              <AccessibleTableCell isHeader scope="col">Email</AccessibleTableCell>
              <AccessibleTableCell isHeader scope="col">Role</AccessibleTableCell>
              <AccessibleTableCell isHeader scope="col">Actions</AccessibleTableCell>
            </AccessibleTableRow>
          </AccessibleTableHead>
          
          <AccessibleTableBody>
            {tableData.map((student) => (
              <AccessibleTableRow
                key={student.id}
                isClickable
                onClick={() => handleRowClick(student.id)}
                ariaSelected={selectedRow === student.id}
                testId={`demo-table-row-${student.id}`}
              >
                <AccessibleTableCell>{student.id}</AccessibleTableCell>
                <AccessibleTableCell>{student.name}</AccessibleTableCell>
                <AccessibleTableCell>{student.email}</AccessibleTableCell>
                <AccessibleTableCell>{student.role}</AccessibleTableCell>
                <AccessibleTableCell>
                  <AccessibleTableActions testId={`demo-table-actions-${student.id}`}>
                    <AccessibleTableAction
                      href={`/students/${student.id}`}
                      ariaLabel={`View details for ${student.name}`}
                      testId={`demo-table-view-${student.id}`}
                    >
                      View
                    </AccessibleTableAction>
                    <AccessibleTableAction
                      href={`/students/${student.id}/edit`}
                      ariaLabel={`Edit ${student.name}`}
                      variant="secondary"
                      testId={`demo-table-edit-${student.id}`}
                    >
                      Edit
                    </AccessibleTableAction>
                  </AccessibleTableActions>
                </AccessibleTableCell>
              </AccessibleTableRow>
            ))}
          </AccessibleTableBody>
        </AccessibleTable>
      </div>

      {/* Accessible Sidebar Demo */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Accessible Sidebar
        </h2>
        <p className="text-slate-600 mb-6">
          Escape closes off-canvas sidebar on small screens.
        </p>
        
        <AccessibleSidebarTrigger
          onClick={() => setIsSidebarOpen(true)}
          ariaLabel="Open navigation sidebar"
          testId="demo-sidebar-trigger"
          icon={CogIcon}
        >
          Open Sidebar
        </AccessibleSidebarTrigger>
        
        <AccessibleSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          title="Navigation Menu"
          testId="demo-sidebar"
          size="md"
        >
          <AccessibleSidebarSection title="Main Navigation" testId="demo-sidebar-main">
            <AccessibleSidebarItem
              href="/"
              isActive={true}
              icon={HomeIcon}
              testId="demo-sidebar-home"
            >
              Dashboard
            </AccessibleSidebarItem>
            
            <AccessibleSidebarItem
              href="/students"
              icon={UsersIcon}
              testId="demo-sidebar-students"
            >
              Students
            </AccessibleSidebarItem>
            
            <AccessibleSidebarItem
              href="/analytics"
              icon={ChartBarIcon}
              testId="demo-sidebar-analytics"
            >
              Analytics
            </AccessibleSidebarItem>
          </AccessibleSidebarSection>
          
          <AccessibleSidebarSection title="Settings" testId="demo-sidebar-settings">
            <AccessibleSidebarItem
              onClick={() => console.log('Notifications clicked')}
              icon={BellIcon}
              testId="demo-sidebar-notifications"
            >
              Notifications
            </AccessibleSidebarItem>
            
            <AccessibleSidebarItem
              onClick={() => console.log('Settings clicked')}
              icon={CogIcon}
              testId="demo-sidebar-settings-btn"
            >
              Settings
            </AccessibleSidebarItem>
          </AccessibleSidebarSection>
        </AccessibleSidebar>
        
        <div className="mt-4 text-sm text-slate-600">
          <p>• Press <kbd className="px-2 py-1 bg-slate-100 rounded text-xs">Escape</kbd> to close sidebar</p>
          <p>• Use <kbd className="px-2 py-1 bg-slate-100 rounded text-xs">Tab</kbd> to navigate within sidebar</p>
        </div>
      </div>

      {/* Focus Styles Demo */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Focus Styles
        </h2>
        <p className="text-slate-600 mb-6">
          Focus styles are visible using Tailwind ring utilities.
        </p>
        
        <div className="space-y-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Focus me (Blue ring)
          </button>
          
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
            Focus me (Green ring)
          </button>
          
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
            Focus me (Red ring)
          </button>
        </div>
        
        <div className="mt-4 text-sm text-slate-600">
          <p>• Use <kbd className="px-2 py-1 bg-slate-100 rounded text-xs">Tab</kbd> to see focus styles</p>
          <p>• All interactive elements have visible focus indicators</p>
        </div>
      </div>

      {/* Accessibility Features Summary */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">
          Accessibility Features Implemented
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Keyboard Navigation</h3>
            <ul className="space-y-2 text-blue-800">
              <li>• <strong>Enter:</strong> Triggers search and button actions</li>
              <li>• <strong>Escape:</strong> Closes modals and sidebars</li>
              <li>• <strong>Tab:</strong> Navigates between focusable elements</li>
              <li>• <strong>Arrow keys:</strong> Navigation within components</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-3">ARIA & Screen Readers</h3>
            <ul className="space-y-2 text-blue-800">
              <li>• <strong>Labels:</strong> Clear, descriptive aria-labels</li>
              <li>• <strong>Roles:</strong> Proper semantic roles for all components</li>
              <li>• <strong>States:</strong> ARIA states for interactive elements</li>
              <li>• <strong>Captions:</strong> Descriptive text for charts and tables</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityDemo; 