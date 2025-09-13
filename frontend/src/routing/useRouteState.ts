import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getPageTitle, getRouteByPathname } from './routes';

/**
 * Custom hook for managing route state and page titles
 * Provides reactive page title updates based on current route
 */
export const useRouteState = () => {
  const location = useLocation();
  const [currentPathname, setCurrentPathname] = useState(location.pathname);
  const [currentTitle, setCurrentTitle] = useState(getPageTitle(location.pathname));
  const [currentRoute, setCurrentRoute] = useState(getRouteByPathname(location.pathname));

  // Update route state when pathname changes
  useEffect(() => {
    const pathname = location.pathname;
    setCurrentPathname(pathname);
    setCurrentTitle(getPageTitle(pathname));
    setCurrentRoute(getRouteByPathname(pathname));
  }, [location.pathname]);

  return {
    currentPathname,
    currentTitle,
    currentRoute
  };
};

export default useRouteState; 