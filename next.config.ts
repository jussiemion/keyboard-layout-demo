import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  output: 'export',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: { unoptimized: true },
};
export default nextConfig;
