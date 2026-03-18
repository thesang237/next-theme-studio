/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/next-theme-studio' : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
