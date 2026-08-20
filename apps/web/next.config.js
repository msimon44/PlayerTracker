/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    transpilePackages: ['@playertracker/theme', '@playertracker/utils'],
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    },
};

module.exports = nextConfig;
