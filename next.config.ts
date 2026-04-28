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
  async redirects() {
    return [
      { source: '/bbva', destination: '/bancos-uruguay', permanent: true },
      { source: '/itau', destination: '/bancos-uruguay', permanent: true },
      { source: '/santander', destination: '/bancos-uruguay', permanent: true },
      { source: '/scotiabank', destination: '/bancos-uruguay', permanent: true },
      { source: '/brou', destination: '/bancos-uruguay', permanent: true },
      { source: '/heritage', destination: '/bancos-uruguay', permanent: true },
    ];
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
