import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for edge runtime
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    optimizePackageImports: ['framer-motion', 'lucide-react', 'date-fns', 'recharts'],
  },
  // Image optimization configuration for Cloudflare
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fugfefskstsdpiiitkjt.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Enable standalone output for OpenNext
  output: 'standalone',
  // Disable linting and type checking during build for faster deployments
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Webpack configuration for bundle optimization
  webpack: (config) => {
    // Tree shaking and code splitting optimizations
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      sideEffects: true,
      moduleIds: 'deterministic',
    };

    return config;
  },
};

export default nextConfig;
