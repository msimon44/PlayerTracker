/**
 * PlayerTracker - Tailwind Configuration for React Native (NativeWind)
 *
 * This is a simplified version of the web config, adapted for NativeWind.
 * Uses the Athletic Balance color palette from the monorepo theme.
 */

import type { Config } from 'tailwindcss';
import { BRAND_COLORS, STATUS_COLORS } from './src/constants/colors';

const nativeConfig: Partial<Config> = {
    // NativeWind uses 'media' by default, but 'class' works too
    darkMode: 'class',

    theme: {
        extend: {
            colors: {
                // Primary - Performance Orange (Athletic Balance)
                primary: {
                    DEFAULT: BRAND_COLORS.primary.hex, // #FC4C02
                    foreground: BRAND_COLORS.white.hex, // White text
                },

                // Secondary - Wellness Teal
                secondary: {
                    DEFAULT: BRAND_COLORS.secondary.hex, // #177E89
                    foreground: BRAND_COLORS.white.hex, // White text
                },

                // Accent - Innovation Violet
                accent: {
                    DEFAULT: BRAND_COLORS.accent.hex, // #8338EC
                    foreground: BRAND_COLORS.white.hex, // White text
                },

                // Utility colors
                background: BRAND_COLORS.white.hex, // #FFFFFF
                foreground: BRAND_COLORS.slate900.hex, // #0F172A

                // Card
                card: BRAND_COLORS.white.hex, // #FFFFFF
                cardForeground: BRAND_COLORS.slate900.hex, // #0F172A

                // Semantic colors (from Athletic Balance palette)
                destructive: {
                    DEFAULT: BRAND_COLORS.error.hex, // #DB3A34
                    foreground: BRAND_COLORS.white.hex,
                },
                success: STATUS_COLORS.success.hex, // #10B981
                warning: STATUS_COLORS.warning.hex, // #F59E0B
                info: STATUS_COLORS.info.hex, // #7887FC

                // Muted backgrounds
                muted: {
                    DEFAULT: BRAND_COLORS.slate100.hex, // #F3F4F6
                    foreground: BRAND_COLORS.slate500.hex, // #64748B
                },

                // UI elements
                border: BRAND_COLORS.slate200.hex, // #E5E7EB
                input: BRAND_COLORS.slate200.hex, // #E5E7EB
                ring: BRAND_COLORS.primary.hex, // Orange focus ring

                // Neutrals for backgrounds
                slate: {
                    50: BRAND_COLORS.slate50.hex,
                    100: BRAND_COLORS.slate100.hex,
                    200: BRAND_COLORS.slate200.hex,
                    500: BRAND_COLORS.slate500.hex,
                    700: BRAND_COLORS.slate700.hex,
                    800: BRAND_COLORS.slate800.hex,
                    900: BRAND_COLORS.slate900.hex,
                },
            },

            borderRadius: {
                lg: '8px',
                md: '6px',
                sm: '4px',
            },

            // Simplified animations for React Native
            // (NativeWind has limited support for complex keyframes)
        },
    },
};

export default nativeConfig;
