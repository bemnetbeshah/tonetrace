import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RootLayout } from './components/layout/RootLayout';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { StudentDetail } from './pages/StudentDetail';
import AssignmentsPage from './pages/AssignmentsPage';
import { ComingSoon } from './pages/ComingSoon';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="students/:id" element={<StudentDetail />} />
        <Route path="assignments" element={<AssignmentsPage />} />
        <Route path="coming-soon" element={<ComingSoon />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
