const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    transpilePackages: ['@playertracker/theme', '@playertracker/utils'],
    turbopack: {
        root: path.resolve(__dirname),
    },
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    },
};

module.exports = nextConfig;
