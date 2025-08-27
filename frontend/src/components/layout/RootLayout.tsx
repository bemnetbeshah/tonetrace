import React, { useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { TopHeader } from './TopHeader';

/**
 * RootLayout Component
 * Main layout wrapper with header and content areas (no sidebar)
 */
export const RootLayout: React.FC = () => {
  const handleSearchSubmit = useCallback((query: string) => {
    // TODO: Implement client-side search navigation
    console.log('Search submitted:', query);
  }, []);

  return (
    <div 
      className="min-h-screen bg-surfaceAlt"
      data-testid="root-layout"
    >
      {/* Main Content Area */}
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header 
          className="h-32 bg-white shadow flex items-center justify-between px-6 border-b border-gray-200"
          role="banner"
          data-testid="layout-header"
        >
          <TopHeader 
            onSearchSubmit={handleSearchSubmit}
          />
        </header>

        {/* Content */}
        <main 
          className="flex-1 bg-white p-6 mt-3"
          role="main"
          data-testid="layout-content"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RootLayout; 