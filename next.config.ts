import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only use 'export' when we are building for the iOS bundle locally
  output: process.env.IS_IOS_BUILD ? 'export' : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
