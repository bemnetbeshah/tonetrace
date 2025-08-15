import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  BellIcon,
  UserCircleIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';

interface TopHeaderProps {
  onToggleSidebar: () => void;
  onSearchSubmit: (query: string) => void;
}

/**
 * TopHeader Component
 * Header with search, notifications, and user menu
 */
export const TopHeader: React.FC<TopHeaderProps> = ({
  onToggleSidebar,
  onSearchSubmit
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery.trim());
      setSearchQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowUserMenu(false);
    }
  };

  return (
    <div className="flex items-center justify-between w-full">
      {/* Left Section - Mobile Menu Button */}
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors md:hidden"
          aria-label="Toggle sidebar menu"
          data-testid="mobile-menu-toggle"
        >
          <Bars3Icon className="h-6 w-6 text-gray-600" />
        </button>
        
        {/* Breadcrumb or Page Title */}
        <div className="ml-4">
          <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-md mx-8 hidden md:block">
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search analysis, reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              aria-label="Search"
            />
          </div>
        </form>
      </div>

      {/* Right Section - Notifications and User Menu */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button
          className="p-2 rounded-md hover:bg-gray-100 transition-colors relative"
          aria-label="View notifications"
        >
          <BellIcon className="h-6 w-6 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            onKeyDown={handleKeyDown}
            className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="User menu"
            aria-expanded={showUserMenu}
            aria-haspopup="true"
          >
            <UserCircleIcon className="h-8 w-8 text-gray-600" />
            <span className="hidden md:block text-sm font-medium text-gray-700">
              Admin User
            </span>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div 
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
            >
              <a
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Your Profile
              </a>
              <a
                href="/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Settings
              </a>
              <div className="border-t border-gray-100"></div>
              <button
                onClick={() => {
                  // TODO: Implement logout
                  console.log('Logout clicked');
                  setShowUserMenu(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 