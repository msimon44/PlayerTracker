/**
 * @playertracker/theme
 *
 * Shared theme configuration and color system for PlayerTracker applications.
 * This package provides a unified color palette, theme definitions, and utilities
 * for consistent theming across web, landing, and mobile apps.
 *
 * UNIVERSAL EXPORTS (compatible with all platforms)
 *
 * Platform-specific components:
 * - Web/Next.js: import { ThemeToggle } from '@playertracker/theme/web'
 * - React Native: import { ThemeToggle } from '@playertracker/theme/native'
 */

// Export color constants (universal)
export { BRAND_COLORS, CHART_COLORS, OPACITY, SEMANTIC_COLORS, SIDEBAR_COLORS } from './constants/colors';

// Export theme definitions (universal)
export { darkTheme, lightTheme } from './constants/themes';
export type { Theme } from './constants/themes';

// Export types (universal)
export type {
    BrandColorKey,
    ChartColorNumber,
    ColorWithFormats,
    HexColor,
    HslColor,
    OpacityLevel,
    OpacityValue,
    RgbColor,
    SemanticColorToken,
    SidebarColorToken,
    ThemeConfig,
    ThemeMode,
} from './types/theme';
