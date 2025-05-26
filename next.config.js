/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint checks during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript checks during builds
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: process.env.NEXT_PUBLIC_API_PROTOCOL || 'http',
        hostname: process.env.NEXT_PUBLIC_API_HOSTNAME || 'localhost',
        port: process.env.NEXT_PUBLIC_API_PORT || '5000',
        pathname: '/api/subharambh/images/**',
      },
    ],
    unoptimized: true,
    domains: ['images.unsplash.com', 'localhost', 'backend.shubhaarambh.co.in'],
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://shuabaarambh.onrender.com/api';
    return [
      {
        source: '/subharambh/images/:path*',
        destination: `${apiUrl}/subharambh/images/:path*`,
      },
    ];
  },
}

module.exports = nextConfig 