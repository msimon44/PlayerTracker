import nextjsConfig from '@playertracker/config/eslint/nextjs.js';

/** @type {import("eslint").Linter.Config[]} */
export default [
    ...nextjsConfig,
    {
        ignores: ['.next/**'],
    },
];
