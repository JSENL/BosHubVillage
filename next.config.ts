import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // Fix: Next.js was inferring wrong workspace root (parent dir with lockfile)
  turbopack: { root: path.resolve(process.cwd()) },
  // Only treat page.tsx/route.ts as routes - src/pages/*.tsx are app components, not routes
  pageExtensions: ['page.tsx', 'page.jsx', 'page.ts', 'page.js', 'route.ts', 'route.js'],
  transpilePackages: ['lucide-react'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/**',
      },
    ],
  },
};

export default nextConfig;
