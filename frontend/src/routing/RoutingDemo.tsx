import React from 'react';
import { useRouteState, ROUTES, ROUTE_PATHS, ROUTE_TITLES } from './index';

/**
 * RoutingDemo Component
 * Demonstrates the routing system and page title functionality
 */
export const RoutingDemo: React.FC = () => {
  const { currentPathname, currentTitle, currentRoute, navigateTo } = useRouteState();

  const handleNavigation = (path: string) => {
    navigateTo(path);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Routing System Demo
        </h1>
        <p className="text-slate-600">
          This demonstrates the centralized routing system and how page titles update automatically.
        </p>
      </div>

      {/* Current Route Information */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Current Route Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium text-slate-700">Current Path:</span>
              <code className="bg-slate-100 px-2 py-1 rounded text-sm">
                {currentPathname}
              </code>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-slate-700">Page Title:</span>
              <span className="text-slate-900">{currentTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-slate-700">Route Element:</span>
              <code className="bg-slate-100 px-2 py-1 rounded text-sm">
                {currentRoute?.element || 'Unknown'}
              </code>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium text-slate-700">Route Type:</span>
              <span className="text-slate-900">
                {currentRoute?.path.includes(':') ? 'Dynamic' : 'Static'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-slate-700">Has Icon:</span>
              <span className="text-slate-900">
                {currentRoute?.icon ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-slate-700">Test ID:</span>
              <code className="bg-slate-100 px-2 py-1 rounded text-sm">
                {currentRoute?.testId || 'N/A'}
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Route Navigation */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Route Navigation
        </h2>
        <p className="text-slate-600 mb-6">
          Click on any route below to navigate and see the page title update automatically:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ROUTES.map((route) => (
            <button
              key={route.path}
              onClick={() => handleNavigation(route.path)}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200 text-left
                ${currentPathname === route.path || 
                  (route.path.includes(':') && currentPathname.startsWith(route.path.split('/:')[0]))
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }
              `}
            >
              <div className="flex items-center gap-3 mb-2">
                {route.icon && (
                  <route.icon className="w-5 h-5 text-slate-600" />
                )}
                <span className="font-medium text-slate-900">
                  {route.title}
                </span>
              </div>
              <code className="text-xs text-slate-500 block">
                {route.path}
              </code>
              <div className="text-xs text-slate-600 mt-1">
                {route.element}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Route Constants */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Route Constants
        </h2>
        <p className="text-slate-600 mb-6">
          Predefined route paths and titles for consistent usage across the application:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Route Paths</h3>
            <div className="space-y-2">
              {Object.entries(ROUTE_PATHS).map(([key, path]) => (
                <div key={key} className="flex justify-between items-center">
                  <code className="text-sm font-medium text-slate-700">{key}:</code>
                  <code className="text-sm bg-slate-100 px-2 py-1 rounded">{path}</code>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Route Titles</h3>
            <div className="space-y-2">
              {Object.entries(ROUTE_TITLES).map(([key, title]) => (
                <div key={key} className="flex justify-between items-center">
                  <code className="text-sm font-medium text-slate-700">{key}:</code>
                  <span className="text-sm text-slate-900">{title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Integration Example */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">
          Integration Example
        </h2>
        <p className="text-blue-800 mb-4">
          The TopHeader component automatically reads this routing map to set the page title:
        </p>
        
        <div className="bg-blue-100 rounded-lg p-4 font-mono text-sm text-blue-900">
          <pre className="whitespace-pre-wrap">
{`// In TopHeader.tsx
import { useRouteState } from '../../routing';

export const TopHeader = () => {
  const { currentTitle } = useRouteState();
  
  return (
    <h2 className="text-lg font-semibold text-gray-900">
      {currentTitle}
    </h2>
  );
};`}
          </pre>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Routing System Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Core Features</h3>
            <ul className="space-y-2 text-slate-700">
              <li>• Single source for routes and page titles</li>
              <li>• Automatic page title updates</li>
              <li>• Dynamic route support (e.g., /students/:id)</li>
              <li>• Centralized navigation configuration</li>
              <li>• Type-safe route definitions</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Benefits</h3>
            <ul className="space-y-2 text-slate-700">
              <li>• Consistent page titles across the app</li>
              <li>• Easy route management and updates</li>
              <li>• Reusable navigation components</li>
              <li>• Simplified routing logic</li>
              <li>• Better developer experience</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutingDemo; 