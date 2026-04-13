import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    optimizePackageImports: ['framer-motion', 'lucide-react', 'date-fns', 'recharts', 'echarts', 'echarts-for-react'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fugfefskstsdpiiitkjt.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
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
