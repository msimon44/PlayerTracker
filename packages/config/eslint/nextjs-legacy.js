/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: ['next/core-web-vitals', 'prettier'],
    rules: {
        // React
        'react/jsx-key': 'error',
        'react/no-unescaped-entities': 'off',
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',

        // Next.js
        '@next/next/no-html-link-for-pages': 'off',
        '@next/next/no-img-element': 'error',

        // TypeScript
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-empty-object-type': 'off',

        // Quotes rules
        quotes: ['error', 'single', { avoidEscape: true }],
        'jsx-quotes': ['error', 'prefer-single'],
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
