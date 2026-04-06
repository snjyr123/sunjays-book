/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use 'export' when we are building for the iOS bundle locally
  output: process.env.IS_IOS_BUILD ? 'export' : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
