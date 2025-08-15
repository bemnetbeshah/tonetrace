import React, { useState, useCallback } from 'react';
import { SidebarNav } from './SidebarNav';
import { TopHeader } from './TopHeader';
import { OutletRouter } from './OutletRouter';

/**
 * RootLayout Component
 * Main layout wrapper with sidebar, header, and content areas
 */
export const RootLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleToggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const handleSearchSubmit = useCallback((query: string) => {
    // TODO: Implement client-side search navigation
    console.log('Search submitted:', query);
  }, []);

  return (
    <div 
      className="min-h-screen bg-surfaceAlt"
      data-testid="root-layout"
      style={{
        display: 'grid',
        gridTemplateColumns: sidebarCollapsed ? '64px 1fr' : '240px 1fr',
        transition: 'grid-template-columns 300ms ease-in-out'
      }}
    >
      {/* Sidebar */}
      <aside 
        className="bg-sidebar text-white p-4 h-screen overflow-hidden"
        aria-label="Navigation"
        data-testid="layout-sidebar"
      >
        <SidebarNav 
          collapsed={sidebarCollapsed}
          onToggleSidebar={handleToggleSidebar}
        />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header 
          className="h-16 bg-white shadow flex items-center justify-between px-6 border-l border-gray-200"
          role="banner"
          data-testid="layout-header"
        >
          <TopHeader 
            onToggleSidebar={handleToggleSidebar}
            onSearchSubmit={handleSearchSubmit}
          />
        </header>

        {/* Content */}
        <main 
          className="flex-1 p-6 bg-white border-l border-gray-200"
          role="main"
          data-testid="layout-content"
        >
          <OutletRouter />
        </main>
      </div>
    </div>
  );
};

export default RootLayout; 