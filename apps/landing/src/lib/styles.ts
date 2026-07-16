/**
 * PlayerTracker Landing - Style Utilities
 *
 * Centralized style definitions using the new Professional Athletic theme.
 * All styles are compatible with light and dark modes.
 */

export const styles = {
    // Glass morphism effect (works in both themes)
    glass: 'bg-background/80 backdrop-blur-sm border border-border',

    // Text styles (theme-aware)
    text: {
        // Primary text - charcoal in light, off-white in dark
        primary: 'text-foreground',

        // Secondary/muted text
        secondary: 'text-muted-foreground',

        // Accent text - use sparingly for highlights
        accent: 'text-primary',

        // Heading styles
        h1: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-foreground',
        h2: 'text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground',
        h3: 'text-2xl sm:text-3xl font-bold text-foreground',
        h4: 'text-xl sm:text-2xl font-semibold text-foreground',

        // Body text
        body: 'text-base md:text-lg text-foreground',
        bodyMuted: 'text-base md:text-lg text-muted-foreground',
    },

    // Button styles (use shadcn Button component instead when possible)
    button: {
        // Primary CTA - lime green background
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90 font-semibold',

        // Secondary - deep navy background
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold',

        // Outline - subtle border
        outline: 'border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground',

        // Ghost - no background
        ghost: 'hover:bg-accent hover:text-accent-foreground',
    },

    // Card styles
    card: {
        default: 'bg-card text-card-foreground border border-border rounded-lg shadow-sm',
        hover: 'bg-card text-card-foreground border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow',
        glass: 'bg-card/80 backdrop-blur-sm text-card-foreground border border-border rounded-lg',
    },

    // Section styles
    section: {
        default: 'py-16 md:py-24 px-6 md:px-8',
        centered: 'py-16 md:py-24 px-6 md:px-8 text-center max-w-7xl mx-auto',
    },

    // Container styles
    container: {
        sm: 'max-w-2xl mx-auto',
        md: 'max-w-4xl mx-auto',
        lg: 'max-w-6xl mx-auto',
        xl: 'max-w-7xl mx-auto',
    },
} as const;

export const animations = {
    fadeIn: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
    },
    fadeUp: {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
    },
    scaleIn: {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5 },
    },
} as const;
