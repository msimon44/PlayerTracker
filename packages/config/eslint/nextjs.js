import baseConfig from './base.js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import nextPlugin from '@next/eslint-plugin-next';

/** @type {import("eslint").Linter.Config[]} */
export const nextjsConfig = [
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
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly',
                localStorage: 'readonly',
                sessionStorage: 'readonly',
                fetch: 'readonly',
                FormData: 'readonly',
                File: 'readonly',
                Blob: 'readonly',
                URL: 'readonly',
                URLSearchParams: 'readonly',
                // DOM types
                HTMLElement: 'readonly',
                HTMLButtonElement: 'readonly',
                HTMLDivElement: 'readonly',
                HTMLInputElement: 'readonly',
                HTMLParagraphElement: 'readonly',
                HTMLHeadingElement: 'readonly',
                Element: 'readonly',
                Node: 'readonly',
                Event: 'readonly',
                MouseEvent: 'readonly',
                KeyboardEvent: 'readonly',
            },
        },
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
            '@next/next': nextPlugin,
        },
        rules: {
            // React
            'react/jsx-key': 'error',
            'react/no-unescaped-entities': 'off',
            'react/prop-types': 'off',
            'react/react-in-jsx-scope': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',

            // Next.js
            '@next/next/no-html-link-for-pages': 'off',
            '@next/next/no-img-element': 'error',

            // TypeScript
            '@typescript-eslint/no-unused-vars': 'error',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-empty-object-type': 'off', // Allow empty interfaces for component props

            // Quotes rules
            quotes: ['error', 'single', { avoidEscape: true }],
            'jsx-quotes': ['error', 'prefer-single'],
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
];

export default nextjsConfig;
