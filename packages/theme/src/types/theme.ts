/**
 * PlayerTracker - Theme Type Definitions
 *
 * TypeScript types for theme configuration, color formats, and theme modes.
 */

/**
 * Color format types
 */
export type HexColor = `#${string}`;
export type RgbColor = `${number}, ${number}, ${number}`;
export type HslColor = `${number} ${number}% ${number}%` | `${number}, ${number}%, ${number}%`;

/**
 * Color with multiple format support
 */
export interface ColorWithFormats {
    hex: HexColor;
    rgb: RgbColor;
    hsl: HslColor;
}

/**
 * Theme mode
 */
export type ThemeMode = 'light' | 'dark';

/**
 * Semantic color token names
 */
export type SemanticColorToken =
    | 'background'
    | 'foreground'
    | 'card'
    | 'cardForeground'
    | 'popover'
    | 'popoverForeground'
    | 'primary'
    | 'primaryForeground'
    | 'secondary'
    | 'secondaryForeground'
    | 'muted'
    | 'mutedForeground'
    | 'accent'
    | 'accentForeground'
    | 'destructive'
    | 'destructiveForeground'
    | 'border'
    | 'input'
    | 'ring';

/**
 * Sidebar color token names
 */
export type SidebarColorToken =
    | 'background'
    | 'foreground'
    | 'primary'
    | 'primaryForeground'
    | 'accent'
    | 'accentForeground'
    | 'border'
    | 'ring';

/**
 * Chart color numbers
 */
export type ChartColorNumber = 1 | 2 | 3 | 4 | 5;

/**
 * Complete theme configuration
 */
export interface ThemeConfig {
    // Semantic colors
    background: HslColor;
    foreground: HslColor;
    card: HslColor;
    cardForeground: HslColor;
    popover: HslColor;
    popoverForeground: HslColor;
    primary: HslColor;
    primaryForeground: HslColor;
    secondary: HslColor;
    secondaryForeground: HslColor;
    muted: HslColor;
    mutedForeground: HslColor;
    accent: HslColor;
    accentForeground: HslColor;
    destructive: HslColor;
    destructiveForeground: HslColor;
    border: HslColor;
    input: HslColor;
    ring: HslColor;
    radius: string;

    // Sidebar colors
    sidebar: {
        background: HslColor;
        foreground: HslColor;
        primary: HslColor;
        primaryForeground: HslColor;
        accent: HslColor;
        accentForeground: HslColor;
        border: HslColor;
        ring: HslColor;
    };

    // Chart colors
    chart: {
        1: HslColor;
        2: HslColor;
        3: HslColor;
        4: HslColor;
        5: HslColor;
    };
}

/**
 * Brand color keys
 */
export type BrandColorKey = 'primary' | 'backgroundDark' | 'backgroundLight' | 'black' | 'white';

/**
 * Opacity level
 */
export type OpacityLevel = 'light' | 'medium' | 'soft' | 'subtle' | 'faint';
export type OpacityValue = 0.1 | 0.2 | 0.5 | 0.8 | 0.9;
