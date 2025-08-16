// Export all routing configuration and utilities
export * from './routes';

// Re-export commonly used items for convenience
export {
  ROUTES,
  NAVIGATION_ITEMS,
  ROUTE_PATHS,
  ROUTE_TITLES,
  getRouteByPathname,
  getPageTitle,
  isRouteActive
} from './routes';

// Export the route state hook
export { useRouteState } from './useRouteState';

// Export types
export type { RouteConfig, NavigationItem } from './routes'; 