/**
 * Design System Tokens
 * Single source of design tokens for consistent styling across the application
 */

export const tokens = {
  colors: {
    primary: "#6C5CE7",
    primarySoft: "#A78BFA",
    surface: "#FFFFFF",
    surfaceAlt: "#F8FAFC",
    text: "#0F172A",
    muted: "#64748B",
    border: "#E2E8F0",
    sidebarBg: "#0B1020",
    sidebarHover: "#11172B",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444"
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16
  },
  shadow: {
    card: "0 8px 20px rgba(2,6,23,.06)"
  },
  spacing_scale: [0, 4, 8, 12, 16, 20, 24, 28, 32],
  typography: {
    h1: "text-2xl font-semibold",
    h2: "text-xl font-semibold",
    h3: "text-lg font-semibold",
    body: "text-sm text-slate-700",
    muted: "text-xs text-slate-500"
  },
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280
  }
} as const;

// Type definitions for better TypeScript support
export type ColorToken = keyof typeof tokens.colors;
export type RadiusToken = keyof typeof tokens.radius;
export type ShadowToken = keyof typeof tokens.shadow;
export type SpacingToken = typeof tokens.spacing_scale[number];
export type TypographyToken = keyof typeof tokens.typography;
export type BreakpointToken = keyof typeof tokens.breakpoints;

// Utility functions for accessing tokens
export const getColor = (color: ColorToken): string => tokens.colors[color];
export const getRadius = (radius: RadiusToken): number => tokens.radius[radius];
export const getShadow = (shadow: ShadowToken): string => tokens.shadow[shadow];
export const getSpacing = (spacing: SpacingToken): number => spacing;
export const getTypography = (typography: TypographyToken): string => tokens.typography[typography];
export const getBreakpoint = (breakpoint: BreakpointToken): number => tokens.breakpoints[breakpoint];

// CSS custom properties for use in CSS-in-JS or CSS modules
export const cssCustomProperties = {
  '--color-primary': tokens.colors.primary,
  '--color-primary-soft': tokens.colors.primarySoft,
  '--color-surface': tokens.colors.surface,
  '--color-surface-alt': tokens.colors.surfaceAlt,
  '--color-text': tokens.colors.text,
  '--color-muted': tokens.colors.muted,
  '--color-border': tokens.colors.border,
  '--color-sidebar-bg': tokens.colors.sidebarBg,
  '--color-sidebar-hover': tokens.colors.sidebarHover,
  '--color-success': tokens.colors.success,
  '--color-warning': tokens.colors.warning,
  '--color-danger': tokens.colors.danger,
  '--radius-sm': `${tokens.radius.sm}px`,
  '--radius-md': `${tokens.radius.md}px`,
  '--radius-lg': `${tokens.radius.lg}px`,
  '--shadow-card': tokens.shadow.card,
} as const;

export default tokens; 