import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // This tells Next.js that the site is hosted at /sunjays-book/
  basePath: '/sunjays-book',
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
