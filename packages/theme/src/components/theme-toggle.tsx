'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import * as React from 'react';

interface ThemeToggleProps {
    className?: string;
}

/**
 * ThemeToggle - Composant de basculement de thème simple
 *
 * Fonctionnement:
 * - Clic simple pour basculer entre Light ☀️ et Dark 🌙
 * - Le choix est persisté via next-themes (localStorage)
 * - Reste actif jusqu'à ce que l'utilisateur change à nouveau
 * - Pas de retour automatique au système
 *
 * Usage:
 * ```tsx
 * import { ThemeToggle } from '@playertracker/theme';
 *
 * <ThemeToggle />
 * ```
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
    const { theme, setTheme, systemTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Évite les problèmes d'hydratation
    React.useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        // Détermine le thème actuel effectif
        const currentTheme = theme === 'system' ? systemTheme : theme;

        // Bascule vers l'opposé
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // Applique le nouveau thème (persisté automatiquement par next-themes)
        setTheme(newTheme);
    };

    const SunIcon = Sun as React.ComponentType<{ className?: string }>;
    const MoonIcon = Moon as React.ComponentType<{ className?: string }>;

    // Affiche un placeholder pendant le chargement
    if (!mounted) {
        return (
            <button
                className={
                    className ||
                    'h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors'
                }
                aria-label='Changer de thème'
                disabled
            >
                <span className='h-[1.2rem] w-[1.2rem]' />
            </button>
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className={
                className ||
                'h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors'
            }
            aria-label='Changer de thème'
        >
            {resolvedTheme === 'dark' ? (
                <MoonIcon className='h-[1.2rem] w-[1.2rem] transition-transform' />
            ) : (
                <SunIcon className='h-[1.2rem] w-[1.2rem] transition-transform' />
            )}
            <span className='sr-only'>Changer de thème</span>
        </button>
    );
}
