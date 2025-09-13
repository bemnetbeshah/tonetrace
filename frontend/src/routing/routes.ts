import { HomeIcon, UsersIcon, ClipboardDocumentListIcon, ClockIcon } from '@heroicons/react/24/outline';

// Route configuration interface
export interface RouteConfig {
  path: string;
  title: string;
  element: string;
  icon?: React.ComponentType<{ className?: string }>;
  testId?: string;
  isActive?: (pathname: string) => boolean;
}

// Navigation item interface
export interface NavigationItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  to: string;
  testId: string;
}

// Centralized route configuration
export const ROUTES: RouteConfig[] = [
  {
    path: '/dashboard',
    title: 'Class Dashboard',
    element: 'DashboardPage',
    icon: HomeIcon,
    testId: 'nav-dashboard',
    isActive: (pathname: string) => {
      const normalizedPathname = pathname.replace(/\/$/, '') || '/';
      return normalizedPathname === '/dashboard' || normalizedPathname === '/';
    }
  },
  {
    path: '/students',
    title: 'Students',
    element: 'StudentsPage',
    icon: UsersIcon,
    testId: 'nav-students',
    isActive: (pathname: string) => pathname === '/students'
  },
  {
    path: '/students/:id',
    title: 'Student Detail',
    element: 'StudentDetailPage',
    icon: UsersIcon,
    testId: 'nav-student-detail',
    isActive: (pathname: string) => pathname.startsWith('/students/') && pathname !== '/students'
  },
  {
    path: '/assignments',
    title: 'Assignments',
    element: 'AssignmentsPage',
    icon: ClipboardDocumentListIcon,
    testId: 'nav-assignments',
    isActive: (pathname: string) => pathname === '/assignments'
  },
  {
    path: '/coming-soon',
    title: 'Coming Soon',
    element: 'ComingSoonPage',
    icon: ClockIcon,
    testId: 'nav-coming-soon',
    isActive: (pathname: string) => pathname === '/coming-soon'
  }
];

// Navigation items for sidebar (excluding dynamic routes like student detail)
export const NAVIGATION_ITEMS: NavigationItem[] = ROUTES
  .filter(route => !route.path.includes(':')) // Exclude dynamic routes
  .map(route => ({
    icon: route.icon!,
    label: route.title,
    to: route.path,
    testId: route.testId!
  }));

// Helper function to get route by pathname
export const getRouteByPathname = (pathname: string): RouteConfig | undefined => {
  return ROUTES.find(route => {
    if (route.isActive) {
      return route.isActive(pathname);
    }
    
    // Default matching logic for static routes
    if (route.path.includes(':')) {
      // Handle dynamic routes
      const routePathParts = route.path.split('/');
      const pathnameParts = pathname.split('/');
      
      if (routePathParts.length !== pathnameParts.length) {
        return false;
      }
      
      return routePathParts.every((part, index) => {
        if (part.startsWith(':')) {
          return true; // Dynamic parameter
        }
        return part === pathnameParts[index];
      });
    }
    
    return route.path === pathname;
  });
};

// Helper function to get page title by pathname
export const getPageTitle = (pathname: string): string => {
  const route = getRouteByPathname(pathname);
  return route?.title || 'Dashboard';
};

// Helper function to check if a route is active
export const isRouteActive = (path: string, pathname: string): boolean => {
  const route = ROUTES.find(r => r.path === path);
  if (route?.isActive) {
    return route.isActive(pathname);
  }
  
  // Normalize pathname to handle trailing slashes
  const normalizedPathname = pathname.replace(/\/$/, '') || '/';
  
  // Special handling for dashboard routes
  if (path === '/' || path === '/dashboard') {
    return normalizedPathname === '/' || normalizedPathname === '/dashboard' || normalizedPathname === '';
  }
  
  // Default logic for other static routes - exact match
  return normalizedPathname === path;
};

// Export route constants for easy access
export const ROUTE_PATHS = {
  DASHBOARD: '/dashboard',
  STUDENTS: '/students',
  STUDENT_DETAIL: '/students/:id',
  ASSIGNMENTS: '/assignments',
  COMING_SOON: '/coming-soon'
} as const;

export const ROUTE_TITLES = {
  DASHBOARD: 'Class Dashboard',
  STUDENTS: 'Students',
  STUDENT_DETAIL: 'Student Detail',
  ASSIGNMENTS: 'Assignments',
  COMING_SOON: 'Coming Soon'
} as const; 