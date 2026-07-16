/** @type {import('next').NextConfig} */
const nextConfig = {
    poweredByHeader: false,
    transpilePackages: ['@playertracker/ui', '@playertracker/types', '@playertracker/utils', '@playertracker/theme'],
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
};

export default nextConfig;
