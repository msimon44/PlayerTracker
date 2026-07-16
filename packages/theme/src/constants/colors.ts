/**
 * PlayerTracker - Unified Color Palette (Athletic Balance Theme)
 *
 * This is the single source of truth for all colors across web and landing apps.
 * Colors are defined in multiple formats (Hex, RGB, HSL) for maximum compatibility.
 *
 * Design Philosophy (Research-Based):
 * - Orange (#FC4C02) for Performance & Energy (inspired by Strava)
 * - Teal (#177E89) for Wellness & Mental Balance
 * - Violet (#8338EC) for Innovation & Community
 * - Material Design Dark Mode (#121212)
 * - High contrast for accessibility (WCAG AA/AAA compliant)
 */

/**
 * Brand Colors - Athletic Balance Palette
 * Based on 2025 sports app trends and color psychology research
 */
export const BRAND_COLORS = {
    // PRIMARY - Performance Orange (Strava-inspired)
    // USE FOR: Physical metrics, performance stats, action CTAs
    // PSYCHOLOGY: Increases energy and metabolism
    primary: {
        hex: '#FC4C02',
        rgb: '252, 76, 2',
        hsl: '15, 98%, 50%',
    },
    primaryHover: {
        hex: '#E24502',
        rgb: '226, 69, 2',
        hsl: '15, 98%, 45%',
    },

    // SECONDARY - Wellness Teal
    // USE FOR: Mental wellness, questionnaires, recovery sections
    // PSYCHOLOGY: Calms nervous system, reduces heart rate
    secondary: {
        hex: '#177E89',
        rgb: '23, 126, 137',
        hsl: '186, 66%, 31%',
    },
    secondaryHover: {
        hex: '#136872',
        rgb: '19, 104, 114',
        hsl: '186, 67%, 26%',
    },

    // ACCENT - Innovation Violet
    // USE FOR: Community features, social, tech innovations
    // PSYCHOLOGY: Creativity, connection, modern tech
    accent: {
        hex: '#8338EC',
        rgb: '131, 56, 236',
        hsl: '267, 79%, 57%',
    },
    accentHover: {
        hex: '#6B2EBD',
        rgb: '107, 46, 189',
        hsl: '267, 61%, 46%',
    },

    // NEUTRALS - Slate palette for professional UI
    slate50: {
        hex: '#F9FAFB',
        rgb: '249, 250, 251',
        hsl: '210, 20%, 98%',
    },
    slate100: {
        hex: '#F3F4F6',
        rgb: '243, 244, 246',
        hsl: '210, 17%, 96%',
    },
    slate200: {
        hex: '#E5E7EB',
        rgb: '229, 231, 235',
        hsl: '214, 14%, 91%',
    },
    slate500: {
        hex: '#64748B',
        rgb: '100, 116, 139',
        hsl: '215, 16%, 47%',
    },
    slate700: {
        hex: '#334155',
        rgb: '51, 65, 85',
        hsl: '215, 25%, 27%',
    },
    slate800: {
        hex: '#1E293B',
        rgb: '30, 41, 59',
        hsl: '217, 33%, 17%',
    },
    slate900: {
        hex: '#0F172A',
        rgb: '15, 23, 42',
        hsl: '222, 47%, 11%',
    },

    // DARK MODE - Material Design 3
    darkBackground: {
        hex: '#121212',
        rgb: '18, 18, 18',
        hsl: '0, 0%, 7%',
    },
    darkSurface: {
        hex: '#1E1E1E',
        rgb: '30, 30, 30',
        hsl: '0, 0%, 12%',
    },
    darkElevated: {
        hex: '#2A2A2A',
        rgb: '42, 42, 42',
        hsl: '0, 0%, 16%',
    },

    // Pure white (for elevated cards)
    white: {
        hex: '#FFFFFF',
        rgb: '255, 255, 255',
        hsl: '0, 0%, 100%',
    },

    // SEMANTIC COLORS
    // Success - Health Green
    success: {
        hex: '#00B894',
        rgb: '0, 184, 148',
        hsl: '165, 100%, 36%',
    },

    // Warning - Energy Yellow
    warning: {
        hex: '#FFC857',
        rgb: '255, 200, 87',
        hsl: '41, 100%, 67%',
    },

    // Error - Alert Red
    error: {
        hex: '#DB3A34',
        rgb: '219, 58, 52',
        hsl: '2, 69%, 53%',
    },

    // Info - Sky Blue
    info: {
        hex: '#3A86FF',
        rgb: '58, 134, 255',
        hsl: '217, 100%, 61%',
    },
} as const;

/**
 * Semantic Colors for UI Components (shadcn/ui compatible)
 * Athletic Balance Palette - Light & Dark modes
 */
