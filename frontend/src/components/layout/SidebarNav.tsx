import React from 'react';
import { 
  HomeIcon, 
  UsersIcon, 
  ClipboardDocumentListIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface SidebarNavProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
}

/**
 * SidebarNav Component
 * Primary navigation sidebar with collapsible behavior
 */
export const SidebarNav: React.FC<SidebarNavProps> = ({ 
  collapsed, 
  onToggleSidebar 
}) => {
  // Navigation items matching the specification
  const navigationItems = [
    { 
      icon: HomeIcon, 
      label: 'Dashboard', 
      to: '/', 
      testId: 'nav-dashboard' 
    },
    { 
      icon: UsersIcon, 
      label: 'Students', 
      to: '/students', 
      testId: 'nav-students' 
    },
    { 
      icon: ClipboardDocumentListIcon, 
      label: 'Assignments', 
      to: '/assignments', 
      testId: 'nav-assignments' 
    },
  ];

  // Simple route matching logic - can be enhanced with React Router later
  const isActiveRoute = (path: string) => {
    // For now, just check if we're on the root path for dashboard
    // This will be enhanced when proper routing is implemented
    return path === '/' && window.location.pathname === '/';
  };

  return (
    <div className={`h-full flex flex-col ${collapsed ? 'sidebar-collapsed' : ''} sidebar-container`}>
      {/* Header with Toggle Button */}
      <div className="flex items-center justify-between mb-8">
        {!collapsed && (
          <h1 className="text-xl font-bold text-white">ToneTrace</h1>
        )}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md hover:bg-[color:var(--sidebarHover)] transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          data-testid="sidebar-toggle"
        >
          {collapsed ? (
            <Bars3Icon className="h-5 w-5 text-white" />
          ) : (
            <XMarkIcon className="h-5 w-5 text-white" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1" role="navigation">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.to);
            
            return (
              <li key={item.label}>
                <a
                  href={item.to}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded hover:bg-[color:var(--sidebarHover)]
                    ${isActive ? 'sidebar-active' : 'text-gray-300 hover:text-white'}
                    ${collapsed ? 'justify-center' : 'justify-start'}
                    transition-colors
                  `}
                  aria-current={isActive ? 'page' : undefined}
                  data-testid={item.testId}
                >
                  {/* Active state left strip */}
                  {isActive && (
                    <div className="sidebar-active-strip"></div>
                  )}
                  
                  {/* Icon */}
                  <Icon className="h-5 w-5 sidebar-icon" />
                  
                  {/* Label - hidden at <= 360px when collapsed */}
                  {!collapsed && (
                    <span className="sidebar-label">
                      {item.label}
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="mt-auto pt-4 border-t border-gray-700">
          <div className="flex items-center px-3 py-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">TB</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">ToneBot</p>
              <p className="text-xs text-gray-400">AI Assistant</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 