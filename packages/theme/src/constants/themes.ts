/**
 * PlayerTracker - Theme Definitions
 *
 * Complete theme configurations for light and dark modes.
 * These themes combine all color constants into ready-to-use configurations.
 */

import { SEMANTIC_COLORS, SIDEBAR_COLORS, CHART_COLORS } from './colors';

/**
 * Light Theme Configuration
 * Default theme for PlayerTracker applications
 */
export const lightTheme = {
    // Semantic colors
    background: SEMANTIC_COLORS.light.background,
    foreground: SEMANTIC_COLORS.light.foreground,
    card: SEMANTIC_COLORS.light.card,
    cardForeground: SEMANTIC_COLORS.light.cardForeground,
    popover: SEMANTIC_COLORS.light.popover,
    popoverForeground: SEMANTIC_COLORS.light.popoverForeground,
    primary: SEMANTIC_COLORS.light.primary,
    primaryForeground: SEMANTIC_COLORS.light.primaryForeground,
    secondary: SEMANTIC_COLORS.light.secondary,
    secondaryForeground: SEMANTIC_COLORS.light.secondaryForeground,
    muted: SEMANTIC_COLORS.light.muted,
    mutedForeground: SEMANTIC_COLORS.light.mutedForeground,
    accent: SEMANTIC_COLORS.light.accent,
    accentForeground: SEMANTIC_COLORS.light.accentForeground,
    destructive: SEMANTIC_COLORS.light.destructive,
    destructiveForeground: SEMANTIC_COLORS.light.destructiveForeground,
    border: SEMANTIC_COLORS.light.border,
    input: SEMANTIC_COLORS.light.input,
    ring: SEMANTIC_COLORS.light.ring,
    radius: SEMANTIC_COLORS.light.radius,

    // Sidebar colors
    sidebar: {
        background: SIDEBAR_COLORS.light.background,
        foreground: SIDEBAR_COLORS.light.foreground,
        primary: SIDEBAR_COLORS.light.primary,
        primaryForeground: SIDEBAR_COLORS.light.primaryForeground,
        accent: SIDEBAR_COLORS.light.accent,
        accentForeground: SIDEBAR_COLORS.light.accentForeground,
        border: SIDEBAR_COLORS.light.border,
        ring: SIDEBAR_COLORS.light.ring,
    },

    // Chart colors
    chart: {
        1: CHART_COLORS.light.chart1,
        2: CHART_COLORS.light.chart2,
        3: CHART_COLORS.light.chart3,
        4: CHART_COLORS.light.chart4,
        5: CHART_COLORS.light.chart5,
    },
} as const;

/**
 * Dark Theme Configuration
 * Alternative theme with dark backgrounds and light text
 */
export const darkTheme = {
    // Semantic colors
    background: SEMANTIC_COLORS.dark.background,
    foreground: SEMANTIC_COLORS.dark.foreground,
    card: SEMANTIC_COLORS.dark.card,
    cardForeground: SEMANTIC_COLORS.dark.cardForeground,
    popover: SEMANTIC_COLORS.dark.popover,
    popoverForeground: SEMANTIC_COLORS.dark.popoverForeground,
    primary: SEMANTIC_COLORS.dark.primary,
    primaryForeground: SEMANTIC_COLORS.dark.primaryForeground,
    secondary: SEMANTIC_COLORS.dark.secondary,
    secondaryForeground: SEMANTIC_COLORS.dark.secondaryForeground,
    muted: SEMANTIC_COLORS.dark.muted,
    mutedForeground: SEMANTIC_COLORS.dark.mutedForeground,
    accent: SEMANTIC_COLORS.dark.accent,
    accentForeground: SEMANTIC_COLORS.dark.accentForeground,
    destructive: SEMANTIC_COLORS.dark.destructive,
    destructiveForeground: SEMANTIC_COLORS.dark.destructiveForeground,
    border: SEMANTIC_COLORS.dark.border,
    input: SEMANTIC_COLORS.dark.input,
    ring: SEMANTIC_COLORS.dark.ring,
    radius: SEMANTIC_COLORS.dark.radius,

    // Sidebar colors
    sidebar: {
        background: SIDEBAR_COLORS.dark.background,
        foreground: SIDEBAR_COLORS.dark.foreground,
        primary: SIDEBAR_COLORS.dark.primary,
        primaryForeground: SIDEBAR_COLORS.dark.primaryForeground,
        accent: SIDEBAR_COLORS.dark.accent,
        accentForeground: SIDEBAR_COLORS.dark.accentForeground,
        border: SIDEBAR_COLORS.dark.border,
        ring: SIDEBAR_COLORS.dark.ring,
    },

    // Chart colors
    chart: {
        1: CHART_COLORS.dark.chart1,
        2: CHART_COLORS.dark.chart2,
        3: CHART_COLORS.dark.chart3,
        4: CHART_COLORS.dark.chart4,
        5: CHART_COLORS.dark.chart5,
    },
} as const;

/**
 * Theme type (for TypeScript)
 */
export type Theme = typeof lightTheme;