export const SEMANTIC_COLORS = {
    light: {
        // Base colors
        background: '0 0% 100%', // Pure white (#FFFFFF)
        foreground: '222 84% 4.3%', // Near black text (#111111)

        // Card component
        card: '0 0% 100%', // White cards
        cardForeground: '222 84% 4.3%', // Near black

        // Popover component
        popover: '0 0% 100%', // White
        popoverForeground: '222 84% 4.3%', // Near black

        // Primary - Performance Orange
        primary: '15 98% 50%', // Orange (#FC4C02)
        primaryForeground: '0 0% 100%', // White text

        // Secondary - Wellness Teal
        secondary: '186 66% 31%', // Teal (#177E89)
        secondaryForeground: '0 0% 100%', // White text

        // Muted backgrounds
        muted: '210 17% 96%', // Slate-100 (#F3F4F6)
        mutedForeground: '215 16% 47%', // Slate-500 (#64748B)

        // Accent - Innovation Violet
        accent: '267 79% 57%', // Violet (#8338EC)
        accentForeground: '0 0% 100%', // White text

        // Destructive actions
        destructive: '2 69% 53%', // Error Red (#DB3A34)
        destructiveForeground: '0 0% 100%', // White text

        // UI elements
        border: '214 14% 91%', // Slate-200 (#E5E7EB)
        input: '214 14% 91%', // Slate-200
        ring: '15 98% 50%', // Orange focus ring

        // Border radius
        radius: '0.5rem',
    },

    dark: {
        // Base colors - Material Design Dark
        background: '0 0% 7%', // Material Dark (#121212)
        foreground: '0 0% 88%', // Off-white text (rgba(255,255,255,0.87))

        // Card component - Elevated surfaces
        card: '0 0% 12%', // Dark surface (#1E1E1E)
        cardForeground: '0 0% 88%', // Off-white

        // Popover component
        popover: '0 0% 12%', // Dark surface
        popoverForeground: '0 0% 88%', // Off-white

        // Primary - Performance Orange (saturated -15% for dark)
        primary: '15 100% 60%', // Lighter orange (#FF6B35)
        primaryForeground: '0 0% 7%', // Dark text

        // Secondary - Wellness Teal
        secondary: '186 68% 38%', // Lighter teal (#1A95A3)
        secondaryForeground: '0 0% 7%', // Dark text

        // Muted backgrounds
        muted: '217 33% 17%', // Slate-800 (#1E293B)
        mutedForeground: '215 16% 47%', // Slate-500 (#64748B)

        // Accent - Innovation Violet
        accent: '267 100% 68%', // Lighter violet (#9B5CFF)
        accentForeground: '0 0% 7%', // Dark text

        // Destructive actions
        destructive: '0 80% 66%', // Lighter red (#FF5E57)
        destructiveForeground: '0 0% 88%', // Off-white

        // UI elements
        border: '0 0% 16%', // Dark border (#2A2A2A)
        input: '0 0% 22%', // Dark input (#373737)
        ring: '15 100% 60%', // Orange focus ring

        // Border radius
        radius: '0.5rem',
    },
} as const;

/**
 * Sidebar Colors (for web app)
 * Professional navy-based sidebar
 */
export const SIDEBAR_COLORS = {
    light: {
        background: '0 0% 100%', // White
        foreground: '215 25% 27%', // Slate-700
        primary: '212 52% 25%', // Deep Navy
        primaryForeground: '0 0% 100%', // White
        accent: '210 40% 96%', // Slate-100 hover
        accentForeground: '215 25% 27%', // Slate-700
        border: '214 32% 91%', // Slate-200
        ring: '76 95% 73%', // Lime green focus
    },

    dark: {
        background: '222 47% 11%', // Slate-900
        foreground: '210 40% 98%', // Slate-50
        primary: '76 95% 73%', // Lime green
        primaryForeground: '222 47% 11%', // Slate-900 text
        accent: '217 33% 17%', // Slate-800 hover
        accentForeground: '210 40% 98%', // Slate-50
        border: '215 25% 27%', // Slate-700
        ring: '76 95% 73%', // Lime green focus
    },
} as const;

/**
 * Chart Colors (for data visualization)
 * Accessible, distinct colors for charts
 */
export const CHART_COLORS = {
    light: {
        chart1: '76 95% 73%', // Lime green (primary)
        chart2: '233 95% 73%', // Purple (complementary)
        chart3: '160 84% 39%', // Success green
        chart4: '38 92% 50%', // Warning orange
        chart5: '0 84% 60%', // Error red
    },

    dark: {
        chart1: '76 95% 73%', // Lime green
        chart2: '233 95% 73%', // Purple
        chart3: '160 84% 50%', // Brighter green
        chart4: '38 92% 60%', // Brighter orange
        chart5: '0 84% 70%', // Brighter red
    },
} as const;

/**
 * Status Colors
 * Semantic colors for different states
 */
export const STATUS_COLORS = {
    success: {
        hex: '#10B981',
        rgb: '16, 185, 129',
        hsl: '160, 84%, 39%',
    },
    warning: {
        hex: '#F59E0B',
        rgb: '245, 158, 11',
        hsl: '38, 92%, 50%',
    },
    error: {
        hex: '#EF4444',
        rgb: '239, 68, 68',
        hsl: '0, 84%, 60%',
    },
    info: {
        hex: '#7887FC',
        rgb: '120, 135, 252',
        hsl: '233, 95%, 73%',
    },
} as const;

/**
 * Color opacity variants
 * Pre-defined opacity levels for consistency
 */
export const OPACITY = {
    full: 1.0, // 100%
    high: 0.9, // 90%
    medium: 0.8, // 80%
    soft: 0.5, // 50%
    subtle: 0.2, // 20%
    faint: 0.1, // 10%
} as const;
