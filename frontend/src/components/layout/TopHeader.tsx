import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  UserCircleIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import { useRouteState } from '../../routing';

interface TopHeaderProps {
  onToggleSidebar: () => void;
  onSearchSubmit: (query: string) => void;
}

/**
 * TopHeader Component
 * Page title, search, and profile stub
 */
export const TopHeader: React.FC<TopHeaderProps> = ({
  onToggleSidebar,
  onSearchSubmit
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Use the routing hook for reactive page titles
  const { currentTitle } = useRouteState();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery.trim());
      setSearchQuery('');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Client filter on current list - no network request
    if (e.target.value.trim()) {
      onSearchSubmit(e.target.value.trim());
    }
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  return (
    <div className="flex items-center justify-between w-full">
      {/* Left Section - Mobile Menu Button and Title */}
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors md:hidden"
          aria-label="Toggle sidebar menu"
          data-testid="mobile-menu-toggle"
        >
          <Bars3Icon className="h-6 w-6 text-gray-600" />
        </button>
        
        {/* Page Title - hidden on small screens when search is focused */}
        <div className={`ml-4 transition-opacity duration-200 ${
          isSearchFocused ? 'md:hidden' : 'block'
        }`}>
          <h2 
            className="text-lg font-semibold text-gray-900"
            data-testid="header-title"
          >
            {currentTitle}
          </h2>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-md mx-8 hidden md:block">
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              role="searchbox"
              aria-label="Search"
              data-testid="header-search"
            />
          </div>
        </form>
      </div>

      {/* Right Section - Profile Avatar */}
      <div className="flex items-center">
        <button
          onClick={handleProfileClick}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          aria-label="Profile menu"
          data-testid="header-avatar"
        >
          <UserCircleIcon className="h-6 w-6 text-gray-600" />
        </button>

        {/* Simple Profile Stub Menu */}
        {showProfileMenu && (
          <div 
            className="absolute right-6 top-16 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
            role="menu"
            aria-orientation="vertical"
          >
            <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
              Profile Menu
            </div>
            <button
              onClick={() => setShowProfileMenu(false)}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Close Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 