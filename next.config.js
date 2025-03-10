/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lwtrjbglrdehtwaxunop.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Disable ESLint during builds to clean up the console output
  // This doesn't disable ESLint in your editor or during development
  eslint: {
    // Only run ESLint when explicitly requested with 'npm run lint'
    ignoreDuringBuilds: true,
  },
  // Don't show React server component logging in the console
  logging: {
    level: process.env.NODE_ENV === 'production' ? 'error' : 'warn',
  },
};

module.exports = nextConfig;