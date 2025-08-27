import React, { useState } from 'react';
import { 
  UserCircleIcon,
  HomeIcon,
  UsersIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { useRouteState, isRouteActive } from '../../routing';

interface TopHeaderProps {
  onSearchSubmit: (query: string) => void;
}

/**
 * TopHeader Component
 * Navigation and profile stub
 */
export const TopHeader: React.FC<TopHeaderProps> = ({
  onSearchSubmit
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Use the routing hook for current pathname
  const { currentPathname } = useRouteState();

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  // Navigation items
  const navigationItems = [
    { label: 'Class Dashboard', to: '/dashboard', icon: HomeIcon, testId: 'nav-dashboard' },
    { label: 'Students', to: '/students', icon: UsersIcon, testId: 'nav-students' },
    { label: 'Assignments', to: '/assignments', icon: ClipboardDocumentListIcon, testId: 'nav-assignments' }
  ];

  return (
    <div className="flex items-center justify-between w-full h-full">
      {/* Left Section - Navigation */}
      <div className="flex items-center justify-center h-full">
        {/* Navigation Buttons */}
        <nav className="flex items-center space-x-4" role="navigation">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = isRouteActive(item.to, currentPathname);
            
            return (
              <a
                key={item.label}
                href={item.to}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
                  ${isActive 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
                data-testid={item.testId}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </div>

      {/* Right Section - Profile Avatar */}
      <div className="flex items-center justify-center h-full">
        <button
          onClick={handleProfileClick}
          className="flex items-center justify-center rounded-full bg-red-300 hover:bg-red-400 transition-colors border-2 border-red-500"
          style={{ width: '56px', height: '56px', position: 'relative', top: '16px' }}
          aria-label="Profile menu"
          data-testid="header-avatar"
        >
          <UserCircleIcon className="text-red-600" style={{ width: '32px', height: '32px' }} />
        </button>

        {/* Simple Profile Stub Menu */}
        {showProfileMenu && (
          <div 
            className="absolute right-6 top-20 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border-2 border-gray-200"
            role="menu"
            aria-orientation="vertical"
          >
            <div className="px-4 py-3 text-sm font-medium text-gray-700 border-b border-gray-200 bg-gray-50">
              Profile Menu
            </div>
            <button
              onClick={() => setShowProfileMenu(false)}
              className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Close Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 