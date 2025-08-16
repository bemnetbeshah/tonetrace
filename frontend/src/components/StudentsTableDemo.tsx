import { useState } from 'react';
import StudentsTable from './StudentsTable';

export default function StudentsTableDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [demoScenario, setDemoScenario] = useState<'normal' | 'loading' | 'empty'>('normal');

  const sampleStudents = [
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
    },
    {
      id: '4',
      name: 'David Wilson',
      email: 'david.wilson@university.edu',
      lastSubmissionAt: '2024-02-12T14:15:00Z'
    },
    {
      id: '5',
      name: 'Eva Brown',
      email: 'eva.brown@university.edu',
      lastSubmissionAt: '2024-02-11T11:00:00Z'
    },
    {
      id: '6',
      name: 'Frank Miller',
      email: 'frank.miller@university.edu',
      lastSubmissionAt: '2024-02-10T16:30:00Z'
    },
    {
      id: '7',
      name: 'Grace Lee',
      email: 'grace.lee@university.edu',
      lastSubmissionAt: '2024-02-09T13:45:00Z'
    },
    {
      id: '8',
      name: 'Henry Taylor',
      email: 'henry.taylor@university.edu',
      lastSubmissionAt: '2024-02-08T08:20:00Z'
    },
    {
      id: '9',
      name: 'Ivy Chen',
      email: 'ivy.chen@university.edu',
      lastSubmissionAt: '2024-02-07T12:10:00Z'
    },
    {
      id: '10',
      name: 'Jack Anderson',
      email: 'jack.anderson@university.edu',
      lastSubmissionAt: '2024-02-06T17:25:00Z'
    },
    {
      id: '11',
      name: 'Kate Rodriguez',
      email: 'kate.rodriguez@university.edu',
      lastSubmissionAt: '2024-02-05T10:50:00Z'
    },
    {
      id: '12',
      name: 'Liam Thompson',
      email: 'liam.thompson@university.edu',
      lastSubmissionAt: '2024-02-04T14:35:00Z'
    }
  ];

  const emptyStudents: typeof sampleStudents = [];

  const handleScenarioChange = (scenario: typeof demoScenario) => {
    setDemoScenario(scenario);
    if (scenario === 'loading') {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 2000);
    }
  };

  const getCurrentStudents = () => {
    switch (demoScenario) {
      case 'empty':
        return emptyStudents;
      case 'loading':
        return sampleStudents;
      default:
        return sampleStudents;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">StudentsTable Component Demo</h2>
        <p className="text-gray-600 mb-6">
          Tabular view of all students with search, pagination, and accessibility features.
        </p>
      </div>

      {/* Demo Controls */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-3">Demo Scenarios:</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => handleScenarioChange('normal')}
            className={`px-3 py-2 rounded text-sm font-medium ${
              demoScenario === 'normal'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Normal Data
          </button>
          <button
            onClick={() => handleScenarioChange('loading')}
            className={`px-3 py-2 rounded text-sm font-medium ${
              demoScenario === 'loading'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Loading State
          </button>
          <button
            onClick={() => handleScenarioChange('empty')}
            className={`px-3 py-2 rounded text-sm font-medium ${
              demoScenario === 'empty'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Empty State
          </button>
        </div>
      </div>

      {/* Component Demo */}
      <StudentsTable 
        students={getCurrentStudents()}
        loading={isLoading}
      />

      {/* Features Documentation */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Component Features:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
          <li>Tabular view with Name, Email, Last submission, and Actions columns</li>
          <li>Client-side search by name or email substring</li>
          <li>Client-side pagination with 10 items per page</li>
          <li>Loading state with 6 skeleton rows</li>
          <li>Empty state with appropriate messaging</li>
          <li>Accessibility: role="table", scope="col", role="row"</li>
          <li>Test IDs for automated testing</li>
          <li>Responsive design with overflow handling</li>
          <li>Integration ready for api.listStudents() and GET /students</li>
        </ul>
      </div>

      {/* Usage Example */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Usage Example:</h3>
        <pre className="text-sm text-green-800 bg-green-100 p-3 rounded overflow-x-auto">
{`import StudentsTable from './StudentsTable';

const students = await api.listStudents();

<StudentsTable 
  students={students}
  loading={isLoading}
/>`}
        </pre>
      </div>

      {/* Test Instructions */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Testing Instructions:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
          <li>Try searching for different names or email addresses</li>
          <li>Navigate through pagination (12 students = 2 pages)</li>
          <li>Test the loading state scenario</li>
          <li>Verify empty state with no search results</li>
          <li>Click "Open" links to test navigation</li>
          <li>Check accessibility with screen reader tools</li>
        </ul>
      </div>
    </div>
  );
} 