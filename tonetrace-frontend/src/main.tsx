import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import RootLayout from './layout/RootLayout';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import StudentDetailPage from './pages/StudentDetailPage';
import AssignmentsPage from './pages/AssignmentsPage';

const router = createBrowserRouter([
  { path:'/', element:<RootLayout/>, children:[
    { index:true, element:<DashboardPage/> },
    { path:'students', element:<StudentsPage/> },
    { path:'students/:id', element:<StudentDetailPage/> },
    { path:'assignments', element:<AssignmentsPage/> }
  ]}
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
