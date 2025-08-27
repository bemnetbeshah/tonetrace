import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, ChevronDown, User, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { cn } from '../lib/ui';

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Students', href: '/students' },
  { name: 'Assignments', href: '/assignments' },
  { name: 'Reports', href: '/reports' },
  { name: 'Settings', href: '/settings' },
];

export const Header: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-brand-600">ToneTrace</h1>
              </div>
            </Link>
            
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    location.pathname === item.href
                      ? 'text-brand-600 bg-brand-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side - Notifications and Profile */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-brand-700">JD</span>
                </div>
                <span className="hidden md:block text-sm font-medium">Jane Doe</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <SettingsIcon className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                  <hr className="my-1" />
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
