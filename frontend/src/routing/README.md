# Routing Module

## Overview

The Routing Module provides a centralized, type-safe routing system for the ToneTrace application. It serves as a single source of truth for routes, page titles, and navigation configuration, ensuring consistency across the application.

## Purpose

- **Single source for routes and page titles**: All routing information is defined in one place
- **Automatic page title updates**: Page titles update automatically based on the current route
- **Centralized navigation management**: Consistent navigation configuration across components
- **Type-safe routing**: Full TypeScript support with proper interfaces and types

## Core Components

### 1. Route Configuration (`routes.ts`)

The central routing configuration file that defines all application routes:

```typescript
export const ROUTES: RouteConfig[] = [
  {
    path: '/',
    title: 'Class Dashboard',
    element: 'DashboardPage',
    icon: HomeIcon,
    testId: 'nav-dashboard'
  },
  {
    path: '/students',
    title: 'Students',
    element: 'StudentsPage',
    icon: UsersIcon,
    testId: 'nav-students'
  },
  {
    path: '/students/:id',
    title: 'Student Detail',
    element: 'StudentDetailPage',
    icon: UsersIcon,
    testId: 'nav-student-detail'
  },
  {
    path: '/assignments',
    title: 'Assignments',
    element: 'AssignmentsPage',
    icon: ClipboardDocumentListIcon,
    testId: 'nav-assignments'
  }
];
```

### 2. Route State Hook (`useRouteState.ts`)

A custom React hook that provides reactive route state management:

```typescript
const { currentPathname, currentTitle, currentRoute, navigateTo } = useRouteState();
```

**Features:**
- **Reactive updates**: Automatically updates when routes change
- **Page title management**: Provides current page title for components
- **Navigation utilities**: Functions for programmatic navigation
- **Route information**: Access to current route configuration

### 3. Navigation Items (`NAVIGATION_ITEMS`)

Pre-processed navigation items for sidebar navigation:

```typescript
export const NAVIGATION_ITEMS: NavigationItem[] = ROUTES
  .filter(route => !route.path.includes(':')) // Exclude dynamic routes
  .map(route => ({
    icon: route.icon!,
    label: route.title,
    to: route.path,
    testId: route.testId!
  }));
```

## Key Features

### Route Types

- **Static Routes**: Fixed paths like `/`, `/students`, `/assignments`
- **Dynamic Routes**: Parameterized paths like `/students/:id`
- **Nested Routes**: Support for complex routing hierarchies

### Page Title Management

- **Automatic Updates**: Page titles update automatically based on current route
- **Fallback Handling**: Default titles for unknown routes
- **Dynamic Titles**: Support for route-specific title logic

### Navigation Support

- **Active State Detection**: Automatic highlighting of current route
- **Icon Integration**: Route-specific icons for visual navigation
- **Test ID Support**: Consistent testing identifiers for all routes

## Integration Points

### TopHeader Integration

The TopHeader component automatically reads the routing map to set page titles:

```typescript
// In TopHeader.tsx
import { useRouteState } from '../../routing';

export const TopHeader = () => {
  const { currentTitle } = useRouteState();
  
  return (
    <h2 className="text-lg font-semibold text-gray-900">
      {currentTitle}
    </h2>
  );
};
```

### SidebarNav Integration

The SidebarNav component uses the routing system for navigation and active state:

```typescript
// In SidebarNav.tsx
import { NAVIGATION_ITEMS, isRouteActive, useRouteState } from '../../routing';

export const SidebarNav = () => {
  const { currentPathname } = useRouteState();
  
  return (
    <nav>
      {NAVIGATION_ITEMS.map((item) => {
        const isActive = isRouteActive(item.to, currentPathname);
        // ... render navigation item
      })}
    </nav>
  );
};
```

## Usage Examples

### Basic Route Access

