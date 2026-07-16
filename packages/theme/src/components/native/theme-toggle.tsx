import { Moon, Sun } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, StyleSheet, useColorScheme as useRNColorScheme } from 'react-native';

interface ThemeToggleProps {
    onToggle?: (theme: 'light' | 'dark') => void;
    size?: number;
    lightColor?: string;
    darkColor?: string;
}

/**
 * ThemeToggle - Composant de basculement de thème pour React Native
 *
 * Fonctionnement:
 * - Clic simple pour basculer entre Light ☀️ et Dark 🌙
 * - Utilise useColorScheme() pour détecter le thème système
 * - Appelle onToggle pour persister le choix (AsyncStorage, Context, etc.)
 *
 * Usage:
 * ```tsx
 * import { ThemeToggle } from '@playertracker/theme/native';
 *
 * <ThemeToggle
 *   onToggle={(theme) => {
 *     // Persister dans AsyncStorage ou Context
 *     AsyncStorage.setItem('theme', theme);
 *   }}
 * />
 * ```
 */
export function ThemeToggle({
    onToggle,
    size = 24,
    lightColor = '#000000',
    darkColor = '#FFFFFF',
}: ThemeToggleProps): React.ReactElement {
    const systemColorScheme = useRNColorScheme();
    const [theme, setTheme] = React.useState<'light' | 'dark'>(systemColorScheme || 'light');

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        onToggle?.(newTheme);
    };

    const iconColor = theme === 'dark' ? darkColor : lightColor;

    return (
        <Pressable
            onPress={toggleTheme}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            accessibilityRole='button'
            accessibilityLabel='Changer de thème'
        >
            {theme === 'dark' ? <Moon color={iconColor} size={size} /> : <Sun color={iconColor} size={size} />}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    buttonPressed: {
        opacity: 0.7,
    },
});
