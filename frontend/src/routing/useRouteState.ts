import { useState, useEffect } from 'react';
import { getPageTitle, getRouteByPathname } from './routes';

/**
 * Custom hook for managing route state and page titles
 * Provides reactive page title updates based on current route
 */
export const useRouteState = () => {
  const [currentPathname, setCurrentPathname] = useState(window.location.pathname);
  const [currentTitle, setCurrentTitle] = useState(getPageTitle(currentPathname));
  const [currentRoute, setCurrentRoute] = useState(getRouteByPathname(currentPathname));

  // Update route state when pathname changes
  useEffect(() => {
    const handleRouteChange = () => {
      const pathname = window.location.pathname;
      setCurrentPathname(pathname);
      setCurrentTitle(getPageTitle(pathname));
      setCurrentRoute(getRouteByPathname(pathname));
    };

    // Listen for popstate events (browser back/forward)
    window.addEventListener('popstate', handleRouteChange);

    // Initial setup
    handleRouteChange();

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Function to manually update route (for programmatic navigation)
  const updateRoute = (pathname: string) => {
    window.history.pushState({}, '', pathname);
    setCurrentPathname(pathname);
    setCurrentTitle(getPageTitle(pathname));
    setCurrentRoute(getRouteByPathname(pathname));
  };

  // Function to navigate to a route
  const navigateTo = (path: string) => {
    updateRoute(path);
  };

  return {
    currentPathname,
    currentTitle,
    currentRoute,
    updateRoute,
    navigateTo
  };
};

export default useRouteState; 