```typescript
import { ROUTES, ROUTE_PATHS, ROUTE_TITLES } from './routing';

// Access route information
const dashboardRoute = ROUTES.find(r => r.path === '/');
console.log(dashboardRoute?.title); // "Class Dashboard"

// Use route constants
const studentsPath = ROUTE_PATHS.STUDENTS; // "/students"
const studentsTitle = ROUTE_TITLES.STUDENTS; // "Students"
```

### Route State Management

```typescript
import { useRouteState } from './routing';

function MyComponent() {
  const { currentTitle, currentPathname, navigateTo } = useRouteState();
  
  const handleNavigation = () => {
    navigateTo('/students');
  };
  
  return (
    <div>
      <h1>Current Page: {currentTitle}</h1>
      <p>Path: {currentPathname}</p>
      <button onClick={handleNavigation}>Go to Students</button>
    </div>
  );
}
```

### Custom Route Logic

```typescript
import { getRouteByPathname, isRouteActive } from './routing';

// Check if a specific route is active
const isStudentsActive = isRouteActive('/students', window.location.pathname);

// Get route information for current path
const currentRoute = getRouteByPathname('/students/123');
console.log(currentRoute?.title); // "Student Detail"
```

## Helper Functions

### `getRouteByPathname(pathname: string)`

Returns the route configuration for a given pathname, handling both static and dynamic routes.

### `getPageTitle(pathname: string)`

Returns the page title for a given pathname, with fallback to default title.

### `isRouteActive(path: string, pathname: string)`

Checks if a route is currently active, supporting both exact and pattern matching.

## Route Configuration Interface

```typescript
interface RouteConfig {
  path: string;           // Route path (e.g., "/students/:id")
  title: string;          // Page title (e.g., "Student Detail")
  element: string;        // Component name (e.g., "StudentDetailPage")
  icon?: React.ComponentType<{ className?: string }>; // Navigation icon
  testId?: string;        // Testing identifier
  isActive?: (pathname: string) => boolean; // Custom active state logic
}
```

## Navigation Item Interface

```typescript
interface NavigationItem {
  icon: React.ComponentType<{ className?: string }>; // Navigation icon
  label: string;          // Display label
  to: string;             // Route path
  testId: string;         // Testing identifier
}
```

## Constants

### Route Paths

```typescript
export const ROUTE_PATHS = {
  DASHBOARD: '/',
  STUDENTS: '/students',
  STUDENT_DETAIL: '/students/:id',
  ASSIGNMENTS: '/assignments'
} as const;
```

### Route Titles

```typescript
export const ROUTE_TITLES = {
  DASHBOARD: 'Class Dashboard',
  STUDENTS: 'Students',
  STUDENT_DETAIL: 'Student Detail',
  ASSIGNMENTS: 'Assignments'
} as const;
```

## Benefits

### Developer Experience

- **Single source of truth**: All routing information in one place
- **Type safety**: Full TypeScript support with proper interfaces
- **Easy maintenance**: Update routes in one location
- **Consistent patterns**: Standardized routing approach

### User Experience

- **Consistent page titles**: Automatic title updates across the app
- **Reliable navigation**: Centralized navigation configuration
- **Visual feedback**: Proper active state highlighting
- **Smooth transitions**: Seamless route changes

### Application Architecture

- **Modular design**: Clean separation of routing concerns
- **Reusable components**: Navigation components can be shared
- **Scalable structure**: Easy to add new routes and features
- **Testing support**: Consistent test identifiers and patterns

## Best Practices

1. **Always use route constants**: Use `ROUTE_PATHS` and `ROUTE_TITLES` instead of hardcoded strings
2. **Keep routes centralized**: Add new routes only to the `ROUTES` array
3. **Use the hook**: Leverage `useRouteState` for reactive route information
4. **Test route logic**: Use the provided test IDs for consistent testing
5. **Handle dynamic routes**: Consider parameterized routes when designing navigation

## Future Enhancements

Potential improvements for future versions:
- **Route guards**: Authentication and authorization checks
- **Nested routing**: Support for complex route hierarchies
- **Route transitions**: Smooth animations between routes
- **Route analytics**: Track route usage and performance
- **Lazy loading**: Code splitting for route-based components 