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
      className="min-h-screen grid bg-surfaceAlt"
      data-testid="root-layout"
    >
      {/* Sidebar */}
      <aside 
        className={`
          bg-sidebar text-white p-4 transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'w-16' : 'w-60'}
          md:relative md:translate-x-0
          ${sidebarCollapsed ? 'fixed left-0 top-0 h-full z-40' : 'fixed left-0 top-0 h-full z-40 md:relative'}
        `}
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
          className="h-16 bg-white shadow flex items-center justify-between px-6"
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
          className="flex-1 p-6"
          role="main"
          data-testid="layout-content"
        >
          <OutletRouter />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={handleToggleSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default RootLayout; 