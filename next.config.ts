import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    domains: ['*.vercel-storage.com', 'vercel-storage.com'],
    unoptimized: false,
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  /* config options here */
  typescript: {
    ignoreBuildErrors: false,
  },
  
  reactStrictMode: true,
  
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;