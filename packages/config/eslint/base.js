import eslint from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';

/** @type {import("eslint").Linter.Config[]} */
export default [
    eslint.configs.recommended,
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            globals: {
                console: 'readonly',
                process: 'readonly',
                Buffer: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                global: 'readonly',
                module: 'readonly',
                require: 'readonly',
                exports: 'readonly',
                // Browser/Node globals
                URL: 'readonly',
                URLSearchParams: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                fetch: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': typescriptEslint,
        },
        rules: {
            ...typescriptEslint.configs.recommended.rules,
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-non-null-assertion': 'warn',
            'no-var': 'error',
            'prefer-const': 'error',
            'no-console': 'warn',
            'no-debugger': 'error',
            // TypeScript (via tsc) already checks for undefined variables/types.
            // ESLint's no-undef is not type-aware and produces false positives on
            // ambient globals (DOM types, the automatic JSX runtime's `React`
            // namespace, etc.). This is the fix recommended by typescript-eslint:
            // https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-am-using-a-rule-from-eslint-core-and-it-doesnt-seem-to-work-correctly-with-typescript-code
            'no-undef': 'off',
        },
    },
    prettierConfig,
    {
        rules: {
            // Quotes rules - Must be after prettier to override
            quotes: ['error', 'single', { avoidEscape: true }],
        },
    },
    {
        ignores: ['dist/', 'build/', '.next/', 'out/', 'node_modules/', '**/*.js', '**/*.mjs', '**/*.d.ts'],
    },
];
