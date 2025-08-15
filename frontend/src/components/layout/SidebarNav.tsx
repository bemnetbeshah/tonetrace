import React from 'react';
import { 
  HomeIcon, 
  ChartBarIcon, 
  DocumentTextIcon, 
  CogIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface SidebarNavProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
}

/**
 * SidebarNav Component
 * Navigation sidebar with collapsible behavior
 */
export const SidebarNav: React.FC<SidebarNavProps> = ({ 
  collapsed, 
  onToggleSidebar 
}) => {
  const navigationItems = [
    { name: 'Dashboard', icon: HomeIcon, href: '/', current: true },
    { name: 'Analysis', icon: ChartBarIcon, href: '/analysis', current: false },
    { name: 'Reports', icon: DocumentTextIcon, href: '/reports', current: false },
    { name: 'Settings', icon: CogIcon, href: '/settings', current: false },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header with Toggle Button */}
      <div className="flex items-center justify-between mb-8">
        {!collapsed && (
          <h1 className="text-xl font-bold text-white">ToneTrace</h1>
        )}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md hover:bg-sidebar-hover transition-colors"
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
      <nav className="flex-1">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={`
                    flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${item.current 
                      ? 'bg-primary text-white' 
                      : 'text-gray-300 hover:bg-sidebar-hover hover:text-white'
                    }
                    ${collapsed ? 'justify-center' : 'justify-start'}
                  `}
                  aria-current={item.current ? 'page' : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && (
                    <span className="ml-3">{item.name}</span>
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