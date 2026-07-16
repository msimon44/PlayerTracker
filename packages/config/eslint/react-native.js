import baseConfig from './base.js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactNativePlugin from 'eslint-plugin-react-native';

/** @type {import("eslint").Linter.Config[]} */
export default [
    ...baseConfig,
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                // React Native globals
                __DEV__: 'readonly',
                global: 'readonly',
                fetch: 'readonly',
                FormData: 'readonly',
                XMLHttpRequest: 'readonly',
                navigator: 'readonly',
                requestAnimationFrame: 'readonly',
                cancelAnimationFrame: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                // Expo globals
                expo: 'readonly',
            },
        },
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
            'react-native': reactNativePlugin,
        },
        rules: {
            // React
            'react/jsx-key': 'error',
            'react/prop-types': 'off',
            'react/react-in-jsx-scope': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',

            // React Native
            'react-native/no-unused-styles': 'error',
            'react-native/split-platform-components': 'error',
            'react-native/no-inline-styles': 'warn',
            'react-native/no-color-literals': 'warn',
            'react-native/no-raw-text': 'off',

            // TypeScript
            '@typescript-eslint/no-unused-vars': 'error',
            '@typescript-eslint/no-explicit-any': 'warn',

            // Quotes rules
            'jsx-quotes': ['error', 'prefer-single'],
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
];
