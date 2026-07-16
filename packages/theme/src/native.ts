/**
 * @playertracker/theme/native
 *
 * React Native-specific exports
 * Requires: lucide-react-native
 */

// Export native-specific components
export { ThemeToggle } from './components/native/theme-toggle';

// Re-export universal exports for convenience
export { BRAND_COLORS, CHART_COLORS, OPACITY, SEMANTIC_COLORS, SIDEBAR_COLORS } from './constants/colors';
export { darkTheme, lightTheme } from './constants/themes';
export type { Theme } from './constants/themes';
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
